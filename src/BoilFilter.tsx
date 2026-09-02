/**
 * The boil — one SVG filter shared by every icon on the page.
 *
 * Mount it once, anywhere. It renders nothing visible; icons reference it by
 * id. Keeping a single filter means 200 boiling icons cost the same as one.
 */
export function BoilFilter({
  id = 'doodle-boil',
  /** how far the ink wanders, in viewBox units */
  amplitude = 1.6,
  /** one full cycle of the wobble */
  duration = '0.55s',
}: {
  id?: string
  amplitude?: number
  duration?: string
}) {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.055"
          numOctaves={2}
          seed="1"
          result="noise"
        >
          {/* discrete steps, not a smooth tween: the ink should jump between
              drawings the way hand-inked animation does, not slide */}
          <animate
            attributeName="seed"
            values="1;2;3;4;5;6"
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
  )
}
