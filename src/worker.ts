interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
  RESEND_API_KEY: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MESSAGE_MIN = 10
const MESSAGE_MAX = 2000

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

async function handleSupportRequest(request: Request, env: Env): Promise<Response> {
  let payload: { name?: unknown; email?: unknown; message?: unknown; website?: unknown }
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid request body' }, 400)
  }

  // Honeypot: real users never fill this field. Bots that do get a fake success.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return jsonResponse({ ok: true }, 200)
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''

  if (!name || name.length > 100) return jsonResponse({ ok: false, error: 'Invalid name' }, 400)
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return jsonResponse({ ok: false, error: 'Invalid email' }, 400)
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) return jsonResponse({ ok: false, error: 'Invalid message length' }, 400)

  if (!env.RESEND_API_KEY) return jsonResponse({ ok: false, error: 'Support email is not configured' }, 500)

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Sted Support <support@sted.ai>',
      to: 'hello@sted.ai',
      reply_to: email,
      subject: `Sted Support — ${email}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  })

  if (!resendResponse.ok) return jsonResponse({ ok: false, error: 'Failed to send message' }, 502)

  return jsonResponse({ ok: true }, 200)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.hostname === 'sted.ai') {
      url.hostname = 'www.sted.ai'
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/api/support' && request.method === 'POST') {
      return handleSupportRequest(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
