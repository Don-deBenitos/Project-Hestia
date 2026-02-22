import { useMemo } from 'react'

const HEART_CHARS = ['💕', '❤️', '💗', '🤍', '💖']
const FALLING_HEARTS_CONFIG = [
  { left: 5, duration: 18, delay: 0 },
  { left: 14, duration: 22, delay: 2 },
  { left: 22, duration: 15, delay: 5 },
  { left: 30, duration: 20, delay: 1 },
  { left: 38, duration: 16, delay: 8 },
  { left: 48, duration: 19, delay: 3 },
  { left: 56, duration: 21, delay: 11 },
  { left: 65, duration: 17, delay: 4 },
  { left: 73, duration: 14, delay: 7 },
  { left: 82, duration: 23, delay: 0 },
  { left: 90, duration: 16, delay: 6 },
  { left: 8, duration: 20, delay: 10 },
  { left: 42, duration: 15, delay: 9 },
  { left: 68, duration: 18, delay: 12 },
]

export default function FallingHearts() {
  const hearts = useMemo(
    () =>
      FALLING_HEARTS_CONFIG.map((config, i) => ({
        ...config,
        char: HEART_CHARS[i % HEART_CHARS.length],
        size: 14 + (i % 3) * 6,
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
          className="absolute text-hero-accent/60 dark:text-hero-accent/50 will-change-transform"
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
