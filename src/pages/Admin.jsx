import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Admin() {
  const { user, authLoading, isConfigured, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) return
    setSubmitting(true)
    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    setPassword('')
  }

  if (!isConfigured) {
    return (
      <section className="py-10 pb-6 text-center sm:py-12 sm:pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-medium tracking-wide text-baby-text sm:text-4xl dark:text-dark-text">
            Admin
          </h1>
          <p className="mt-4 text-baby-text-soft dark:text-dark-text-soft">
            Set up Supabase and add <code className="rounded bg-beige-dark px-1 dark:bg-dark-surface dark:text-dark-text-soft">VITE_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-beige-dark px-1 dark:bg-dark-surface dark:text-dark-text-soft">VITE_SUPABASE_ANON_KEY</code> to use admin login.
          </p>
        </div>
      </section>
    )
  }

  if (authLoading) {
    return (
      <section className="py-10 pb-6 text-center sm:py-12 sm:pb-8">
        <p className="text-baby-text-soft dark:text-dark-text-soft">Loading…</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="py-10 pb-6 sm:py-12 sm:pb-8">
        <div className="mx-auto max-w-sm px-4 sm:px-6">
          <h1 className="font-display text-2xl font-medium tracking-wide text-baby-text dark:text-dark-text text-center">
            Admin login
          </h1>
          <p className="mt-2 text-center text-sm text-baby-text-soft dark:text-dark-text-soft">
            Sign in to manage the gallery and milestones.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label htmlFor="admin-email" className="mb-1 block text-sm font-medium text-baby-text dark:text-dark-text">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-beige-dark bg-cream px-3 py-2 text-baby-text dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-baby-text dark:text-dark-text">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-beige-dark bg-cream px-3 py-2 text-baby-text dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-baby-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70 dark:bg-dark-accent"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 pb-6 sm:py-12 sm:pb-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-display text-3xl font-medium tracking-wide text-baby-text dark:text-dark-text">
          Manage site
        </h1>
        <p className="mt-2 text-baby-text-soft dark:text-dark-text-soft">
          You're signed in. Use the links below to manage content, then return here to sign out when done.
        </p>
        <ul className="mt-8 list-none space-y-3 p-0 m-0">
          <li>
            <Link
              to="/gallery"
              className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-baby-text no-underline transition hover:bg-blush dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface/80"
            >
              <span className="font-medium">Gallery</span>
              <span className="text-sm text-baby-text-soft dark:text-dark-text-soft">Add sections, upload photos, edit captions</span>
            </Link>
          </li>
          <li>
            <Link
              to="/milestones"
              className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-baby-text no-underline transition hover:bg-blush dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface/80"
            >
              <span className="font-medium">Milestones</span>
              <span className="text-sm text-baby-text-soft dark:text-dark-text-soft">Add, edit, and reorder milestones</span>
            </Link>
          </li>
        </ul>
        <div className="mt-8 pt-6 border-t border-beige-dark dark:border-dark-border">
          <button
            type="button"
            onClick={signOut}
            className="rounded-lg border border-beige-dark px-4 py-2 text-sm font-medium text-baby-text transition hover:bg-beige-dark/10 dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-surface"
          >
            Sign out
          </button>
        </div>
      </div>
    </section>
  )
}
