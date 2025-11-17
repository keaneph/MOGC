"use client"

import confetti from "canvas-confetti"

import { useEffect } from "react"

export default function Confetti3() {
  useEffect(() => {
    const end = Date.now() + 15 * 1000

    const colors = ["#89010b", "#f9c900", "#ffffff"]

    let mounted = true

    const frame = () => {
      if (!mounted) return

      confetti({
        particleCount: 3,
        spread: 100,
        origin: { x: 0 },
        colors,
      })

      confetti({
        particleCount: 3,
        spread: 100,
        origin: { x: 1 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()

    return () => {
      mounted = false
    }
  }, [])

  return null
}
