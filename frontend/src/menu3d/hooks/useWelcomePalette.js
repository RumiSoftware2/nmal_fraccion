import { useRef, useEffect } from 'react'

function lerp(a, b, t) { return a + (b - a) * t }
function hexToRgb(hex) {
  const v = hex.replace('#','')
  return [parseInt(v.substring(0,2),16), parseInt(v.substring(2,4),16), parseInt(v.substring(4,6),16)]
}
function rgbToHex([r,g,b]) {
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')
}

export default function useWelcomePalette(pointerRef) {
  const palRef = useRef({ primary: '#7fb3d5', secondary: '#c8b8e6', accent: '#82c4a5' })

  useEffect(() => {
    let raf = null
    const baseA = hexToRgb('#7fb3d5')
    const baseB = hexToRgb('#c8b8e6')
    const baseC = hexToRgb('#82c4a5')

    function tick(t) {
      const time = (Date.now() % 8000) / 8000
      const w = 0.5 + 0.5 * Math.sin(time * Math.PI * 2)
      const px = pointerRef?.current?.x ?? 0
      const py = pointerRef?.current?.y ?? 0
      const mix = (px + 1) / 2 * 0.6 + Math.abs(py) * 0.4

      const p = [
        Math.round(lerp(baseA[0], baseB[0], mix * w)),
        Math.round(lerp(baseA[1], baseB[1], mix * w)),
        Math.round(lerp(baseA[2], baseB[2], mix * w))
      ]
      const s = [
        Math.round(lerp(baseB[0], baseC[0], mix * (1-w))),
        Math.round(lerp(baseB[1], baseC[1], mix * (1-w))),
        Math.round(lerp(baseB[2], baseC[2], mix * (1-w)))
      ]
      const a = [
        Math.round(lerp(baseC[0], baseA[0], mix * w)),
        Math.round(lerp(baseC[1], baseA[1], mix * w)),
        Math.round(lerp(baseC[2], baseA[2], mix * w))
      ]

      palRef.current.primary = rgbToHex(p)
      palRef.current.secondary = rgbToHex(s)
      palRef.current.accent = rgbToHex(a)

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pointerRef])

  return palRef
}
