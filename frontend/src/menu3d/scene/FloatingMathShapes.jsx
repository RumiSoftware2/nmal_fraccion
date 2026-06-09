import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWelcomePointer } from '../context/WelcomePointerContext'
import useWelcomePalette from '../hooks/useWelcomePalette'
import useShapeLayout from '../hooks/useShapeLayout'

function FloatingShape({ geom, baseColor, basePosition, speed = 0.5, segments = 32, phase = 0, scale = 1 }) {
  const ref = useRef()
  const matRef = useRef()
  const layout = useShapeLayout()

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // rotation with delta to avoid speed-dependent growth
    const rotMod = 1 + 0.05 * Math.sin(t * 0.5 + phase)
    ref.current.rotation.x += 0.08 * delta * speed * rotMod
    ref.current.rotation.y += 0.05 * delta * speed * (1 + 0.05 * Math.cos(t * 0.6 + phase))

    // vertical bob slower: use slower time multiplier
    const bob = (layout.bobAmplitude || 0.18)
    ref.current.position.y = basePosition[1] + Math.sin(t * speed * 0.6 + phase) * bob

    // horizontal drift slower: time factor reduced to 0.3
    const drift = (layout.driftLimit || 0.15) * Math.sin(t * 0.3 * (0.5 + speed / 2) + phase)
    const sign = Math.sign(basePosition[0]) || 1
    ref.current.position.x = basePosition[0] + sign * Math.abs(drift)

    // z anchored to base
    ref.current.position.z = basePosition[2]

    // scale
    ref.current.scale.setScalar(scale * (layout.scaleMultiplier || 1))

    if (matRef.current) {
      const pulse = 0.02 + Math.abs(Math.sin(t * speed * 0.6 + phase)) * 0.06
      matRef.current.emissiveIntensity = pulse
    }
  })

  return (
    <mesh ref={ref} position={basePosition}>
      {geom}
      <meshStandardMaterial ref={matRef} color={baseColor} metalness={0.15} roughness={0.75} emissive={baseColor} emissiveIntensity={0.02} />
    </mesh>
  )
}

export default function FloatingMathShapes() {
  const { pointerRef } = useWelcomePointer()
  const palRef = useWelcomePalette(pointerRef)
  const layout = useShapeLayout()

  // group rotation reacts to pointer (reduced tilt)
  const groupRef = useRef()
  useFrame(() => {
    const p = pointerRef.current
    if (groupRef.current) {
      groupRef.current.rotation.y += (p.x * 0.08 - groupRef.current.rotation.y) * 0.06
      groupRef.current.rotation.x += (p.y * 0.05 - groupRef.current.rotation.x) * 0.06
    }
  })

  const seg = layout.seg || (typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 32)

  return (
    <group ref={groupRef}>
      <FloatingShape
        geom={(
          <torusGeometry args={[0.9, 0.25, 16, 60]} />
        )}
        baseColor={palRef.current.primary}
        basePosition={[-2.4, 0.4, -0.8]}
        speed={0.25}
        segments={seg}
        phase={0}
        scale={0.85}
      />
      <FloatingShape
        geom={(
          <boxGeometry args={[1.0, 1.0, 1.0]} />
        )}
        baseColor={palRef.current.secondary}
        basePosition={[2.4, -0.3, -0.6]}
        speed={0.20}
        segments={seg}
        phase={1.2}
        scale={0.85}
      />
      <FloatingShape
        geom={(
          <sphereGeometry args={[0.6, seg, seg]} />
        )}
        baseColor={palRef.current.accent}
        basePosition={[2.0, 1.1, -1.0]}
        speed={0.22}
        segments={seg}
        phase={2.1}
        scale={0.75}
      />
    </group>
  )
}
