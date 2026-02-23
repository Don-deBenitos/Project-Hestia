import { useLocation, Outlet } from 'react-router-dom'
import Nav from './Nav'
import ThemeToggle from './ThemeToggle'
import FallingHearts from './FallingHearts'
import BubbleHearts from './BubbleHearts'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <FallingHearts />
      <BubbleHearts />
      <header
        className={`sticky top-0 z-50 transition-colors ${
          isHome
            ? 'bg-black/40 backdrop-blur-sm'
            : 'bg-gradient-to-b from-blush-soft/95 to-cream/80 backdrop-blur-md border-b border-beige-dark/30 dark:from-dark-surface dark:to-dark-bg dark:border-dark-border'
        }`}
      >
        <div className="relative mx-auto max-w-6xl px-4 flex items-center justify-between gap-3 py-3 sm:px-6 sm:py-5 sm:gap-4">
          <Nav isHero={isHome} />
          <ThemeToggle isHero={isHome} />
        </div>
      </header>
      <main className="relative z-10">
        <Outlet />
      </main>
      <footer className="mt-12 border-t border-beige-dark py-8 text-center text-sm text-baby-text-soft dark:border-dark-border dark:text-dark-text-soft">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          Made with love for Hestia Elif
        </div>
      </footer>
    </>
  )
}
