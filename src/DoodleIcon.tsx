import type { SVGProps } from 'react'
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
}

/**
 * One doodle icon. Strokes inherit `currentColor`, so colour comes from CSS.
 *
 * Pass `boilId` matching a mounted <BoilFilter> to make it wiggle:
 *
 *   <BoilFilter id="boil" />
 *   <DoodleIcon name="heart" boilId="boil" />
 */
export function DoodleIcon({
  name,
  icon,
  size = 24,
  strokeWidth = 3.4,
  boilId,
  ...rest
}: DoodleIconProps) {
  const data = icon ?? (name ? getIcon(name) : undefined)
  if (!data) return null

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
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}
