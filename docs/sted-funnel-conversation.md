# Sted — conversación web, versión C

> El recorrido conversacional sigue vigente. La oferta 50/500 de este documento fue reemplazada por el [modelo Free/Pro de esta etapa](./funnel-review/free-pro-launch-offer.md): Saves, AI Saves y Chat messages separados.

Preview: http://127.0.0.1:5180/internal/funnel/c?open=1

Rama: `codex/sted-funnel-prototypes`, base `e63bc36`. Cambios locales, sin commit ni deploy.

## La historia

**Me reconoce → entiende mi hábito → me muestra cómo ayuda → me propone capacidad.**

How it works abre la primera pregunta. La presentación de Sted vive ahí mismo, sin una pantalla de bienvenida adicional. Cinco pantallas antes del checkout, una sola columna. La mascota habla con el usuario; no ocupa una columna decorativa.

| Pantalla | Copy principal | Qué logra |
|---|---|---|
| 1. Fuentes | **Hi, I’m Sted.** A few questions. I’ll show you how I can help. / **Where do you save links?** | Reconocer el hábito sin explicar toda la solución. Instagram, YouTube, X, Safari, Notes, Messages; multiselección, Everywhere o explorar sin responder. |
| 2. Hábito | **And what happens after you save?** | Olvidar / no encontrar / ser organizado / estar empezando. La respuesta es genuina; no se fuerza un sí. La frase introductoria usa las fuentes elegidas. |
| 3. Respuesta | **Give “later” a little help.** / **Less searching. More finding.** / **Keep your system. Skip the reading.** / **Make your first saves useful.** | Una explicación breve según la respuesta y una única tarjeta de ejemplo: link → resumen + tags. No hay proceso AI real ni promesas de ahorro de tiempo. |
| 4. Volumen | **How much do you usually save?** A rough guess is all I need. | Hasta 50 / 51–100 / más de 100 al mes / no sé. Es segmentación, no una medición real. |
| 5. Elección | **Start small. It’s free.** o **Room for your curiosity.** | Free o Pro. Bajo volumen/desconocido empieza en Free; uso diario/intensivo sugiere Pro. Ambas opciones se pueden elegir. |

En el ejemplo, “Example” identifica contenido ilustrativo. Chat vive en una explicación desplegable y dice expresamente que está en Dashboard web, no en iPhone. No se vende como función exclusiva Pro.

## Qué se simplificó

- Se elimina la columna lateral y la combinación de dos títulos, stickers, fotos y múltiples cards.
- Una pregunta, un grupo de respuestas, un CTA principal. Sin subtítulos decorativos en mayúsculas ni otra página para saludar.
- El resultado aparece después de reconocer el problema. Al organizado se le ofrece ayuda con la lectura, sin descalificar su sistema.
- Pro se explica por capacidad. El precio y la renovación permanecen visibles cuando se selecciona Pro.
- App Store sigue directo en la landing y existe una salida Free durante las preguntas.

## Capacidad: PROPOSED — NOT APPROVED

Para hacer revisable la comparación se muestran **Free: 50 saves/mes; Pro: 500 saves/mes**, con aviso visible de cupos propuestos. Ambos incluyen resumen AI, tags y biblioteca en la hipótesis comercial. Definición de ejemplo: un link procesado con resumen y tags equivale a un save; reinicio mensual.

No equivale a una configuración real. Antes de vender hay que validar costo por tipo/longitud de contenido, procesamiento fallido, límites de duración, cuota efectiva y enforcement. Un usuario que declara “más de 100” podría necesitar más de 500: la recomendación no garantiza que todo su consumo esté cubierto.

No mostrar dólares de “uso” ni “1.000 AI processing”: no son unidades comprensibles sin una definición y el costo varía según el contenido. Los límites deben reflejar valor real y economía viable, no salir solo del diseño.

Precios pedidos por Dante: **Weekly US$10; Monthly US$12.99; Annual US$79**. Monthly inicia seleccionado. Annual muestra total anual y equivalente mensual de US$6.58. Los tres períodos comparten la cuota mensual propuesta; semanal describe la frecuencia de cobro, no un reset semanal. Free no pide tarjeta.

## Alcance y validación

Rutas DEV `/internal/funnel` y `/internal/funnel/c`; A/B siguen disponibles para comparar. Home publicada sin cambios de comportamiento. Componentes nuevos `ConversationalFunnel.tsx` y CSS; se reutiliza el callback del CTA.

Checkout y activación siguen simulados. RevenueCat/Stripe no se conectaron. Sin backend, analytics, productos, auth ni modificaciones a APIs, Dashboard o mobile.

Verificación: typecheck, lint, 12 tests existentes y build. Navegador desktop/mobile: selección de fuentes excluyente, respuesta para organizado y para quien olvida, recomendación Free/Pro, tres precios, salida App Store, checkout/activación simulados y desbordamiento horizontal. La primera pregunta entra sin scroll en los tamaños revisados; planes/contenido expandido permiten scroll conservando el CTA visible.
