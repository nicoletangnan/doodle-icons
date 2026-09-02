/**
 * Composes every icon into contact-sheet SVGs for the README.
 *
 *   .github/preview.svg          draws itself in, then boils forever
 *   .github/preview-static.svg   one still frame, for anywhere animation is stripped
 *
 * One filter covers the whole sheet rather than one per icon: the displacement
 * is computed once over the full area, so 152 boiling icons cost about what
 * one does.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { svgPathProperties } from 'svg-path-properties'
import { ICONS } from '../src/icons.ts'

const COLS = 19
const CELL = 62
const ICON = 40
const PAD = 30

const rows = Math.ceil(ICONS.length / COLS)
const W = COLS * CELL + PAD * 2
const H = rows * CELL + PAD * 2
const offset = (CELL - ICON) / 2
const scale = (ICON / 48).toFixed(4)

const PAPER = '#F7F6F2'
const INK = '#2b2a33'
const STROKE = 3.4

/** where icon i sits on the sheet */
const place = (i) => {
  const x = (PAD + (i % COLS) * CELL + offset).toFixed(1)
  const y = (PAD + Math.floor(i / COLS) * CELL + offset).toFixed(1)
  return `translate(${x} ${y}) scale(${scale})`
}

/* ---------- still ---------- */

const stillCells = ICONS.map(
  (icon, i) =>
    `    <g transform="${place(i)}">${icon.paths.map((d) => `<path d="${d}"/>`).join('')}</g>`,
).join('\n')

const still = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" rx="10" fill="${PAPER}"/>
  <g fill="none" stroke="${INK}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">
${stillCells}
  </g>
</svg>
`

/* ---------- animated ---------- */

// The sheet fills in left to right, one icon after the next, the way you would
// actually draw it. 152 icons at this cadence lands just under four seconds.
const ICON_STAGGER = 0.024

const animCells = ICONS.map((icon, i) => {
  const base = i * ICON_STAGGER
  let delay = base
  const paths = icon.paths
    .map((d) => {
      // longer strokes take proportionally longer, so the hand moves at one speed
      const len = new svgPathProperties(d).getTotalLength()
      const dur = Math.min(0.5, Math.max(0.12, len / 190))
      const p = `<path pathLength="1" style="animation-duration:${dur.toFixed(2)}s;animation-delay:${delay.toFixed(2)}s" d="${d}"/>`
      delay += dur * 0.65 // overlap a little so one icon reads as one gesture
      return p
    })
    .join('')
  return `    <g transform="${place(i)}">${paths}</g>`
}).join('\n')

const animated = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
    .ink path {
      stroke-dasharray: 1; stroke-dashoffset: 1; visibility: hidden;
      animation-name: draw; animation-timing-function: cubic-bezier(.65,.05,.36,1);
      animation-fill-mode: forwards;
    }
    @keyframes draw {
      from { visibility: visible }
      to { visibility: visible; stroke-dashoffset: 0 }
    }
    @media (prefers-reduced-motion: reduce) {
      .ink path { animation: none; visibility: visible; stroke-dashoffset: 0 }
    }
  </style>
  <filter id="boil" x="-2%" y="-4%" width="104%" height="108%">
    <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="1" result="noise">
      <animate attributeName="seed" values="1;2;3;4;5;6" dur="0.55s" repeatCount="indefinite" calcMode="discrete"/>
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <rect width="${W}" height="${H}" rx="10" fill="${PAPER}"/>
  <g class="ink" filter="url(#boil)" fill="none" stroke="${INK}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">
${animCells}
  </g>
</svg>
`

const dir = new URL('../.github/', import.meta.url)
mkdirSync(dir, { recursive: true })
writeFileSync(new URL('preview.svg', dir), animated)
writeFileSync(new URL('preview-static.svg', dir), still)

const kb = (s) => (s.length / 1024).toFixed(0) + 'KB'
console.log(`preview.svg         ${W}x${H}  ${kb(animated)}  animated, draws in over ${(ICONS.length * ICON_STAGGER).toFixed(1)}s`)
console.log(`preview-static.svg  ${W}x${H}  ${kb(still)}  still`)
