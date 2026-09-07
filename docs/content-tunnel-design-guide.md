# Guía de diseño del Sted Content Tunnel

> Para la variante interna actual con portal, ver [content-tunnel-portal-preview.md](content-tunnel-portal-preview.md). Las secciones históricas siguientes contienen referencias a ContentCard, pausa manual y assets que ya no corresponden a la implementación actual.

Esta guía explica cómo modificar la experiencia visual que se ve en:

`/dev/content-tunnel/`

## 1. Flujo de la pantalla

La preview se monta como una entrada independiente de Vite:

```text
dev/content-tunnel/index.html
  └─ src/components/content-tunnel/preview.tsx
       ├─ demo-items.ts              contenido de ejemplo
       ├─ preview.css                landing, header, hero e input
       └─ StedContentTunnel.tsx      túnel, tarjetas y movimiento
            └─ StedContentTunnel.css estilos de tarjetas y animación
```

La página no usa el router principal de `src/main.tsx`. Por eso, para cambiar esta experiencia hay que trabajar principalmente dentro de `src/components/content-tunnel/` y `dev/content-tunnel/`.

## 2. Dónde diseñar las tarjetas

El componente `ContentCard` está en:

`src/components/content-tunnel/StedContentTunnel.tsx`

La estructura actual de una tarjeta es:

```tsx
<article className={`sct-card sct-card--${item.type}`}>
  <div className="sct-source">...</div>
  {/* imagen o tratamiento visual según el tipo */}
  <div className="sct-copy">
    {/* autor, título, descripción, contenido especial, metadata */}
  </div>
</article>
```

### Cambiar el aspecto general de todas las tarjetas

Editar estas reglas en `StedContentTunnel.css`:

- `.sct-card`: fondo, borde, radio, sombra, overflow y layout general.
- `.sct-source`: altura y estilo de la cabecera de fuente.
- `.sct-source-icon`: tamaño y tratamiento del icono.
- `.sct-copy`: padding y distribución del contenido.
- `.sct-copy h3`: tipografía y tamaño del título.
- `.sct-copy p`: descripción.
- `.sct-meta`: texto inferior.

Ejemplo de una tarjeta más editorial:

```css
.sct-card {
  border-radius: 22px;
  border-color: #dedbd4;
  box-shadow: 0 24px 60px -30px #14131355;
}

.sct-copy h3 {
  font-size: 25px;
  letter-spacing: -1px;
}
```

### Diseñar una tarjeta específica por tipo

Cada tarjeta recibe una clase como `sct-card--article`, `sct-card--youtube` o `sct-card--website`. Esto permite hacer variaciones sin afectar a las demás:

