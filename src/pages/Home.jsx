import { useState } from 'react'
import { Link } from 'react-router-dom'

// Use your baby photo: add a JPG or PNG as public/image/banner.jpg (browsers don't support HEIC)
// BASE_URL ensures correct path when deployed to a subpath (e.g. GitHub Pages)
const HERO_IMAGE = `${import.meta.env.BASE_URL}image/banner.jpg`

export default function Home() {
  const [bannerError, setBannerError] = useState(false)

  return (
    <>
      {/* Full-bleed hero — single banner image, no carousel */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blush-soft via-cream to-sky-soft dark:from-dark-surface dark:via-dark-bg dark:to-dark-surface-alt" aria-hidden />
        <div className="absolute inset-0">
          {!bannerError && (
            <img
              src={HERO_IMAGE}
              alt=""
              className="h-full w-full object-cover object-center"
              style={{ display: 'block' }}
              onError={() => setBannerError(true)}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" aria-hidden />

        {/* Content: centered block, no photo gallery */}
        <div className="relative z-10 flex min-h-screen flex-col justify-center px-4 pt-20 pb-10 sm:px-6 sm:pt-24 sm:pb-12">
          <div className="mx-auto max-w-xl w-full text-center">
            <div className="h-px w-12 bg-white/80 mb-4 mx-auto" />
            <h1 className="font-display text-4xl font-semibold tracking-wide text-white sm:text-5xl md:text-6xl">
              Welcome Hestia Elif Journey
            </h1>
            <p className="mt-4 text-white/90 text-base leading-relaxed max-w-md mx-auto">
              A place to share her journey — photos, milestones, and messages from everyone who loves her.
            </p>
            <Link
              to="/gallery"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-3 rounded-lg border-2 border-white px-6 py-3 font-medium text-white no-underline transition hover:bg-white/10 active:bg-white/20"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hero-accent text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
          A place to share her journey — photos, first milestones, and messages from the people who love her.
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
