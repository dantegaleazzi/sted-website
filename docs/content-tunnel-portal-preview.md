# Content tunnel: variante interna con portal

Ruta: `/internal/content-tunnel-preview`. Regreso a la home: enlace «Volver a la versión original».
La home sigue usando la variante `original`. No se hizo deploy.

## Archivos actuales

- `src/components/content-tunnel/StedContentTunnel.tsx`: `variant="portal"` activa ocho slots por lado, el fondo del portal y SourceCard sin media sintética. La variante no usa parallax; conserva IntersectionObserver y reduced motion.
- `portal-tunnel.css`: perspectiva, recorrido, fases, portal y ajustes de SourceCard, siempre bajo `.sct--portal`.
- `portal-preview.css`: escena del ancho real de la ventana, Cream, wordmark oficial y lectura controlada. No hay un hero de 1160px recortando el tunnel.
- `portal-fixtures.ts`: selección y orden de 16 instancias, tomadas de los fixtures existentes; algunos contenidos se reutilizan.
- `src/components/source-cards/SourceCard.tsx`: `contentOnly` omite el fallback de media cuando no existe imagen. El comportamiento por defecto sigue intacto.
- `src/pages.tsx` y `src/main.tsx`: reutilizan el copy y formulario actuales en la ruta interna.

## Auditoría de contenido

Los SVG `temporary-*.svg` del repo son ilustraciones temporales, no fotos, portadas ni capturas auténticas. Se excluyen de esta variante. Tampoco se generan nuevas imágenes, gradientes, esqueletos, código ficticio ni cifras adicionales de interacción. Los textos y metadata pertenecen a los fixtures existentes: **no están verificados como publicaciones reales**.

No hay logos oficiales de plataformas disponibles en el repo; se conservan los indicadores tipográficos del SourceIcon existente. Los assets oficiales de Sted se reutilizan sin modificación. `public/og-image.png` muestra una identidad antigua y no se utiliza como imagen de otra publicación.

Esta preview permite evaluar el recorrido con SourceCard y contenido textual existente. La evaluación de miniaturas auténticas queda pendiente de incorporar ese material al repositorio.

## Motion y escala

- Ocho slots por lado, independientemente del número de fixtures; 24 segundos por ciclo.
- Separación temporal: 24 / 8 = 3 segundos. Desfase derecho: 0.47 slots = 1.41 segundos.
- Delay inicial: -1.5 segundos, para arrancar con el recorrido ocupado.
- Perspectiva: 1200px. Inclinación: 36 grados multiplicados por el lado.
- Card base: 260 × 350px; hasta 1100px de contenedor: 210 × 320px, manteniendo 8 slots.
- Portal: 500 × 310px, radio 30px, White sobre Cream; mascota oficial de 144px de ancho delante.
- Cámara y cards son capas separadas del fondo del portal. Las cards pequeñas pasan por encima del fondo y por detrás de la mascota.
- Sin hover scale. Pausa fuera de pantalla. Versión estática con reduced motion.

El recorrido compensa la proyección para evitar la aceleración lateral del tunnel anterior:

```
t = progreso del ciclo (0..1)
s = 1 - 0.84 * t
z = 1200 * (1 - 1 / s)
xWorld = lado * distancia * (1 - t) / s
distancia = 50cqw + 190px
```

La proyección del centro de cada card queda aproximadamente en `lado * distancia * (1 - t)`. Los keyframes se muestrean cada 5%, con interpolación linear. La escala aparente por profundidad pasa de 1 a 0.16. El fade inicial ocurre fuera del viewport; el final, dentro del portal y detrás de Sted. Al reiniciar, la card está invisible.

Cambiar `--portal-duration` actualiza duración y delays juntos. Si cambia perspectiva, regenerar z y xWorld con la misma fórmula; no cambiarla de forma aislada. La inclinación y el ancho deben comprobarse juntos para evitar que una card tape el título de la siguiente.

## Alcance de revisión

Desktop: 1440, 1280 y 1024 CSS px. Comprobar ancho efectivo con `innerWidth` si el navegador tiene zoom. Verificar overflow del documento y del cuerpo de cada SourceCard, 16 instancias, carga de assets, enlaces de navegación, entrada, llegada y reinicio a lo largo de varios ciclos.

