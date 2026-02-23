import { useState, useCallback, useRef, useEffect } from 'react'

const HEART_CHARS = ['💕', '❤️', '💗', '🤍', '💖']
const MAX_HEARTS = 24
const THROTTLE_MS = 120
const BUBBLE_DURATION_MS = 1400

export default function BubbleHearts() {
  const [hearts, setHearts] = useState([])
  const [reduceMotion, setReduceMotion] = useState(false)
  const lastAt = useRef(0)
  const nextId = useRef(0)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mql.matches)
    const handler = () => setReduceMotion(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const addHeart = useCallback((clientX, clientY) => {
    if (reduceMotion) return
    const now = Date.now()
    if (now - lastAt.current < THROTTLE_MS) return
    lastAt.current = now

    const id = nextId.current++
    const char = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)]
    const size = 12 + Math.random() * 10
    const offsetX = (Math.random() - 0.5) * 24
    const offsetY = (Math.random() - 0.5) * 24

    setHearts((prev) => {
      const next = [...prev, { id, x: clientX + offsetX, y: clientY + offsetY, char, size }]
      if (next.length > MAX_HEARTS) return next.slice(-MAX_HEARTS)
      return next
    })

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, BUBBLE_DURATION_MS)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const handler = (e) => addHeart(e.clientX, e.clientY)
    window.addEventListener('pointermove', handler, { passive: true })
    return () => window.removeEventListener('pointermove', handler)
  }, [addHeart, reduceMotion])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="bubble-heart absolute -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: heart.x,
            top: heart.y,
            fontSize: `${heart.size}px`,
          }}
        >
          {heart.char}
        </span>
      ))}
    </div>
  )
}
