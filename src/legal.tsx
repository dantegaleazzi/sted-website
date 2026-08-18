import { Logo } from './logo'

export type LegalDocument = 'privacy' | 'terms'

export function LegalPage({ document }: { document: LegalDocument }) {
  const isPrivacy = document === 'privacy'

  return <div id="top" className="min-h-screen legal-page">
    <header className="site-header shell">
      <Logo />
      <a className="button button-outline header-cta" href="#top">Back to Sted</a>
    </header>
    <main className="legal-content shell">
      <p className="section-label">FINIKS LABS LLC</p>
      <h1>{isPrivacy ? 'Privacy Policy' : 'Terms of Use'}</h1>
      <p className="legal-date"><strong>Last updated: August 18, 2026</strong></p>

      {isPrivacy ? <>
        <p>This Privacy Policy explains how Finiks Labs LLC (“Finiks Labs,” “we,” “us,” or “our”) handles information in connection with the Sted website at sted.ai (the “Site”).</p>
        <p>Sted is operated by Finiks Labs LLC.</p>
        <p>This Privacy Policy currently covers the Site and the Sted waitlist. The Sted application and other services may be subject to separate or updated privacy terms when they become available.</p>
        <h2>Information we collect</h2>
        <p>You can browse the Site without creating an account.</p>
        <p>If you join the Sted waitlist, we collect the email address you provide.</p>
        <p>If you contact us directly, we may also receive your email address and any information you choose to include in your message.</p>
        <p>We do not currently collect content through the Sted application because the application is not yet publicly available through the Site.</p>
        <h2>How we use your information</h2>
        <p>We use your email address to:</p>
        <ul><li>manage the Sted waitlist;</li><li>send you occasional updates about Sted, including product development, availability and early access; and</li><li>respond to you if you contact us.</li></ul>
        <p>You can unsubscribe from Sted emails at any time using the unsubscribe option included in our emails.</p>
        <h2>Cookies and analytics</h2>
        <p>We do not currently use advertising, behavioral tracking, or third-party marketing analytics on the Site.</p>
        <p>If this changes, we will update this Privacy Policy as appropriate.</p>
        <h2>Service providers</h2>
        <p>We may use service providers as necessary to operate the Site, maintain the waitlist, and send emails.</p>
        <p>These providers may process information on our behalf only as necessary to provide their services.</p>
        <p>We do not sell or rent your personal information or use it for third-party advertising.</p>
        <h2>Data retention</h2>
        <p>We keep your waitlist information for as long as reasonably necessary to manage the waitlist and communicate with you.</p>
        <p>You can unsubscribe at any time. If you unsubscribe, we may retain limited information necessary to record and respect your preference not to receive further marketing emails.</p>
        <h2>Your privacy rights</h2>
        <p>Depending on where you live, applicable law may give you rights regarding your personal information.</p>
        <p>You may contact us to ask about personal information we hold about you or to request its correction or deletion where applicable.</p>
        <p>We will handle applicable requests in accordance with applicable law.</p>
        <h2>Legal requirements</h2>
        <p>We may disclose information if reasonably necessary to comply with applicable law, legal process, or valid governmental requests, or to protect the rights, security, and integrity of Finiks Labs, Sted, or others.</p>
        <h2>Changes to this Privacy Policy</h2>
        <p>We may update this Privacy Policy as Sted develops or our practices change.</p>
        <p>When we make changes, we will update the “Last updated” date above.</p>
      </> : <>
        <p>These Terms of Use (“Terms”) govern your use of sted.ai (the “Site”).</p>
        <p>The Site and Sted are operated by Finiks Labs LLC (“Finiks Labs,” “we,” “us,” or “our”), a Wyoming limited liability company.</p>
        <p>By using the Site, you agree to these Terms.</p>
        <p>These Terms currently apply to the Site and waitlist only. Separate or additional terms may apply to the Sted application or other services when they become available.</p>
        <h2>Using the Site</h2>
        <p>You may browse, link to, and share the Site for lawful purposes.</p>
        <p>You may not use the Site unlawfully, interfere with its operation or security, attempt to gain unauthorized access to its systems, or use automated methods in a way that materially disrupts the Site.</p>
        <h2>Sted waitlist</h2>
        <p>You may provide your email address to join the Sted waitlist and receive occasional updates about Sted, including product development, availability and early access.</p>
        <p>You may unsubscribe from these emails at any time.</p>
        <p>Joining the waitlist does not guarantee access to Sted, a particular release date, any specific feature, pricing, or continued availability of the product.</p>
        <h2>Product information</h2>
        <p>Sted is currently under development.</p>
        <p>Descriptions, designs, screenshots, features, timelines, roadmaps and other information shown on the Site are informational and may change as the product develops.</p>
        <p>Nothing on the Site constitutes a binding commitment to release any particular feature, product, or service.</p>
        <h2>Intellectual property</h2>
        <p>Unless otherwise stated, the Site and its content, including its design, text, graphics, artwork, branding and software, are owned by Finiks Labs LLC or used with permission.</p>
        <p>Third-party trademarks and other intellectual property remain the property of their respective owners.</p>
        <p>You may link to the Site and share reasonable portions of its public content with attribution. You may not reproduce or republish substantial portions of the Site or present its content as your own without permission.</p>
        <h2>External links</h2>
        <p>The Site may link to websites or services operated by third parties.</p>
        <p>We are not responsible for their content, availability, security, or privacy practices. Their own terms and policies apply when you use them.</p>
        <h2>Disclaimer</h2>
        <p>The Site is provided on an “as is” and “as available” basis.</p>
        <p>To the fullest extent permitted by law, we do not guarantee that the Site will always be available, uninterrupted, error-free, or that all information published on it will always be complete, accurate, or current.</p>
        <h2>Limitation of liability</h2>
        <p>To the fullest extent permitted by applicable law, Finiks Labs LLC will not be liable for indirect, incidental, special, consequential, or similar damages arising from your use of, or inability to use, the Site.</p>
        <p>Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited.</p>
        <h2>Changes</h2>
        <p>We may modify, suspend, or discontinue any part of the Site at any time.</p>
        <p>We may also update these Terms from time to time. When we do, we will update the “Last updated” date above.</p>
        <h2>Governing law</h2>
        <p>These Terms are governed by the laws of the State of Wyoming, United States, without regard to its conflict of laws principles.</p>
      </>}

      <h2>Contact</h2>
      <p>{isPrivacy ? 'For privacy questions or requests, contact:' : 'Questions about these Terms can be sent to:'}</p>
      <address><strong>Finiks Labs LLC</strong><br />30 N Gould St Ste R<br />Sheridan, WY 82801<br />United States</address>
      <p><a className="legal-email" href="mailto:hello@finikslabs.com">hello@finikslabs.com</a></p>
      <div className="legal-switch"><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div>
    </main>
  </div>
}
