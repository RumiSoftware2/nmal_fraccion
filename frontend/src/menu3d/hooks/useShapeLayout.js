import { useState, useEffect } from 'react'

export default function useShapeLayout() {
  const [layout, setLayout] = useState(() => computeLayout(typeof window !== 'undefined' ? window.innerWidth : 1024))

  useEffect(() => {
    function onResize() {
      setLayout(computeLayout(window.innerWidth))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return layout
}

function computeLayout(innerWidth) {
  const isMobile = innerWidth <= 480
  const isTablet = innerWidth > 480 && innerWidth <= 768

  if (isMobile) {
    return {
      isMobile: true,
      seg: 12,
      scaleMultiplier: 0.7,
      bobAmplitude: 0.12,
      driftLimit: 0.12,
      // pushes shapes further to edges
      xMultiplier: 1.2
    }
  }

  if (isTablet) {
    return {
      isMobile: false,
      seg: 16,
      scaleMultiplier: 0.85,
      bobAmplitude: 0.15,
      driftLimit: 0.13,
      xMultiplier: 1.1
    }
  }

  // desktop
  return {
    isMobile: false,
    seg: 32,
    scaleMultiplier: 1,
    bobAmplitude: 0.18,
    driftLimit: 0.15,
    xMultiplier: 1
  }
}