```css
.sct-card--article {
  background: #FFD400;
}

.sct-card--article .sct-copy h3 {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Los tratamientos visuales que no dependen de una imagen real también se generan en `ContentCard`:

- `youtube` e `instagram`: `.sct-landscape`.
- `website`: `.sct-still-life`.
- `article`: `.sct-editorial`.
- `pdf`: `.sct-cover`.
- `github`: `.sct-code`.
- `document`: `.sct-notes`.
- `x`: `.sct-author` y `.sct-reactions`.

Para crear un tratamiento nuevo hay que añadir una condición en `ContentCard` y sus reglas CSS correspondientes.

## 3. Cambiar el contenido y la cantidad de tarjetas

El contenido de demo está en:

`src/components/content-tunnel/demo-items.ts`

Cada objeto debe respetar `StedContentItem`:

```ts
{
  id: 'unique-id',
  type: 'article',
  title: 'Título visible',
  metadata: 'Fuente · 6 min read',
  body: 'Descripción breve',
  image: '/ruta/opcional.jpg',
  sourceIcon: '/ruta/opcional.svg'
}
```

Los tipos disponibles están declarados en `StedContentTunnel.tsx`: `x`, `youtube`, `instagram`, `article`, `github`, `pdf`, `website`, `document`, `reddit`, `linkedin`, `newsletter`, `podcast`, `photo`, `place`, `recipe` y `design`.

La preview inicializa el estado aquí:

```tsx
const [items, setItems] = useState(demoItems)
```

El input de la landing añade una tarjeta `website` en memoria y conserva como máximo 24 elementos:

```tsx
setItems(current => [item, ...current.slice(0, 23)])
```

Para una demo con otra cantidad, cambia ese límite y el array de `demoItems`. No hace falta tocar el algoritmo del túnel para usar más contenido, porque las tarjetas se reutilizan durante el recorrido.

## 4. Cómo se calcula la cantidad visible

En `StedContentTunnel.tsx`:

```tsx
const count = Math.min(12, Math.max(1, Math.ceil(items.length / 2)))
```

Esto crea `count` posiciones a la izquierda y `count` a la derecha. Con 24 elementos se obtienen 12 posiciones por lado, aunque cada lado reutiliza parte del array mediante el índice calculado.

Para controlar directamente la densidad visual, conviene extraer una prop:

```tsx
export function StedContentTunnel({
  items,
  className = '',
  slotsPerSide,
}: {
  items: StedContentItem[]
  className?: string
  slotsPerSide?: number
}) {
  const count = Math.min(12, Math.max(1, slotsPerSide ?? Math.ceil(items.length / 2)))
```

Después se puede usar:

```tsx
<StedContentTunnel items={items} slotsPerSide={8} />
```

Recomendación: mantener entre 8 y 12 slots por lado en desktop. Más de 12 aumenta el trabajo de layout y puede hacer que las tarjetas se perciban como ruido. En tablet y móvil ya existe un recorte visual con `data-tablet-hidden` y `data-mobile-hidden`.

## 5. Cambiar la velocidad y el ritmo

La duración principal está en dos lugares de `StedContentTunnel.css`:

```css
animation: sct-travel 7.5s ... infinite;
animation-delay: calc(-.375s - (...) * 7.5s / var(--slots));
```

Y en móvil:

```css
animation-delay: calc(-.375s - (...) * 7.5s / min(3, var(--slots)));
```

Para que la animación sea más lenta o más rápida hay que cambiar ambos usos de `7.5s`. Por ejemplo, para 10 segundos:

```css
animation: sct-travel 10s cubic-bezier(.25, .45, .6, .85) infinite;
animation-delay: calc(-.375s - (var(--depth) + var(--side-phase)) * 10s / var(--slots));
```

El segundo valor es importante: si solo se cambia la duración de `animation` pero no el `animation-delay`, las tarjetas dejan de estar distribuidas uniformemente.

El ritmo también se controla con los porcentajes de `@keyframes sct-travel`:

- `0%`: entrada desde los laterales.
- `3%`: termina el fade-in.
- `80%`: la tarjeta sigue plenamente visible.
- `92%`: empieza a desaparecer.
- `100%`: llega al centro profundo y sale.

Una experiencia más pausada puede usar `10s` u `11s`. Una más dinámica puede usar `6s`, pero conviene validar que el texto siga siendo legible.

El botón de pausa cambia `data-paused="true"` en el contenedor y pausa todas las animaciones con:

```css
.sct[data-paused='true'] .sct-position {
  animation-play-state: paused;
}
```

Además, `useReducedMotion()` desactiva el movimiento cuando el sistema lo solicita.

## 6. Cómo meter Sted en el medio

El elemento central está al final de `.sct-window`:

```tsx
<div className="sct-center">
  <img src={mascot} alt="Sted" />
  <span>A little place for it all.</span>
</div>
```

Su posición está controlada por:

```css
.sct-center {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

Para cambiar el tamaño de la mascota, editar `.sct-center img`. Para moverla, cambiar `top` y `left`. Para hacer que el centro tenga más presencia, ajustar `.sct-center::before`, que crea el halo blanco que oculta el paso de las tarjetas.

El logo o mascota no participa en el loop: permanece fijo mientras las tarjetas pasan por detrás. Para añadir una marca más completa se puede sustituir el contenido por un bloque con logo, wordmark y claim:

```tsx
<div className="sct-center">
  <img src={mascot} alt="Sted" />
  <strong>Sted</strong>
  <span>A little place for it all.</span>
</div>
```

Importante: `src/components/content-tunnel/assets/sted-mascot.svg` tiene un problema conocido: su imagen Base64 incrustada es inválida y puede renderizarse en blanco. Hay que reemplazar ese SVG por el archivo correcto antes de cerrar la dirección visual.

## 7. Controlar la profundidad y la perspectiva

Cada posición recibe variables CSS desde React:

```tsx
'--side': side,
'--depth': depth,
'--side-phase': sideIndex * .47,
'--rest-z': `${240 - depth / Math.max(1, count - 1) * 3180}px`,
'--rest-scale': 1 - depth / Math.max(1, count - 1) * .27,
'--rest-opacity': 1 - depth / Math.max(1, count - 1) * .66,
```

Y el CSS usa principalmente:

- `--wall`: distancia horizontal de cada lado.
- `perspective`: intensidad de la profundidad 3D.
- `--rest-z`: posición en profundidad cuando está en estado estático/reduced motion.
- `--rest-scale`: reducción de tamaño en profundidad.
- `rotateY`: inclinación hacia el centro.

Si el túnel se ve demasiado abierto, reducir `--wall` o el primer desplazamiento de `translateX` en `@keyframes`. Si se ve plano, aumentar `perspective` o la diferencia entre `translateZ` inicial y final.

## 8. Responsive

Hay tres comportamientos:

- Desktop: tarjetas de `330 × 410px`, hasta 12 posiciones por lado.
- Tablet, debajo de `1024px` de container: tarjetas de `260 × 360px`, hasta 8 posiciones visibles.
- Móvil, debajo de `600px`: tarjetas de `185 × 260px`, hasta 3 posiciones visibles por lado.

Los breakpoints son container queries, no media queries globales. El tamaño depende del ancho real de `.sct`, lo que permite reutilizar el componente en distintos contenedores.

Cuando se cambie `--card-width` o `--card-height`, también hay que revisar las alturas de `.sct-image`, `.sct-landscape`, `.sct-editorial` y `.sct-still-life` para evitar tarjetas con demasiado espacio vacío o contenido cortado.

## 9. Ruta recomendada para una iteración de diseño

1. Cambiar contenido y orden en `demo-items.ts`.
2. Ajustar la tarjeta base en `.sct-card`, `.sct-source` y `.sct-copy`.
3. Ajustar tratamientos específicos (`.sct-editorial`, `.sct-landscape`, etc.).
4. Ajustar `7.5s` y su fórmula de `animation-delay` juntos.
5. Ajustar `--wall`, `perspective` y `translateZ` para la composición.
6. Revisar desktop, tablet, móvil y `prefers-reduced-motion`.
7. Reemplazar el SVG de mascota antes de hacer la validación visual final.

## 10. Validación

Desde la raíz del repo:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run dev
```

Abrir:

`http://localhost:5173/dev/content-tunnel/`

La preview del input es solo local y en memoria: añadir un link no lo persiste ni lo conecta todavía con backend.
