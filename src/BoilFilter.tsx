/**
 * Keyframes for the `draw` entrance on <DoodleIcon>.
 *
 * CSS keyframes are global, so this only needs to exist once on the page.
 * <BoilFilter> already renders it — mount this on its own only if you want
 * the entrance without the wiggle.
 */
export function DoodleStyles() {
  return (
    <style
      // one rule, no selectors of our own: nothing here can leak into your CSS
      dangerouslySetInnerHTML={{
        __html:
          '@keyframes doodle-draw{from{visibility:visible}to{visibility:visible;stroke-dashoffset:0}}' +
          '@media (prefers-reduced-motion:reduce){' +
          '[style*="doodle-draw"]{animation:none!important;visibility:visible!important;stroke-dashoffset:0!important}}',
      }}
    />
  )
}

/**
 * The boil — one SVG filter shared by every icon on the page.
 *
 * Mount it once, anywhere. It renders nothing visible; icons reference it by
 * id. Keeping a single filter means 200 boiling icons cost about what one does.
 *
 * Mount it more than once with different ids if you want more than one
 * intensity on the same page:
 *
 *   <BoilFilter id="boil" />
 *   <BoilFilter id="boil-loud" amplitude={3} duration="0.35s" />
 */
export function BoilFilter({
  id = 'doodle-boil',
  /** how far the ink wanders, in viewBox units. 0.8 is a shiver, 3 is a mess */
  amplitude = 1.6,
  /** one full cycle of the wobble — lower is more frantic */
  duration = '0.55s',
  /** grain of the noise; higher is a finer, more jittery hand */
  frequency = 0.055,
  /** how many hand-drawn frames the loop pretends to have */
  frames = 6,
}: {
  id?: string
  amplitude?: number
  duration?: string
  frequency?: number
  frames?: number
}) {
  const seeds = Array.from({ length: frames }, (_, i) => i + 1).join(';')

  return (
    <>
      <DoodleStyles />
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={frequency}
            numOctaves={2}
            seed="1"
            result="noise"
          >
            {/* discrete steps, not a smooth tween: the ink should jump between
                drawings the way hand-inked animation does, not slide */}
            <animate
              attributeName="seed"
              values={seeds}
              dur={duration}
              repeatCount="indefinite"
              calcMode="discrete"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={amplitude}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </>
  )
}
