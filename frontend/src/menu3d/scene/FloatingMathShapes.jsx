import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function FloatingShape({ geometry, color, position, speed = 0.5 }) {
  const ref = useRef()
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.2 * delta * speed
    ref.current.rotation.y += 0.15 * delta * speed
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.25
  })

  return (
    <mesh ref={ref} position={position}>
      {geometry}
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
    </mesh>
  )
}

export default function FloatingMathShapes() {
  return (
    <group>
      <FloatingShape
        geometry={(
          <torusGeometry args={[0.9, 0.25, 16, 60]} />
        )}
        color="#ffd6a5"
        position={[-1.2, 0.2, 0]}
        speed={0.6}
      />
      <FloatingShape
        geometry={(
          <boxGeometry args={[1.0, 1.0, 1.0]} />
        )}
        color="#cfe8ff"
        position={[1.1, -0.1, 0]}
        speed={0.4}
      />
      <FloatingShape
        geometry={(
          <sphereGeometry args={[0.6, 32, 32]} />
        )}
        color="#e6f7d4"
        position={[0, 1.0, -0.3]}
        speed={0.5}
      />
    </group>
  )
}
