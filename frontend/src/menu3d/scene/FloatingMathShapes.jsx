import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWelcomePointer } from '../context/WelcomePointerContext'
import useWelcomePalette from '../hooks/useWelcomePalette'

function FloatingShape({ geom, baseColor, position, speed = 0.5, segments = 32 }) {
  const ref = useRef()
  const matRef = useRef()
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.2 * delta * speed
    ref.current.rotation.y += 0.15 * delta * speed
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.25
    if (matRef.current) {
      // gentle emissive pulse
      const pulse = 0.02 + Math.abs(Math.sin(state.clock.elapsedTime * speed)) * 0.06
      matRef.current.emissiveIntensity = pulse
    }
  })

  return (
    <mesh ref={ref} position={position}>
      {geom}
      <meshStandardMaterial ref={matRef} color={baseColor} metalness={0.15} roughness={0.75} emissive={baseColor} emissiveIntensity={0.02} />
    </mesh>
  )
}

export default function FloatingMathShapes() {
  const { pointerRef } = useWelcomePointer()
  const palRef = useWelcomePalette(pointerRef)
  const seg = typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 32

  // group rotation reacts to pointer
  const groupRef = useRef()
  useFrame(() => {
    const p = pointerRef.current
    if (groupRef.current) {
      groupRef.current.rotation.y += (p.x * 0.15 - groupRef.current.rotation.y) * 0.08
      groupRef.current.rotation.x += (p.y * 0.1 - groupRef.current.rotation.x) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <FloatingShape
        geom={(
          <torusGeometry args={[0.9, 0.25, 16, 60]} />
        )}
        baseColor={palRef.current.primary}
        position={[-1.2, 0.2, 0]}
        speed={0.6}
        segments={seg}
      />
      <FloatingShape
        geom={(
          <boxGeometry args={[1.0, 1.0, 1.0]} />
        )}
        baseColor={palRef.current.secondary}
        position={[1.1, -0.1, 0]}
        speed={0.4}
        segments={seg}
      />
      <FloatingShape
        geom={(
          <sphereGeometry args={[0.6, seg, seg]} />
        )}
        baseColor={palRef.current.accent}
        position={[0, 1.0, -0.3]}
        speed={0.5}
        segments={seg}
      />
    </group>
  )
}
