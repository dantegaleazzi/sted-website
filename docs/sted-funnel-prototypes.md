# Sted — dos prototipos de funnel

> A/B quedan como exploraciones anteriores. La dirección actual es la [conversación minimalista C](./sted-funnel-conversation.md), basada en el feedback posterior de Dante.

24 septiembre 2026. Preview local para elegir dirección; sin pagos conectados.

## Base y alcance

PATH verificado: `/Users/dantegaleazzi/Projects/01_Active/sted-web`. La primera revisión partió de `test-content-tunnel`, HEAD `89b7ed2`, limpio, y creó `sted-web-funnel` con el plan. Esa base tenía la waitlist antigua.

Para esta nueva instrucción se creó **`codex/sted-funnel-prototypes` desde `e63bc36`**, la referencia de la landing 4c en `sted-new-web-d`. El plan anterior estaba sin trackear y se conservó. SHA desplegado no confirmado. Sin commit ni deploy.

Se revisó la web publicada y se siguieron See how it works, App Store, About, Support y Terms. El badge va a la app correcta; How it works era un ancla. Header, hero, explicación, beneficios y CTA final conservan sus funciones. No se encontró CTA Android. El código de referencia tiene Sign in hacia Dashboard, que no aparecía en la home pública observada.

## Decisión de entrada

**See how it works → modal inmediata que primero explica el producto.** Así cumple la promesa del botón antes de hacer preguntas. Download sigue directo a App Store, también dentro del funnel. Se descarta interponer Free/Pro delante del badge. No hace falta esperar a una sección inferior para descubrir el recorrido.

La home normal conserva su comportamiento. La interacción nueva existe solo en las rutas de desarrollo:

