/**
 * The one place the boil is tuned.
 *
 * These are the values oreoui.com/doodle-icons runs at — the site is the
 * reference for how the set is supposed to feel, and the package, the
 * standalone SVG files and the README sheet all read from here so they cannot
 * drift apart again.
 */
export const BOIL = {
  /**
   * How far the ink wanders, in viewBox units. Because it is in user units
   * rather than pixels, it scales with the icon: 4 looks the same at 24px as
   * at 240px. Roughly: 1 is a shiver, 4 is the house style, 8 is a mess.
   */
  amplitude: 4,
  /** One full cycle of the loop. Lower is more frantic. */
  duration: '0.86s',
  /** Grain of the noise. Higher is a finer, more jittery hand. */
  frequency: 0.055,
  /** Octaves of noise stacked into the displacement map. */
  octaves: 2,
  /** How many hand-drawn frames the loop pretends to have. */
  frames: 6,
} as const

/** Stroke geometry the whole set is drawn for. */
export const STROKE = {
  width: 3.4,
  linecap: 'round',
  linejoin: 'round',
} as const

/** The ink colour baked into the standalone SVG files. */
export const INK = '#2b2a33'
