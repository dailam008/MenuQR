'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroCounterProps {
  target: number
  suffix?: string
  duration?: number
}

export function HeroCounter({ target, suffix = '', duration = 1600 }: HeroCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let startTime: number | null = null

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
            else setCount(target)
          }

          requestAnimationFrame(step)
        }
      },
      { threshold: 0.4 }
    )

    const el = ref.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString('id-ID')}
      {suffix}
    </span>
  )
}
