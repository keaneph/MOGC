"use client"

import confetti, { Options } from "canvas-confetti"

import { useEffect } from "react"

export default function Confetti2() {
  useEffect(() => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
    } as Options

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      })

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      })
    }

    const t1 = setTimeout(shoot, 100)
    const t2 = setTimeout(shoot, 300)
    const t3 = setTimeout(shoot, 500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])
  return null
}
