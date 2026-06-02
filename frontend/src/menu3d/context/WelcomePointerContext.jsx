import React, { createContext, useContext, useRef, useEffect } from 'react'
import usePointerNormalized from '../hooks/usePointerNormalized'

const defaultPointer = { x: 0, y: 0, active: false }
const defaultContext = {
  pointerRef: { current: defaultPointer },
  containerRef: { current: null },
}

const WelcomePointerContext = createContext(defaultContext)

export function useWelcomePointer() {
  return useContext(WelcomePointerContext)
}

export function WelcomePointerProvider({ children, className = 'welcome-menu' }) {
  const containerRef = useRef(null)
  const pointerRef = usePointerNormalized(containerRef)

  // expose css vars and palette placeholders via style updates on container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined
    let raf = null
    function loop() {
      const p = pointerRef.current || defaultPointer
      el.style.setProperty('--mx', String(p.x))
      el.style.setProperty('--my', String(p.y))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [pointerRef])

  return (
    <WelcomePointerContext.Provider value={{ pointerRef, containerRef }}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </WelcomePointerContext.Provider>
  )
}
