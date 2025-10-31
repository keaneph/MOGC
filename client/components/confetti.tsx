"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export default function Confetti() {
  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.style.position = "fixed"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.pointerEvents = "none"
    canvas.style.zIndex = "0"
    document.body.appendChild(canvas)

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    })

    const makeShot = (particleRatio: number, opts: any) => {
      myConfetti({
        ...opts,
        origin: { x: 0.5, y: 0.2 },
        particleCount: Math.floor(100 * particleRatio),
        scalar: 0.5,
      })
    }

    makeShot(0.25, { spread: 26, startVelocity: 55 })
    makeShot(0.2, { spread: 60 })
    makeShot(0.35, { spread: 100, decay: 0.91, scalar: 0.4 })
    makeShot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 0.6 })
    makeShot(0.1, { spread: 120, startVelocity: 45 })

    return () => {
      document.body.removeChild(canvas)
    }
  }, [])

  return null
}
