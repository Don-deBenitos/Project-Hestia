import { useMemo } from 'react'

const HEART_CHARS = ['💕', '💗', '🤍']
const FALLING_HEARTS_CONFIG = [
  { left: 8, duration: 26, delay: 0 },
  { left: 26, duration: 32, delay: 4 },
  { left: 44, duration: 28, delay: 9 },
  { left: 62, duration: 30, delay: 2 },
  { left: 78, duration: 34, delay: 7 },
  { left: 90, duration: 29, delay: 11 },
]

export default function FallingHearts() {
  const hearts = useMemo(
    () =>
      FALLING_HEARTS_CONFIG.map((config, i) => ({
        ...config,
        char: HEART_CHARS[i % HEART_CHARS.length],
        size: 12 + (i % 3) * 4,
      })),
    []
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {hearts.map((heart, i) => (
        <span
          key={i}
          className="absolute text-hero-accent/40 dark:text-hero-accent/35 will-change-transform"
          style={{
            left: `${heart.left}%`,
            top: '-30px',
            fontSize: `${heart.size}px`,
            animation: 'fall linear infinite',
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          {heart.char}
        </span>
      ))}
    </div>
  )
}