Mobile queda fuera de esta iteración. La ruta interna es una preview visual, no una ruta autenticada.

## Ajuste solicitado a partir de las referencias

- Headline reducido exactamente un 40%: `clamp(38.4px, 3vw, 45.6px)`.
- Mascota reducida un 15%: de 144px a 122.4px de ancho.
- Portal convertido en una franja de 500 × 118px, más baja que la mascota (158.61px de alto). Mascota centrada sobre el recorrido; etiquetas debajo.
- El recorrido ahora usa `u = min(t / 0.65, 1)` y `s = 0.28 + 0.72 * (1-u)^2`. La inclinación pasa suavemente de 36 a 0 grados con la misma curva.
- Desde el 65% hasta el final, profundidad e inclinación son constantes: las cards siguen avanzando pequeñas durante 8.4s, antes de desaparecer. La fórmula de xWorld y el loop de 24s se conservan.

## Hero original y composición compacta

Se restauraron los estilos originales del headline y del texto desde `index.css`, incluido «Finally useful.» amarillo sin subrayado. Esto reemplaza la reducción del titular de la iteración anterior. Se eliminó la franja técnica de preview y el regreso quedó como un botón discreto debajo del formulario dentro del hero.

La altura de la escena ahora es `clamp(300px, calc(100svh - 420px), 420px)`; mantiene ancho completo y el motion vigente. Verificado en navegador: hero y formulario completos dentro del viewport a 1440×768, 1280×720 y 1024×768, sin scroll horizontal. La home sigue intacta.

## Geometría del embudo — ajuste actual

Se mantiene el ciclo de 15.384615s, el hero original, la mascota de 122.4px y el portal de 350 × 118px. Las cards ahora tienen 420px de altura base y llegan a 110px recién al 80% del recorrido. El tramo constante dura aproximadamente 3.08s y empieza dentro del portal en los anchos desktop revisados.

La posición proyectada es `(50cqw + 420px) * (1-t)^1.4`. La escala por profundidad es `1 - (1 - 110/420) * min(t/0.8, 1)`. El giro se mantiene en 28 grados hasta el 40% y baja a cero al 80%. Se compensan x y z con la perspectiva de 1200px; reduced motion usa la misma geometría. El fade final empieza al 99%, ya detrás de la mascota.

La anchura base es `((50cqw + 190px) / 2.095238095) * .92 + 12px`. Junto con el recorrido comprimido evita huecos sin el solapamiento excesivo de la primera prueba. Los cambios de esta iteración son de geometría; se preservó la selección de fixtures con imágenes que ya estaba en la preview.

## Real content pass — 2026-09-07

The current preview now uses the 12 real items documented in `real-content-fixtures.md`, replacing the earlier demonstration fixtures for this route. All thumbnails are frozen locally; Notes and Podcasts are absent. Existing 16 motion slots reuse the 12 unique items. The static `/internal/product-design-system` route exposes every item with source attribution. Header uses the supplied official horizontal Sted logo and SourceCard uses the supplied source tiles.

### Equal lane counts and independent speed

Eight cards per side. The user authorized a temporary RevenueCat duplicate for the 16th slot; static dataset remains 15 unique items. Items are assigned alternately to each lane. Left loop 15.384615 s; right loop 19.230769 s (80% of left speed). Delays use the actual lane count and lane duration.

### Speed increase: +30% on both lanes

Current loop durations: left 11.834319 s, right 14.792899 s. Previous durations divided by 1.3; right remains 20% slower. Phase delays follow the durations automatically.

### Same speed and sequence restart

Both lanes now inherit one 11.834319-second duration. Eight slots per lane retain uniform phase spacing. Changing the ordered fixture IDs remounts the entire camera sequence, preventing newly mounted cards from using a later animation start than retained cards during preview edits.

### Further speed increase: +30%

Both synchronized lanes now use a 9.103322-second loop (11.834319 / 1.3), retaining eight cards per side and proportional phase delays.

### Mascot coverage

Mascot enlarged to 150 × 194.37 px (~22.5%) so the central notch clears the 118 px portal bottom. Label gaps compacted to keep the caption clear of the form.

### Speed increase: +20%

Both synchronized lanes now use a 7.586102-second loop (9.103322 / 1.2). Eight cards per side; proportional phase delays unchanged.
