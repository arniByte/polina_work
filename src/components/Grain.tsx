/** Зерно рисографа. Один фиксированный слой на всё приложение — дешевле, чем
 *  накладывать текстуру на каждый блок, и не мешает кликам. */
export function Grain() {
  return (
    <svg className="grain" aria-hidden="true">
      <filter id="grain-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-noise)" opacity="0.34" />
    </svg>
  );
}
