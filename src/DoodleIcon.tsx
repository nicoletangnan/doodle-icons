import type { CSSProperties, SVGProps } from 'react'
import { getIcon, type DoodleIconData } from './icons'

export type DoodleIconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  /** icon name, e.g. "heart" — or pass `icon` with the data directly */
  name?: string
  icon?: DoodleIconData
  /** px, applied to both axes */
  size?: number | string
  strokeWidth?: number
  /** id of a mounted <BoilFilter>; omit to render the icon still */
  boilId?: string
  /** draw the strokes on, one after another, the first time it renders */
  draw?: boolean
  /** seconds per stroke */
  drawDuration?: number
  /** seconds before the first stroke starts */
  drawDelay?: number
}

/**
 * One doodle icon. Strokes inherit `currentColor`, so colour comes from CSS.
 *
 *   <BoilFilter id="boil" />
 *   <DoodleIcon name="heart" boilId="boil" draw />
 *
 * Both effects are opt-in. An icon that wiggled by default would be a menace
 * inside a form, and the entrance would replay every time React remounts it.
 */
export function DoodleIcon({
  name,
  icon,
  size = 24,
  strokeWidth = 3.4,
  boilId,
  draw = false,
  drawDuration = 0.32,
  drawDelay = 0,
  ...rest
}: DoodleIconProps) {
  const data = icon ?? (name ? getIcon(name) : undefined)
  if (!data) return null

  // strokes overlap slightly, so a multi-stroke icon reads as one gesture
  const step = drawDuration * 0.65

  const drawStyle = (i: number): CSSProperties | undefined =>
    draw
      ? {
          // pathLength normalises every stroke to 1, so the dash maths is the
          // same whether the path is a dot or the outline of a camera
          strokeDasharray: 1,
          strokeDashoffset: 1,
          visibility: 'hidden',
          animationName: 'doodle-draw',
          animationDuration: `${drawDuration}s`,
          animationDelay: `${(drawDelay + i * step).toFixed(3)}s`,
          animationTimingFunction: 'cubic-bezier(.65,.05,.36,1)',
          animationFillMode: 'forwards',
        }
      : undefined

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={data.name}
      {...rest}
    >
      <g filter={boilId ? `url(#${boilId})` : undefined}>
        {/* invisible spacer: holds the group bbox at 48x48 so the boil filter
            region never collapses on flat icons like minus or ellipsis */}
        <rect width="48" height="48" fill="none" stroke="none" />
        {data.paths.map((d, i) => (
          <path key={i} d={d} pathLength={draw ? 1 : undefined} style={drawStyle(i)} />
        ))}
      </g>
    </svg>
  )
}
