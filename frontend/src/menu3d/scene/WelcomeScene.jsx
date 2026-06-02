import React from 'react'
import { Suspense } from 'react'
import FloatingMathShapes from './FloatingMathShapes'
import SceneEnvironment from './SceneEnvironment'
import DynamicLights from './DynamicLights'
import ColorBackground from './ColorBackground'

export default function WelcomeScene() {
  return (
    <>
      <Suspense fallback={null}>
        <ColorBackground />
        <SceneEnvironment />
        <DynamicLights />
        <FloatingMathShapes />
      </Suspense>
    </>
  )
}
