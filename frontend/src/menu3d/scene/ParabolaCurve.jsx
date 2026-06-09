import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

export default function ParabolaCurve() {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 40; i++) {
      const x = -3.5 + (7.0 * i) / 40
      const y = 0.15 * x * x - 0.5
      pts.push(new THREE.Vector3(x, y, -2.5))
    }
    return pts
  }, [])

  const mover = useRef()
  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.12) % 1
    // simple evaluation along points
    const idx = t * (points.length - 1)
    const i0 = Math.floor(idx)
    const alpha = idx - i0
    const a = points[i0]
    const b = points[Math.min(i0 + 1, points.length - 1)]
    if (a && b && mover.current) {
      mover.current.position.lerpVectors(a, b, alpha)
    }
  })

  // attempt to read css var --c2
  let color = '#8aaed0'
  if (typeof window !== 'undefined') {
    const val = getComputedStyle(document.documentElement).getPropertyValue('--c2')
    if (val) color = val.trim()
  }

  return (
    <group>
      <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.35} />
      <Line points={[new THREE.Vector3(-4, -1.5, -2.5), new THREE.Vector3(4, -1.5, -2.5)]} color={color} lineWidth={0.6} dashed dashSize={0.1} gapSize={0.05} transparent opacity={0.12} />

      <mesh ref={mover}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}
