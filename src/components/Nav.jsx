import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/milestones', label: 'Milestones' },
  { to: '/about', label: 'About' },
  { to: '/messages', label: 'Messages' },
  { to: '/admin', label: 'Admin' },
]

export default function Nav({ isHero = false }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on escape or when viewport grows past mobile
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    const onResize = () => window.innerWidth >= 768 && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  const baseLink = isHero
    ? 'block px-3.5 py-2 text-[0.9rem] font-medium no-underline transition-colors uppercase tracking-wider '
    : 'block rounded-2xl px-3.5 py-2 text-[0.95rem] font-medium no-underline transition-colors '

  const activeClass = isHero
    ? 'text-white border-b-2 border-hero-accent'
    : 'bg-blush text-baby-text dark:bg-dark-surface dark:text-dark-text'

  const inactiveClass = isHero
    ? 'text-white/90 hover:text-white border-b-2 border-transparent'
    : 'text-baby-text-soft hover:bg-blush hover:text-baby-text dark:text-dark-text-soft dark:hover:bg-dark-surface dark:hover:text-dark-text'

  const linkClass = ({ isActive }) => baseLink + (isActive ? activeClass : inactiveClass)

  return (
    <nav className="flex w-full items-center justify-between gap-4 md:w-auto">
      <NavLink
        to="/"
        onClick={() => setMenuOpen(false)}
        className={
          isHero
            ? 'font-display text-lg font-semibold tracking-wide text-white no-underline hover:text-white sm:text-xl md:shrink-0'
            : 'font-display text-lg font-medium tracking-wide text-baby-text no-underline hover:text-baby-text-soft dark:text-dark-text dark:hover:text-dark-text-soft sm:text-xl md:shrink-0'
        }
      >
        Hestia Elif
      </NavLink>

      {/* Desktop: horizontal links */}
      <ul className="hidden list-none gap-1 p-0 m-0 md:flex">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/'} className={linkClass}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile: hamburger button */}
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl md:hidden"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isHero ? 'text-white' : 'text-baby-text dark:text-dark-text'}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isHero ? 'text-white' : 'text-baby-text dark:text-dark-text'}>
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile: backdrop + full-width menu rendered in portal so they always cover viewport */}
      {menuOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[100] bg-black/30 md:hidden"
              style={{ top: 0, left: 0, right: 0, bottom: 0 }}
              aria-hidden
              onClick={() => setMenuOpen(false)}
            />
            <div
              className="fixed z-[101] border-b border-beige-dark/50 bg-cream py-4 shadow-lg dark:border-dark-border/50 dark:bg-dark-bg md:hidden"
              style={{ top: 0, left: 0, right: 0, width: '100%', maxWidth: '100vw' }}
              role="dialog"
              aria-label="Navigation menu"
            >
              <div className="mx-auto flex items-center justify-between px-4 pt-2 pb-2">
                <span className="font-display text-lg font-medium text-baby-text dark:text-dark-text">Menu</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-baby-text-soft hover:bg-blush hover:text-baby-text dark:text-dark-text-soft dark:hover:bg-dark-surface"
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <ul className="list-none flex flex-col gap-1 p-4 pt-0 m-0">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex min-h-[48px] items-center rounded-xl px-4 text-[1rem] font-medium no-underline transition-colors ${
                          isActive
                            ? 'bg-blush text-baby-text dark:bg-dark-surface dark:text-dark-text'
                            : 'text-baby-text-soft hover:bg-blush hover:text-baby-text dark:text-dark-text-soft dark:hover:bg-dark-surface dark:hover:text-dark-text'
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </>,
          document.body
        )}
    </nav>
  )
}
