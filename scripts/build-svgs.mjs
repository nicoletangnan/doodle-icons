/**
 * Writes two standalone .svg files per icon:
 *   icons/<name>.svg           still, currentColor-driven
 *   icons-animated/<name>.svg  draws itself in, then boils forever
 *
 * The animated ones carry their own <style> and <filter>, so they work
 * anywhere an SVG works — <img>, CSS backgrounds, README files, Figma.
 */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { svgPathProperties } from 'svg-path-properties'
import { ICONS } from '../src/icons.ts'

const OUT_STILL = new URL('../icons/', import.meta.url)
const OUT_ANIM = new URL('../icons-animated/', import.meta.url)
for (const dir of [OUT_STILL, OUT_ANIM]) {
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
}

const STROKE = 3.4

const still = (icon) => `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">
${icon.paths.map((d) => `  <path d="${d}"/>`).join('\n')}
</svg>
`

function animated(icon) {
  let delay = 0
  const paths = icon.paths.map((d) => {
    // longer strokes take longer to draw, so the hand moves at one speed
    const len = new svgPathProperties(d).getTotalLength()
    const dur = Math.min(0.7, Math.max(0.15, len / 130))
    const path = `    <path pathLength="1" style="animation-duration:${dur.toFixed(2)}s;animation-delay:${delay.toFixed(2)}s" d="${d}"/>`
    delay += dur * 0.7 // overlap slightly so it reads as one gesture
    return path
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 48 48">
  <style>
    path {
      fill: none; stroke: #2b2a33; stroke-width: ${STROKE};
      stroke-linecap: round; stroke-linejoin: round;
      stroke-dasharray: 1; stroke-dashoffset: 1; visibility: hidden;
      animation-name: draw; animation-timing-function: cubic-bezier(.65,.05,.36,1);
      animation-fill-mode: forwards;
    }
    @keyframes draw {
      from { visibility: visible }
      to { visibility: visible; stroke-dashoffset: 0 }
    }
  </style>
  <filter id="boil" x="-30%" y="-30%" width="160%" height="160%">
    <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="1" result="noise">
      <animate attributeName="seed" values="1;2;3;4;5;6" dur="0.55s" repeatCount="indefinite" calcMode="discrete"/>
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <g filter="url(#boil)">
    <rect width="48" height="48" fill="none"/>
${paths.join('\n')}
  </g>
</svg>
`
}

for (const icon of ICONS) {
  writeFileSync(new URL(`${icon.name}.svg`, OUT_STILL), still(icon))
  writeFileSync(new URL(`${icon.name}.svg`, OUT_ANIM), animated(icon))
}
console.log(`wrote ${ICONS.length} icons to icons/ and icons-animated/`)
