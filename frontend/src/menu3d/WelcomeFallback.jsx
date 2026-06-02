import React from 'react'
import StartButton from './ui/StartButton'

export default function WelcomeFallback({ onStart }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg,#f6f7fb 0%,#fffaf6 100%)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 20 }}>Cargando bienvenida…</div>
        <StartButton onClick={onStart} />
      </div>
    </div>
  )
}
