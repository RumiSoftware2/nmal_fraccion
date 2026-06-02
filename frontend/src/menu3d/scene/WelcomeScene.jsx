import React from 'react'
import { Suspense } from 'react'
import FloatingMathShapes from './FloatingMathShapes'
import SceneEnvironment from './SceneEnvironment'

export default function WelcomeScene() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight intensity={0.3} position={[5, 5, 5]} />
      <SceneEnvironment />
      <Suspense fallback={null}>
        <FloatingMathShapes />
      </Suspense>
    </>
  )
}
