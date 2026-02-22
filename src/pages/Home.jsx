import { Link } from 'react-router-dom'

// Use your baby photo: add a JPG or PNG as public/image/banner.jpg (browsers don't support HEIC)
const HERO_IMAGE = '/image/banner.jpg'

export default function Home() {
  return (
    <>
      {/* Full-bleed hero — single banner image, no carousel */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blush-soft via-cream to-sky-soft dark:from-dark-surface dark:via-dark-bg dark:to-dark-surface-alt" aria-hidden />
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover object-center"
            style={{ display: 'block' }}
          />
        </div>
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" aria-hidden />

        {/* Content: centered block, no photo gallery */}
        <div className="relative z-10 flex min-h-screen flex-col justify-center px-4 pt-20 pb-10 sm:px-6 sm:pt-24 sm:pb-12">
          <div className="mx-auto max-w-xl w-full text-center">
            <div className="h-px w-12 bg-white/80 mb-4 mx-auto" />
            <p className="font-body text-sm uppercase tracking-[0.25em] text-white/90 mb-2">
              Welcome to
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-wide text-white sm:text-5xl md:text-6xl">
              Hestia Elif
            </h1>
            <p className="mt-4 text-white/90 text-base leading-relaxed max-w-md mx-auto">
              A gentle corner of the web for our little one — photos, milestones, and messages from everyone who loves her.
            </p>
            <Link
              to="/gallery"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-3 rounded-lg border-2 border-white px-6 py-3 font-medium text-white no-underline transition hover:bg-white/10 active:bg-white/20"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hero-accent text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </span>
              View gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Short intro below hero */}
      <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-12">
        <h2 className="font-display text-2xl font-medium text-baby-text mb-4 dark:text-dark-text">
          Hestia's corner
        </h2>
        <p className="text-baby-text-soft dark:text-dark-text-soft max-w-xl mx-auto">
          This is her little corner of the web — photos, first milestones, and messages from the people who love her.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/gallery" className="text-baby-text underline hover:no-underline dark:text-dark-text">Gallery</Link>
          <span className="text-baby-text-soft dark:text-dark-text-soft">·</span>
          <Link to="/milestones" className="text-baby-text underline hover:no-underline dark:text-dark-text">Milestones</Link>
          <span className="text-baby-text-soft dark:text-dark-text-soft">·</span>
          <Link to="/messages" className="text-baby-text underline hover:no-underline dark:text-dark-text">Message board</Link>
        </div>
      </section>
    </>
  )
}
