/**
 * Composes every icon into one static contact-sheet SVG for the README.
 * Static on purpose: GitHub strips animation out of README images, and a
 * still sheet is what you want when you are scanning for "is my icon here".
 */
import { mkdirSync, writeFileSync } from 'node:fs'
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

const cells = ICONS.map((icon, i) => {
  const x = (PAD + (i % COLS) * CELL + offset).toFixed(1)
  const y = (PAD + Math.floor(i / COLS) * CELL + offset).toFixed(1)
  const paths = icon.paths.map((d) => `<path d="${d}"/>`).join('')
  return `    <g transform="translate(${x} ${y}) scale(${scale})">${paths}</g>`
}).join('\n')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" rx="10" fill="#F7F6F2"/>
  <g fill="none" stroke="#2b2a33" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
${cells}
  </g>
</svg>
`

mkdirSync(new URL('../.github/', import.meta.url), { recursive: true })
writeFileSync(new URL('../.github/preview.svg', import.meta.url), svg)
console.log(`preview.svg  ${W}x${H}  ${(svg.length / 1024).toFixed(0)}KB  ${ICONS.length} icons in ${rows} rows`)