- [A — Show me](http://127.0.0.1:5180/internal/funnel/a?open=1)
- [B — Try a save](http://127.0.0.1:5180/internal/funnel/b?open=1)

Cerrar la modal permite probar el CTA sobre la landing. La barra superior cambia de variante; es una herramienta de revisión, no parte del producto.

## Dos hipótesis, no dos skins

| | A — Show me | B — Try a save |
|---|---|---|
| Primera experiencia | Explicación breve en tres acciones | Elegís café o Kyoto y ves una muestra organizada |
| Wireflow | Explicación → fuentes → volumen → problema → planes | Ejemplo → volumen → problema → planes |
| Copy principal | “You save it. Sted makes it useful.” | “Give Sted a link. See what comes back.” |
| Ventaja | Explica capacidades y reconoce la dispersión | Demuestra valor antes de pedir respuestas; una pantalla menos |
| Riesgo | Se siente más como un cuestionario | Un ejemplo puede simplificar demasiado los resultados reales |
| Hipótesis | Mejor para quien necesita contexto | Mejor para tráfico frío y demo Shipaton |

**Recomiendo empezar con B**, manteniendo A como alternativa a comparar. Es una hipótesis de producto, no una afirmación de mejor conversión. B no procesa links: está rotulado como ejemplo. No hay espera falsa de AI.

Cream, Sted Yellow, tipografía de la landing, mascot, iconos y fotos existentes. Modal de dos columnas en desktop; pantalla completa en mobile, una pregunta por pantalla, progreso, Back, cierre y CTA fijo. Sin email, login ni conexión de cuentas.

## Copy y personalización

1. **Explicar/mostrar:** compartir un link → resumen/key ideas → library/projects → volver a usarlo. A: “Share a link”, “Get the useful parts”, “Come back. Go deeper.” B: “Try an example. No account, no typing.”
2. **Solo A:** “Where do your saves end up?” Instagram, X, Safari, YouTube, Notes, Messages o Everywhere. Multiselección; Everywhere excluye las demás.
3. **Volumen:** “A little saving, or a lot?” Hasta aproximadamente 50, 51–100, más de 100 al mes o “I’m not sure yet”. Son segmentos exploratorios, no límites comerciales.
4. **Problema:** “And then… what happens?” Olvidar, no encontrar, dispersión, no usar o una salida neutral.
5. **Planes:** “Make room for what matters.” Volumen bajo/desconocido recomienda empezar Free. Los demás sugieren más capacidad sin bloquear Free. El beneficio cambia según el problema: recap, biblioteca buscable o resumen.

Chat se describe únicamente como **disponible en el web dashboard**, según la confirmación de Dante. B explicita “Chat isn’t in the iPhone app yet.” No se presenta Chat como beneficio exclusivo Pro ni se inspeccionó/modificó Dashboard. Antes de vender hay que confirmar que ese acceso corresponde a la compra web; los términos actuales describen una sesión anónima iOS.

## Oferta del prototipo

| Plan | Precio solicitado | Presentación |
|---|---:|---|
| Free | $0 | Descarga directa; no checkout |
| Weekly | US$10 / semana | Cobro y renovación semanal explícitos |
| Monthly | US$12.99 / mes | Selección inicial visible |
| Annual | US$79 / año | US$6.58/mes equivalente; se cobran US$79 |

Los tres períodos están visibles. Annual ahorra aproximadamente 49% frente a 12 pagos mensuales. Weekly costaría US$520 por 52 renovaciones, frente a US$155.88 por 12 mensuales: **no lo recomendaría como default** por confianza y relación de valor. Está incluido al precio pedido, sin presentarlo como descuento o prueba gratuita.

Precios autorizados para mostrar en este prototipo; ningún producto real creado. Free/Pro aún no es una oferta lista para vender: falta fijar capacidad y costo de procesamiento. Se muestra “More saves · More AI processing”, con aviso de cupos pendientes. Hipótesis para validar: Free 50 saves/mes; contrastar con 100 según costo y retención. No publicar cupos ni prometer ilimitado sin enforcement. Chat, podcast, EPUB, screenshots y roadmap no se usan para justificar Pro.

## Frontera del pago y activación

```text
Landing ─ Download ───────────────────────────────→ App Store → Free
   └─ How it works → A o B → Free ─────────────────→ App Store
                              └─ Pro → RevenueCat Funnel
                                         → Stripe Checkout integrado
                                         → success + email de activación
                                         → instalar si hace falta
                                         → redemption link → Sted confirma Pro
```

Sted controla el mini onboarding y el copy previo. RevenueCat debe alojar la selección comercial definitiva, checkout/success y redemption soportados; Stripe cobra y gestiona la suscripción. El plan local es un diseño de referencia. En integración se debe evitar pedir el mismo plan dos veces: validar el handoff soportado o mover la selección final completa al paso nativo, sin inventar parámetros.

El prototipo muestra checkout y postcompra como **simulaciones**, sin capturar tarjetas/email ni abrir sesiones. iPhone instalado: “Open Sted and activate Pro”. Sin instalar: App Store y luego volver al link. Desktop: abrir email en iPhone. No se fabricó un QR ni un deep link. La success real debe usar las capacidades nativas de RevenueCat.

Web-first y app-first comparten ese canje; app-first omite instalación. Compra, instalación y entitlement activo son estados diferentes. No se puede garantizar activación desde este repo: verificar SDK/handler e identidad de la app publicada y reutilizar su entitlement real, sin tocar mobile aquí. Prevenir doble suscripción de usuarios ya Pro y probar links vencidos/usados antes del lanzamiento.

## Qué tomé de los tres videos

Revisé las transcripciones; no reproduje los tres videos completos de principio a fin.

- [Ashley Black / SubClub](https://www.youtube.com/watch?v=9aL7JDHXHwI), especialmente 31:04–36:55 y 1:07:26–1:10:50: separar intención de instalar de intención de comprar, y cuidar el valor Free a lo largo del recorrido. Aplicación: descarga directa siempre accesible.
- [Mobbin: 2,995 Paywalls](https://www.youtube.com/watch?v=9ypqs_2fAl8), 0:37–2:38, 5:34–8:12 y 9:30–11:45: el contexto anterior al paywall importa, una demo comunica valor y menos preguntas no garantiza más conversión. Aplicación: A y B prueban mecanismos distintos, sin urgencia artificial.
- [RevenueCat: Building a Web Funnel](https://www.youtube.com/watch?v=1uvE4V57F5c), 0:59–1:34 y 3:00–4:20: secuencia de pasos, branching y success con descarga/canje nativos. Aplicación: no construir un backend de checkout.

Referencia oficial: [Payments](https://www.revenuecat.com/docs/tools/funnels/configuring-payments), [Funnels analytics](https://www.revenuecat.com/docs/tools/funnels/analyzing-funnels), [Integrations](https://www.revenuecat.com/docs/tools/funnels/integrations). La investigación técnica más detallada se conserva en el plan histórico; sus precios y entrada fueron reemplazados por esta instrucción.

## Validación y siguientes lotes

Verificado: typecheck, lint, 12 tests existentes y build; ambos recorridos en navegador, mobile/desktop, precios, Free, selección excluyente, respuesta neutral, ejemplos alternativos, checkout/activación simulados, Escape y retorno de foco. No es prueba de compras ni de activación iOS.

1. **Ahora:** elegir A o B y ajustar copy/jerarquía con este preview.
2. **Oferta:** confirmar límites, costos, alcance web/iOS y catálogo aprobado. Configurar sandbox únicamente con autorización para esa etapa.
3. **Integración:** RevenueCat Funnel + Stripe + redemption nativos; validar canje con un build compatible existente. Sin backend nuevo.
4. **Medición y salida:** instrumentar onboarding propio y analytics nativo de RevenueCat; validar compras canjeadas, installs y refunds antes de publicar.

Eventos futuros: `funnel_started`, `source_selected` (solo A), `volume_selected`, `pain_selected`, `plan_viewed`, `free_selected`, `pro_selected`, `checkout_started`, `purchase_completed`, `redemption_started`, `redemption_completed`. Sted mide pasos propios; RevenueCat mide su funnel/compra/redemption según su integración. Un click en activar no confirma entitlement. No se implementó analytics.

Archivos de código: nuevo `growth-funnel/FunnelPrototype.tsx` y CSS; callback opcional en `Landing4CPreview.tsx`; rutas DEV en `main.tsx`. Sin nuevas dependencias. Sin modificaciones a APIs, Dashboard, mobile, configuración de pagos o producción.
