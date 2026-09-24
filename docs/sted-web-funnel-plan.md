# Sted — web funnel plan

> Documento histórico. La instrucción posterior de Dante reemplaza la entrada, los precios y la restricción de no implementar: ahora se prueban dos modales desde How it works. Ver [prototipos y estrategia actual](./sted-funnel-prototypes.md).

24 septiembre 2026 · Plan para revisión · **PROPOSED — NOT APPROVED**

Recomendación: **Find your plan después de How it works**. Download sigue directo a App Store. Tres preguntas → resultado → Free/Pro. Monthly + Annual; planes, pago y activación alojados en RevenueCat/Stripe.

**VERIFICATION=**

- PATH: `/Users/dantegaleazzi/Projects/01_Active/sted-web`.
- BRANCH inicial: `test-content-tunnel`. HEAD: `89b7ed2d07212476deb7dbb4b23018e08a29c2df` — `feat: build content tunnel portal preview`. STATUS inicial: limpio.
- Rama creada: `sted-web-funnel`, mismo HEAD. Único entregable nuevo: este documento. Sin implementación, commit, deploy ni cambios de configuración externa.
- **La base no contiene la landing publicada: tiene waitlist.** Revisé [sted.ai](https://www.sted.ai/) y el código 4c en `sted-new-web-d` / `e63bc36` mediante `git show`. Coinciden componentes/copy; SHA desplegado no confirmado. No incorporé código de esa rama.
- Sin acceso a APIs, Dashboard, mobile ni configuración privada RevenueCat/Stripe. Su estado actual sigue sin verificar.

**CURRENT_LANDING_CTA_MAP=**

| Superficie publicada | Actual | Destino / implicación |
|---|---|---|
| Header | Logo Sted + badge App Store | Descarga directa; sin navegación de secciones visible en la captura |
| Hero | Everything you save. Finally useful. + explicación + representación de saves → Sted → resultados | Ya introduce el valor; preservarlo |
| CTA principal del hero | Download on the App Store | Mismo destino que header y cierre |
| CTA secundario | See how it works | `#how-it-works`; muestra producto, no quiz |
| How it works | Save it. Sted does the rest. | Showcase de compartir, resumen/key points y magazine/recap |
| Why Sted | Meanwhile, Sted is working. | Cuatro escenas de uso y beneficios |
| Final CTA, `#download` | You saved it for a reason. Make it useful. + badge + Free to start | Descarga directa |
| Footer | About, Contact, Support, Privacy, Terms, Delete Account y redes | Mantener |
| Android | Ningún CTA Android encontrado en la home publicada | No agregar ni dirigir compradores a una app Android |

Los tres badges apuntan a [Sted en App Store](https://apps.apple.com/es/app/sted-ai/id6805940694). En `89b7ed2`: header How it works → `/about#how-it-works`, About, Contact, Join the waitlist; hero con formulario; sin CTA de descarga. Portal solo en preview interna.

El código 4c tiene `SignInLink` hacia Dashboard, ausente en la home observada; queda fuera. La landing menciona podcasts: **no incluirlos en Pro**.

**RECOMMENDED_FUNNEL_ENTRY=**

**Opción E**, con CTA **Find your plan** al terminar How it works, antes de Meanwhile. Un bloque compacto, sin nueva sección extensa:

> A little saving, or a lot?  
> Find the Sted plan that fits how you save.  
> **Find your plan**  
> 3 quick questions. Free is always an option.

Mantener los tres badges directos y el ancla See how it works. Repetir Find your plan como enlace secundario en el cierre. Campañas de intención Pro pueden entrar directamente en la futura ruta `/find-your-plan`.

**WHY=**

Evaluación cualitativa; son hipótesis, no resultados de experimentos.

| Opción | Claridad | Conversión Pro | Fricción | Installs | Coherencia | Mobile | Demo Shipaton |
|---|---|---|---|---|---|---|---|
| A. See how it works → quiz | Media: promete explicación | Más entradas, intención mixta | Media | Posible distracción | Rompe ancla útil | Fácil de tocar, expectativa ambigua | Alta interacción |
| B. Nuevo CTA en hero | Alta con Find your plan | Buena visibilidad | Baja, opt-in | Competencia por atención | Buena, pero tercer CTA | Hero más cargado | Alta visibilidad |
| C. Badge → elegir Free/Pro | Baja: contradice badge | Más exposición forzada | Alta | Mayor riesgo de perder installs | Mala | Interrumpe el tap a App Store | Se siente como barrera |
| D. CTA Pro junto al badge | Alta | Captura intención ya formada | Baja | Ligera competencia | Buena | Dos rutas comparables | Clara, menos narrativa |
| **E. Después de explicación** | **Alta** | **Menos volumen, intención más informada** | **Baja** | **Preserva ruta directa** | **La mejor continuidad** | **Un CTA contextual** | **Problema → demo → decisión** |

E convierte después de explicar. Riesgo: menor descubrimiento; medir exposición antes de moverlo al hero. Evaluar installs, compras canjeadas y devoluciones, además de pagos.

**FUNNEL_FLOW=**

```text
Landing ── Download ───────────────────────→ App Store → Sted Free
   │
   └─ See how it works → explicación existente
                              │
                        Find your plan
                              ↓
sted.ai              [1 Fuentes] → [2 Volumen] → [3 Problema]
                                                       ↓
                                               [4 Resultado]
                                                       ↓
RevenueCat Funnel                              [5 Free / Pro]
                                                ↙         ↘
                                         App Store     Monthly / Annual
                                                           ↓
                                               Stripe Checkout integrado
                                                           ↓
                                               Success + activación + email
                                                           ↓
                                         Instalar si hace falta → Redemption
                                                           ↓
                                               iOS confirma entitlement pro
```

Cinco pantallas; checkout/activación después. Paso 5 en RevenueCat evita repetir la selección. Objetivo tentativo: 45 segundos antes del checkout.

**EXACT_COPY_PER_STEP=**

Copy en inglés. Siempre: Back, cierre a landing, **Get Sted free** y respuestas conservadas al volver. Sin cuenta ni email en el quiz.

| Paso | Copy y opciones | Interacción / visual |
|---|---|---|
| **1 — Problema disperso** | **Where do you save things today?** · “Pick all that sound familiar.” · Instagram / X / Safari / YouTube / Notes / Messages / Everywhere · CTA **Continue** | Tiles seleccionables. Everywhere es excluyente y limpia las otras selecciones. Se pregunta por el hábito actual, no se promete importación ni acceso a esas cuentas. |
| **2 — Volumen** | **How much do you save in a typical month?** · “A rough guess is enough.” · **Up to 50** — A few things each week / **51–100** — A few things most days / **101–300** — A regular habit / **More than 300** — A lot to keep up with · enlace **Not sure** · CTA **Continue** | Una selección, sin autoavance sorpresivo. Rangos exploratorios, no tiers comerciales. |
| **3 — Pain** | **What usually happens to what you save?** · “Pick the one that feels most familiar.” · I forget about it / I can’t find it later / It’s scattered everywhere / I save it but never use it · enlace **None of these** · CTA **Show me** | Una elección; las respuestas neutras evitan forzar un problema que no existe. |
| **4 — Resultado** | **Give your saves a place to become useful.** · texto personalizado abajo · **SAVE → UNDERSTAND → ORGANIZE → RECAP** · CTA **See Free & Pro** · enlace **Get Sted free** | Cuatro mini cards con assets existentes. No loader de “AI analysis”: son reglas simples. |
| **5 — Plan** | **Choose the room you need.** · “Start free, or get more room with Pro.” · tarjetas Free y Pro · Free: **Get Sted free** · Pro: selector **Monthly / Annual**, luego **Continue with Pro** | No período seleccionado de forma oculta. Importe total, frecuencia y renovación visibles antes de continuar. |

Paso 4, copy de las cuatro cards: **Save** — “Send a link to Sted.” / **Understand** — “Get a summary and key points.” / **Organize** — “Keep saves in your Library and projects.” / **Recap** — “Come back to your saves in your daily recap.” Usar únicamente si el build de venta confirma estas capacidades; Projects no se presenta como asignación automática.

Personalización determinista del resultado, sin afirmar que leímos los saves:

- Varias fuentes o Everywhere: “Your saves live in different places. Sted gives the links you share one home.”
- Una fuente: “The things you save on [source] can be easier to come back to. Start by sharing a link with Sted.”
- Pain: olvidar → “Your recap brings saved ideas back into view.”; encontrar → “Keep your saves together in your Library.”; dispersión → “Organize them around your projects.”; nunca usar → “Summaries and key points give you a shorter way back in.”; neutral → “Keep what matters, ready for later.”
- Hasta 50 o Not sure: badge **Start with Free**; “Free is a good place to start. Upgrade if you need more room.”
- Más de 50: badge **Pro may fit your saving habit**; “Based on your estimate, you may need more than Free includes.” Mostrar límite explícito; “More than 300” no garantiza caber dentro de Pro.

Step 5 usa los valores **aprobados** del catálogo. Boceto de copy, no publicable todavía:

> **Free — $0**  
> Up to 50 saves per month. Library, projects, summaries and recap.  
> **Get Sted free** · No card needed.
>
> **Pro — More room for what you save**  
> Up to 500 saves per month, with processing included. Everything in Free.  
> Monthly — $5.99/month  
> Annual — $49.99/year · about $4.17/month, billed yearly  
> **Continue with Pro**  
> Monthly: “$5.99 billed every month. Renews automatically. Cancel before your next renewal.”  
> Annual: “$49.99 billed today and every year. Renews automatically. Cancel before your next renewal.”  
> “Final total, including applicable taxes, shown at checkout.”

Checkout: **Sted Pro**, período elegido, total, renovación, Terms/Privacy y acceso a soporte. Email recién acá para recibo y activación: “Use an email you can open on your iPhone.” No es un alta de cuenta Sted ni consentimiento de marketing. Aviso discreto: “Already have Pro? Check your subscription in Sted before buying again.”

**VISUAL_PROPOSAL=**

```text
┌────────────────────────────────┐
│ ← Back      Sted           ×    │
│           2 of 5               │
│                                │
│       [mascota existente]       │
│ How much do you save in a       │
│ typical month?                 │
│ A rough guess is enough.       │
│                                │
│ ○ Up to 50                     │
│ ● 51–100                       │
│ ○ 101–300                      │
│ ○ More than 300                │
│          Not sure              │
│                                │
│ [         Continue           ] │
│        Get Sted free           │
└────────────────────────────────┘
```

Una columna de 480–560 px en desktop; mobile con márgenes 20–24 px y targets ≥44 px. Cream `#FCF3EB`, Yellow `#FFD400`, ink `#141313`, cards blancas. Inter existente, títulos semibold, radios 20–24 px y sombras del sistema 4c. Supportive blue `#83B0FC`, pink `#FD95A0`, green `#B2D78F`, purple `#C998FA` solo en pequeñas superficies/iconos. Selección con borde/check, no solo color.

Reutilizar `public/sted-mascot.svg`, wordmark y tiles de fuentes; Notes/Messages pueden ser tiles de texto. La mascota progresa mediante posición y escala sutiles, sin nuevas ilustraciones ni animaciones que demoren. Resultado con mini cards de resumen, organización y recap existentes; ninguna card de podcast. Respetar reduced motion, teclado y foco. En mobile, Free y Pro apilados con Free completamente visible antes de Pro.

**FREE_PRO_PROPOSAL=**

**PROPOSED — NOT APPROVED.** Separar por capacidad actual, no por roadmap ni una supuesta calidad superior de AI.

| | Free | Pro |
|---|---|---|
| Saves nuevos / mes | 50, hipótesis inicial | 500, hipótesis condicionada a costos |
| Procesamiento | Resumen, key points y tags actuales dentro del cupo | Mismo procesamiento, mayor volumen |
| Library / Projects / Recap | Incluidos, si están en el build de venta | Incluidos |
| Al alcanzar cupo | Conservar acceso a lo guardado; informar próximo reset | Igual; sin cobros automáticos por excedente |
| Excluidos | Chat, podcast, EPUB, screenshot capture y futuro | También excluidos |

Modelo propuesto: un save nuevo aceptado consume una unidad; duplicados y reintentos técnicos no vuelven a contar. Cupo mensual también para Annual, no una bolsa anual ni rollover. Definir fecha de reset y tratamiento de saves fallidos antes de vender. **RevenueCat entrega entitlements; no implementa ni hace cumplir estos cupos del producto.** Si el sistema existente no los soporta, no publicarlos hasta un trabajo separado autorizado.

| Límite Free | Costo potencial | Hábito / conversión | Decisión |
|---|---|---|---|
| 25 | Menor exposición | Puede cortar antes de probar varios recaps | Demasiado restrictivo como punto inicial |
| **50** | Mitad del máximo variable de 100 | Aproximadamente 1–2 saves/día; deja demostrar valor y distingue uso frecuente | **Recomendado para validar** |
| 100 | Duplica exposición máxima frente a 50 | Mejor para formar hábito, menor presión de upgrade | Alternativa si los datos muestran que 50 corta activación |

Faltan costos y uso reales: medir extracción/AI por tipo, reintentos, almacenamiento y recap. Margen = ingreso neto de impuestos/comisiones/refunds − costos variables. Ejemplo **hipotético**: $0.01/save implica $0.50 por 50, $1 por 100 y $5 por 500; este último supera el ingreso mensual equivalente del Annual propuesto. Validar cupo/precio juntos. No prometer ilimitado ni contenido de cualquier longitud.

**PRICING_OPTIONS=**

| Estructura | Confianza / valor | Conversión | Churn | Explicación / riesgo de trap |
|---|---|---|---|---|
| Weekly + Annual | Gran salto entre compromisos | Entrada nominal barata; annual puede parecer venta forzada | Más renovaciones tempranas | Explicar semanal + cupo mensual confunde; riesgo mayor |
| **Monthly + Annual** | Frecuencia familiar; ahorro anual entendible | Equilibrio entre probar y comprometerse | Mejor hipótesis para hábito sostenido | Dos opciones simples; riesgo menor con total visible |
| Weekly + Monthly + Annual | Flexibilidad | Más elección, posible indecisión | Weekly sigue expuesto a abandono | Tres precios y ciclos; complejidad sin evidencia propia |

RevenueCat 2026 reporta retención a un año de aproximadamente 1–2% para weekly, 6–14% para monthly y 20–40% para annual, según categoría. Son referencias de cohortes, **no evidencia causal ni predicción de Sted**: también reflejan selección y compromiso. Mi inferencia: un producto de biblioteca/recap se alinea mejor con meses de uso que con urgencia semanal. [State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps)

**RECOMMENDED_PRICING_STRUCTURE=**

Monthly + Annual, mismo entitlement/cupo mensual. Sin trial con tarjeta: Free permite probar. Annual no preseleccionado ni “Most popular” sin datos. Weekly solo ante demanda real. Comparar revenue neto por visitante y activación.

**PROPOSED_PRICES=**

**PROPOSED — NOT APPROVED · USD · antes de impuestos aplicables.**

- Monthly: **$5.99/mes**.
- Annual: **$49.99/año**, equivalente aproximado **$4.17/mes**; alrededor de 30% menos que 12 pagos mensuales ($71.88).
- Weekly, solo alternativa de evaluación: **$1.99/semana**; $103.48 por 52 semanas, más caro en uso continuo. No lanzarlo por defecto.

Hipótesis propias, pendientes de costos, mercado/moneda y coherencia con precios iOS existentes.

**REVENUECAT_FUNNEL_BOUNDARY=**

Paso 5 como única pantalla de planes: Free sale hacia App Store; Pro selecciona Package Monthly/Annual → Checkout con Stripe Billing. Ofrecer las mismas capacidades y precios para todas las respuestas; la recomendación solo cambia copy/badge. RevenueCat soporta pantallas, Packages, condiciones y salidas sin compra. [Creating Funnels](https://www.revenuecat.com/docs/tools/funnels/creating-funnels)

Handoff: UTM y parámetros propios propuestos `recommended_plan`, `entry_point`, `funnel_version`; no son APIs reservadas. Sin email, saves ni identidad supuesta. Dominio RevenueCat inicialmente; `plans.sted.ai` opcional después. [Deploying Funnels](https://www.revenuecat.com/docs/tools/funnels/deploying-funnels)

Success/redemption nativos primero. **Validar en sandbox:** header/subheader, badges y `redeem_url` están documentados expresamente para **Web Purchase Links**; no asumir idéntico soporte en Funnels. Si faltara, evaluar Purchase Links como alternativa alojada, sin duplicar selección, antes de proponer success custom. [Web Purchase Links](https://www.revenuecat.com/docs/web/web-billing/web-purchase-links)

**STED_WEB_BOUNDARY=**

Landing/CTAs y `/find-your-plan`: pasos 1–4, estado local, resultado por reglas, salida Free y handoff con UTM. Sin SDK/API de pagos. Si falla: “Plans aren’t loading right now. Try again, or get Sted free.”

**STRIPE_BOUNDARY=**

Elegir **Stripe Billing** si queremos específicamente Stripe Checkout: queda embebido en el flujo RevenueCat. Stripe gestiona pago, suscripción, recibos y Customer Portal; RevenueCat envía el email de redemption. **RevenueCat Billing + Stripe como gateway es otra integración**, no sinónimo de Stripe Checkout. No mezclar catálogos. [Stripe Billing en RevenueCat](https://www.revenuecat.com/docs/web/integrations/stripe)

No crear sesiones Stripe ni webhooks propios. La integración oficial debe sincronizar el pago; visitar una success URL no prueba una compra. Stripe documenta que la confirmación fiable no puede depender del regreso del navegador. [Stripe: comportamiento postpago](https://docs.stripe.com/payments/checkout/custom-success-page?payment-ui=embedded-page)

**WEB_FIRST_FLOW=**

X / Instagram / Google → landing o ruta del quiz → 1–4 → Free/Pro en RevenueCat → Pro → Stripe → success + email → instalar Sted si hace falta → volver al link de activación → abrir app → canjear → comprobar Pro. Free en cualquier salida lleva directo a App Store.

**APP_FIRST_FLOW=**

Usuario con Sted → contenido/web → quiz/planes → checkout → success → Open Sted and activate Pro → canje en usuario actual. App instalada no implica identidad web conocida; no derivar App User ID del email ni crear login. Avisar a usuarios Pro que revisen su suscripción: sin identidad compartida no podemos garantizar evitar doble compra App Store/web. Sin nuevos links dentro de iOS.

**POST_PURCHASE_FLOW=**

Copy objetivo para success alojada; personalización de botones/layout sujeta a lo que permita el flujo nativo validado. **Pago completado ≠ Pro ya activado en el teléfono.**

> **Your purchase is complete. Activate Pro in Sted.**  
> Your activation link is also in your email.

| Contexto | Qué ve / hace el usuario |
|---|---|
| iPhone, app instalada | CTA **Open Sted and activate Pro**. El botón usa el enlace emitido por RevenueCat, no una URL inventada. |
| iPhone, sin instalar | **1. Download Sted** → badge App Store. **2. Come back here or open your activation email, then tap Activate Pro.** Segundo CTA **Open Sted and activate Pro**. Instalar no conserva ni canjea automáticamente el token. |
| Desktop | **Activate Pro on your iPhone.** “Open your activation email on your iPhone. Install Sted if needed, then tap the activation link.” Badge **Download Sted**. QR solo si el flujo RevenueCat probado lo ofrece correctamente; fallback suficiente: email. |

iPhone muestra ambas acciones: no hay detección fiable de instalación. Desktop no abre el custom scheme. Añadir **Need help? Contact support** y gestión nativa de suscripción. Sin redirect automático a App Store, QR propio ni “Pro is active” anticipado.

**REDEMPTION_FLOW=**

El link de RevenueCat es de un uso y expira a los 60 minutos. Requiere app instalada; no funciona directamente en desktop. Al intentar canjear uno vencido, RevenueCat envía uno nuevo. Prerrequisitos a confirmar fuera de este trabajo: iOS SDK compatible (mínimo documentado 5.14.1), URL scheme de la web config, handler de canje y comprobación del entitlement en CustomerInfo. Revisar identidad/transferencias; no transferir compras entre cuentas arbitrariamente. [Redemption Links](https://www.revenuecat.com/docs/web/redemption-links)

Estados de UX propuestos para coordinación posterior, sin cambios mobile ahora:

- Confirmado y entitlement activo: **Pro is ready.**
- Vencido, con respuesta de renovación: **This link expired. Check your email for a new activation link.**
- Link usado/incorrecto/otra cuenta: **We couldn’t activate this purchase. Check your account in Sted or contact support.**
- Fallo de red: **We couldn’t finish activation. Try again.** No pedir pagar otra vez.

**ANALYTICS_EVENTS=**

Los nombres pedidos son nuestro vocabulario de medición; no todos existen literalmente como eventos RevenueCat.

| Evento lógico | Fuente / disparador mínimo |
|---|---|
| `funnel_started` | Web: primera pantalla visible, una vez por sesión del quiz |
| `source_selected` | Web: Continue de paso 1; array de opciones |
| `volume_selected` | Web: Continue de paso 2; bucket o unknown |
| `pain_selected` | Web: Continue de paso 3; opción o none |
| `plan_viewed` | RevenueCat: inicio del paso de planes |
| `free_selected` | Web: salida Free en 1–4; RevenueCat: salida configurada Free en 5 |
| `pro_selected` | RevenueCat: continuar desde el plan hacia checkout; incluir período/producto, si el payload lo expone |
| `checkout_started` | RevenueCat: vista efectiva del paso checkout, no click previo |
| `purchase_completed` | Compra confirmada por RevenueCat; no pageview de success |
| `redemption_started` | Click de activación solo si el host lo expone, o intento recibido por app; no asumir evento web nativo |
| `redemption_completed` | RevenueCat reporta redemption rate; evento propio individual requeriría integración soportada o confirmación de la app con Pro activo, fuera del alcance |

RevenueCat mide sesiones de **su** funnel, vistas/abandono de pasos, conversión, revenue y purchase redemption rate. No observa los pasos 1–4 alojados en Sted. Si el cuestionario viviera allí también, guardaría respuestas nativamente, pero esa no es la división propuesta. [Analyzing Funnels](https://www.revenuecat.com/docs/tools/funnels/analyzing-funnels)

Sus eventos de integración incluyen `rc_workflows_step_started_event`, `rc_workflows_step_completed_event`, `rc_workflows_non_checkout_completion_event` y `rc_workflows_purchase_event`. Mapearlos por paso/salida; habilitar entrega a analytics posteriormente. El evento de interacción de compra no lleva revenue: usar lifecycle financiero como fuente monetaria y deduplicar. [Funnel Integrations](https://www.revenuecat.com/docs/tools/funnels/integrations)

Añadir `app_store_clicked` y `funnel_entry_viewed`. Click ≠ install; instalaciones necesitan App Store/atribución. Props: entry point, UTM, versión, bucket; nunca token/email. Correlación entre dominios requiere configuración. KPI: compras canjeadas/visitante; guardrails: installs, salida Free, abandono, revenue neto/refunds. Sin analytics ahora.

**FILES/COMPONENTS_THAT_WOULD_CHANGE=**

| Archivo/componente futuro | Cambio acotado |
|---|---|
| `src/main.tsx` | Ruta del onboarding; preservar rutas existentes |
| `src/components/landing-4c/Landing4CSections.tsx` | Entrada después de FeatureShowcase y enlace secundario final |
| `src/components/landing-4c/Landing4CSections.css` | Espaciado del nuevo bloque/CTA |
| `src/components/landing-4c/landing-4c-tokens.css` | Reutilizar tokens, sin cambiar identidad global |
| `src/components/growth-funnel/` — nuevo, propuesto | Shell, preguntas, resultado y reglas; ningún checkout propio |
| Assets Sted y cards existentes | Reutilizar; no regenerar ni copiar promesas de features ausentes |

4c existe en la referencia, **no en esta base**. Acordar primero su incorporación sin regresiones ni merge general silencioso. El viejo `src/pages.tsx` no representa producción. Worker, Dashboard, APIs y mobile quedan fuera.

**REVENUECAT_CONFIG_NEEDED=**

Checklist de configuración futura, no ejecutada:

1. Confirmar proyecto iOS existente, identificador real del entitlement Pro y capacidades actuales. Reutilizar el mismo entitlement en los productos web; no asumir que su ID literal es `pro`.
2. Propietario conecta Stripe; web config Stripe Billing y sandbox separado de live. Apariencia Sted, soporte y URL iOS correctos. [Configuración de pagos](https://www.revenuecat.com/docs/tools/funnels/configuring-payments)
3. Tras aprobar economía: productos/precios recurrentes Stripe → importar a RevenueCat → Offering web → Packages Monthly/Annual → entitlement existente. Free es una salida, no una suscripción de $0. Verificar configuraciones ya existentes antes de crear nada.
4. Funnel: plan, salida Free, Packages y Checkout; parámetros de recomendación/atribución. Branding compatible con el diseño anterior. Sin auth ni captura de email previa.
5. Redemption habilitado solo tras validar soporte de la app publicada. Success/email, reintento, app no instalada y desktop probados; verificar posibilidades reales de QR y copy nativo.
6. Stripe: gestión/cancelación en Customer Portal, recibos, moneda/impuestos y métodos compatibles. RevenueCat: sincronización y estados de entitlement verificados. Nada de endpoints propios.
7. Analytics nativo primero; integraciones y dominio propio después de aprobación. No publicar Funnel ni cambiar precios durante esta fase.

**DECISIONS_NEEDED_FROM_DANTE=**

- ¿Aprobar E: mantener See how it works y sumar Find your plan después del showcase?
- ¿Aprobar cinco pantallas, con pasos 1–4 en Sted y plan/checkout en RevenueCat?
- ¿Confirmar build vendible y matriz real de Free/Pro, costos por save y cupos actualmente aplicables? 50/500 queda como hipótesis.
- ¿Validar Monthly $5.99 / Annual $49.99, moneda/mercado y coherencia con iOS?
- ¿Confirmar quién puede acreditar redemption + entitlement en la app publicada y qué base corresponde a producción para integrar la rama luego?

Son decisiones para revisar este documento; no autorizan ejecutar configuración ni implementación.

**IMPLEMENTATION_BATCHES=**

1. **Base y diseño:** resolver divergencia de landing, aprobar copy/valores, preview local de 1–5 con planes ficticios claramente marcados. Sin pagos.
2. **Onboarding web:** rutas, respuestas, reglas y CTA contextual; accesibilidad/mobile, salida Free y medición aprobada. Mantener badges y ancla actual.
3. **RevenueCat/Stripe sandbox:** configuración autorizada, plan/checkout/success nativos; demostrar web-first y app-first con el build compatible existente. Si falta soporte mobile o enforcement de cuotas, registrar bloqueo para trabajo separado; no resolverlo en este repo.
4. **Validación y salida controlada:** comprobar canje, expiración, cuenta correcta, compra cancelada, retorno, no doble pago y acceso Free. Verificar economía y catálogo final; revisión/aprobación explícita antes de producción, productos live o publicación.

**RISKS=**

- Base antigua: desplegarla podría reemplazar la landing actual por waitlist.
- Pagar sin poder canjear: disponibilidad real del handler iOS es condición de lanzamiento, no algo solucionable con copy web.
- Oferta no sustentada: no vender límites sin enforcement ni capacidades basadas solo en la landing; Pro debe aportar capacidad real hoy.
- Márgenes: annual y usuarios intensivos pueden consumir más de lo cobrado; falta costo real.
- Doble suscripción: comprador anónimo con Pro de App Store no es identificable automáticamente por la web.
- Success/QR: no confundir capacidades de Purchase Links con las de Funnels ni instalar con activar.
- Conversión aparente: más pagos sin redemptions o menos installs no sería éxito.

**STOP — Documento para aprobación. No implementación ni publicación.**
