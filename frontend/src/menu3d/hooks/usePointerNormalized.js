import { useRef, useEffect } from 'react'

// Returns a ref to attach to container and a pointerRef { x, y, active }
export default function usePointerNormalized(containerRef) {
  const pointerRef = useRef({ x: 0, y: 0, active: false })
  const rafRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    let last = { x: 0, y: 0 }

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = (e.clientX - cx) / (rect.width / 2)
      const ny = (cy - e.clientY) / (rect.height / 2)
      pointerRef.current.x = Math.max(-1, Math.min(1, nx))
      pointerRef.current.y = Math.max(-1, Math.min(1, ny))
      pointerRef.current.active = true
      last.x = pointerRef.current.x
      last.y = pointerRef.current.y
    }

    function onLeave() {
      pointerRef.current.active = false
      // smooth return to zero
      cancelAnimationFrame(rafRef.current)
      function decay() {
        pointerRef.current.x += (0 - pointerRef.current.x) * 0.08
        pointerRef.current.y += (0 - pointerRef.current.y) * 0.08
        if (Math.abs(pointerRef.current.x) < 0.001 && Math.abs(pointerRef.current.y) < 0.001) {
          pointerRef.current.x = 0
          pointerRef.current.y = 0
          return
        }
        rafRef.current = requestAnimationFrame(decay)
      }
      rafRef.current = requestAnimationFrame(decay)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onMove)

    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef])

  return pointerRef
}
