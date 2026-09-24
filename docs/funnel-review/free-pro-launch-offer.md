# Sted — Free / Pro launch offer, preview para revisión

Implementado sobre `codex/sted-funnel-prototypes`, base `e63bc36`. Sin deploy, checkout live, productos, backend/enforcement, mobile, Dashboard ni auth. Configuración interna: `PRICING_CONFIG_PROPOSED`; ese estado no se muestra en el diseño comercial.

**FUNNEL_URL_LOCAL=** http://127.0.0.1:5180/internal/funnel/c?open=1

Atajos de revisión, con respuestas de ejemplo explícitas en el query `review`: [resultado Pro](http://127.0.0.1:5180/internal/funnel/c?review=pro), [resultado Free](http://127.0.0.1:5180/internal/funnel/c?review=free). Los atajos simulan volumen alto/bajo y dificultad para encontrar; el recorrido normal usa las respuestas reales de esa sesión.

**FINAL_STEP_SCREENSHOT_DESKTOP=** [Desktop](./final-step-desktop.png), comparación y selector Monthly.

**FINAL_STEP_SCREENSHOT_MOBILE=** [Mobile](./final-step-mobile.png), desplazado a precios para mostrar Pro → períodos → Free y CTA persistente.

**FREE_PLAN_COPY=**

Free — $0

- 1,000 Saves
- 100 AI Saves / month
- 25 Chat messages / month
- Recap · Library · Projects · Search

**PRO_PLAN_COPY=**

Pro — LAUNCH OFFER

- Unlimited Saves
- 1,000 AI Saves / month
- 500 Chat messages / month
- Everything in Free

Nota común: **Chat with your saves — Web app available now · iOS coming soon**. Chat está incluido en ambos planes, con distinta capacidad.

Definiciones desplegables, sin modal adicional:

- AI Saves: “Sted reads the content and creates its summary, key points and topics.”
- Chat messages: “Ask questions about what you've saved.”

Saves es capacidad de guardado, sin sufijo mensual. AI Saves y Chat messages son cupos mensuales. No se implementó ni verificó bloqueo server-side de estas cantidades.

**WEEKLY_PRICE=** US$10 / week — A week at a time.

**MONTHLY_PRICE=** US$12.99 / month — Stay flexible. Selección inicial.

**ANNUAL_PRICE=** US$79 / year — BEST VALUE; US$6.58/mo equivalent. El cargo es anual, no mensual.

**ANNUAL_SAVINGS=** 12 × US$12.99 = US$155.88; ahorro US$76.88 = 49.3199897…%, mostrado como **49.3%**. También cuesta menos que 52 pagos semanales. Ahorro, equivalente y condición Best Value calculados desde importes en centavos, no duplicados en el copy.

**WEEKLY_PACKAGE_EXPECTED=** `weekly → PACKAGE_WEEKLY`

**MONTHLY_PACKAGE_EXPECTED=** `monthly → PACKAGE_MONTHLY`

**ANNUAL_PACKAGE_EXPECTED=** `annual → PACKAGE_ANNUAL`

Son placeholders esperados, **no IDs reales del SDK**. `previewCheckoutIntent()` conserva período, importe en centavos, USD, package esperado y estado propuesto. Start Pro muestra la explicación de checkout simulado; no llama APIs, no crea sesión ni cobra. El mapping se verifica también en el DOM del siguiente paso mediante `data-package-expected`.

**REVENUECAT_CONFIG_NEEDED=**

Del RevenueCat Owner, para una integración posterior autorizada:

1. ID del proyecto existente, app/web configuration correspondiente y entitlement exacto compartido con iOS; confirmar acceso web/iOS que realmente concede.
2. Offering identifier y package identifiers reales para Weekly, Monthly y Annual; los Stripe Product/Price IDs correspondientes en **test mode**, con USD e intervalos correctos.
3. Confirmar la conexión Stripe Billing y el funnel draft/sandbox; URL soportada de entrada y mecanismo oficial para conservar período/package elegido sin hacer elegir otra vez. No se inventaron parámetros de handoff.
4. Redemption y success/email habilitados para esa configuración. App Store URL, bundle/app correspondiente, link/scheme admitido por el build publicado, SDK/handler compatible y comportamiento de identidad de compradores anónimos y usuarios ya Pro. No se cambió mobile.
5. Flujo de cancelación/gestión de suscripción, URLs Terms/Privacy/Support, impuestos, moneda y total final. Confirmar copy de la oferta y cobertura legal antes de live.

Separado de RevenueCat: acordar y verificar enforcement de Saves, AI Saves y Chat messages, semántica del reset mensual, contenido soportado y estados de suscripción. Esto no queda resuelto por crear packages. Es requisito previo a publicar la oferta, no parte del preview.

**PERSONALIZATION=**

- Volumen light/unsure/sin respuesta: “Free is a great place to start.”
- Daily/heavy: “Based on how much you save, Pro fits you best.” No dice que 51–100 exceda Free; recomienda más margen.
- No encuentra: “Keep more of what matters searchable and ready when you need it.”
- Guarda y olvida: “Turn more of your saves into summaries, key ideas and conversations.”
- Varias fuentes/Everywhere, cuando no hay un pain más específico: “Bring what you save into one Library — and organize it around Projects.”
- Organizado: “Keep your system. Let Sted do more of the reading.”

Solo cambia framing/recomendación. Precios y capacidad son constantes. Se puede elegir cualquiera de los dos planes. Pro mantiene tratamiento de marca, incluso cuando el quiz recomienda empezar Free. En mobile con recomendación Pro: Pro → períodos → Free; Continue with Free queda accesible en el footer en todo momento.

**FILES_CHANGED=**

- `src/components/growth-funnel/ConversationalFunnel.tsx`: integra resultado, atajos DEV y transición simulada con package esperado.
- `src/components/growth-funnel/FunnelPlanResult.tsx`: resultado, capacidades, selector, definiciones y CTA.
- `src/components/growth-funnel/FunnelPlanResult.css`: desktop/mobile, jerarquía Pro y targets táctiles.
- `src/components/growth-funnel/funnel-pricing.ts`: modelo comercial propuesto, matemática, framing y mapping.
- `src/components/growth-funnel/funnel-pricing.test.ts`: cálculo anual, los tres packages/renovaciones y recomendación.
- Este documento, dos capturas y nota de reemplazo en `docs/sted-funnel-conversation.md`.

Las modificaciones previas de la rama en landing/main y prototipos A/B permanecen; no son cambios nuevos de esta iteración.

**BUILD=** PASS. Typecheck y lint también PASS.

**TESTS=** 17 tests pasan, 5 archivos (12 existentes + 5 nuevos). Verificación UI: desktop y mobile hasta 320 CSS px; sin overflow; targets interactivos del resultado ≥44px; Free directo a App Store; Weekly/Annual preservados al pasar a checkout; definiciones accesibles y excluyentes; cupos/precios constantes; copy de disponibilidad común; estado propuesto solo interno. No constituye prueba de compra ni de entitlement iOS.

**CONVERSION_RATIONALE=**

- El resultado conecta el hábito declarado con un beneficio antes de mostrar capacidad y precio.
- Tres cantidades comparables hacen visible el salto a Pro, sin ocho bullets equivalentes.
- Cream y un acento amarillo dan protagonismo a Pro; Free conserva precio y salida directa.
- Tres períodos explícitos, renovación y ahorro calculado reducen incertidumbre sin escasez artificial.
- CTA persistente, salida Free y activación explicada mantienen continuidad en mobile.

**STOP — listo para review.**

## Preview compartible — 24 septiembre 2026

Publicado por pedido de Dante en un Worker estático independiente:

- Landing: https://sted-web-funnel-preview.dante-b34.workers.dev/
- Funnel abierto: https://sted-web-funnel-preview.dante-b34.workers.dev/?open=1
- Resultado Pro: https://sted-web-funnel-preview.dante-b34.workers.dev/?review=pro
- Resultado Free: https://sted-web-funnel-preview.dante-b34.workers.dev/?review=free
- Worker: `sted-web-funnel-preview`.
- Version ID: `3658d3e9-cba7-400f-90d6-eef733e09b2e`.

Build: `npm run build:funnel-preview`. Deploy: `npx --no-install wrangler deploy --config wrangler.funnel-preview.toml`. El modo dedicado habilita el funnel en la raíz y `/internal/funnel/c`, emite `dist-funnel-preview` y agrega `noindex, nofollow`. Terms, Privacy y Support redirigen a sted.ai. El config de producción queda separado.

Verificado: typecheck, lint, 17 tests, build normal y build preview; HTTP 200 y cabecera noindex; apertura pública del cuestionario, capacidades/precios del resultado y transición a checkout simulado. No se habilitaron cobros ni activación real. Las menciones anteriores a ausencia de deploy describen la entrega local previa; ahora existe este preview público, sin cambios en producción.
