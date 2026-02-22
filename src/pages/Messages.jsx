import { useState, useEffect } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  fetchMessages,
  addMessage,
  updateMessage,
  deleteMessage,
} from '../lib/messagesApi'

const STORAGE_KEY = 'baby_messages'

const WELCOME_MESSAGE = {
  author: 'Mom & Dad',
  date: 'Welcome to the world, Hestia Elif.',
  body: "This is your very own corner of the internet, Hestia. One day you'll read all the messages here and know how loved you are. 💕",
}

const DUMMY_MESSAGES = [
  { author: 'Grandma', date: 'March 1, 2026', body: 'Welcome to the world, sweet Hestia Elif! I can\'t wait to hold you and watch you grow. You are so loved. 🌸' },
  { author: 'Uncle Alex', date: 'March 5, 2026', body: 'Hey little one! Your cousin is already asking when you can play together. So happy you\'re here.' },
  { author: 'Auntie M.', date: 'March 10, 2026', body: 'Hestia, you have the most beautiful name. Sending you so much love and cuddles from across the miles. 💕' },
  { author: 'Family friends', date: 'March 15, 2026', body: 'Congratulations! We\'ve been following your photos — you are absolutely precious. Can\'t wait to meet you in person.' },
]

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getStoredMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return list.map((m) => (m.id ? m : { ...m, id: makeId() }))
  } catch {
    return []
  }
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {}
}

function Avatar({ name, isWelcome }) {
  const initial = name.charAt(0).toUpperCase()
  return (
    <div
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
        isWelcome
          ? 'bg-hero-accent/20 text-hero-accent dark:bg-hero-accent/30 dark:text-amber-200'
          : 'bg-blush text-baby-text dark:bg-dark-accent dark:text-dark-text'
      }`}
    >
      {isWelcome ? '💕' : initial}
    </div>
  )
}

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured())
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editAuthor, setEditAuthor] = useState('')
  const [editBody, setEditBody] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

  const useSupabase = isSupabaseConfigured()

  // Load messages: from Supabase if configured, else from localStorage
  useEffect(() => {
    if (useSupabase) {
      fetchMessages().then((data) => {
        setLoading(false)
        setMessages(Array.isArray(data) ? data : [])
      })
    } else {
      setMessages(getStoredMessages())
      setLoading(false)
    }
  }, [useSupabase])

  // Persist to localStorage only when not using Supabase
  useEffect(() => {
    if (!useSupabase && messages.length >= 0) saveMessages(messages)
  }, [messages, useSupabase])

  useEffect(() => {
    if (!showThankYou) return
    const t = setTimeout(() => setShowThankYou(false), 5000)
    return () => clearTimeout(t)
  }, [showThankYou])

  async function handleSubmit(e) {
    e.preventDefault()
    const a = author.trim()
    const b = body.trim()
    if (!a || !b) return
    if (useSupabase) {
      const created = await addMessage(a, b)
      if (created) {
        setMessages((prev) => [created, ...prev])
        setBody('')
        setShowThankYou(true)
      }
    } else {
      setMessages((prev) => [
        {
          id: makeId(),
          author: a,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          body: b,
        },
        ...prev,
      ])
      setBody('')
      setShowThankYou(true)
    }
  }

  function startEdit(m) {
    setEditingId(m.id)
    setEditAuthor(m.author)
    setEditBody(m.body)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditAuthor('')
    setEditBody('')
  }

  async function saveEdit() {
    const a = editAuthor.trim()
    const b = editBody.trim()
    if (!a || !b) return
    if (useSupabase) {
      const ok = await updateMessage(editingId, a, b)
      if (ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingId
              ? { ...msg, author: a, body: b, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }
              : msg
          )
        )
      }
    } else {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingId
            ? {
                ...msg,
                author: a,
                body: b,
                date: new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
              }
            : msg
        )
      )
    }
    cancelEdit()
  }

  async function removeMessage(id) {
    if (!window.confirm('Remove this message?')) return
    if (useSupabase) {
      const ok = await deleteMessage(id)
      if (ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id))
        if (editingId === id) cancelEdit()
      }
    } else {
      setMessages((prev) => prev.filter((msg) => msg.id !== id))
      if (editingId === id) cancelEdit()
    }
  }

  const inputBase =
    'w-full rounded-xl border border-beige-dark bg-cream px-4 py-3 font-body text-baby-text placeholder:text-baby-text-soft/70 outline-none transition focus:border-baby-accent focus:ring-2 focus:ring-baby-accent/20 dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text dark:placeholder:text-dark-text-soft/70 dark:focus:border-dark-accent dark:focus:ring-dark-accent/20'

  return (
    <>
      <section className="py-10 pb-4 text-center sm:py-12 sm:pb-6">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-medium tracking-wide text-baby-text sm:text-4xl dark:text-dark-text">
            Message Board
          </h1>
          <p className="mt-2 text-baby-text-soft dark:text-dark-text-soft">
            Leave a note for Hestia Elif to read when she's older
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-12 sm:px-6 sm:pb-16">
        {/* Write message card */}
        <div className="mb-12 rounded-3xl border border-beige-dark/50 bg-blush-soft/50 p-6 shadow-soft dark:border-dark-border/50 dark:bg-dark-surface/50 dark:shadow-soft-dark sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush text-baby-text dark:bg-dark-accent dark:text-dark-text">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <div>
              <h2 className="font-display text-xl font-medium text-baby-text dark:text-dark-text">
                Write your message
              </h2>
              <p className="text-sm text-baby-text-soft dark:text-dark-text-soft">
                Your note will appear below for Hestia to read one day
              </p>
            </div>
          </div>
          {showThankYou && (
            <div className="mb-6 rounded-xl border border-baby-accent/30 bg-blush/40 py-4 px-5 text-center dark:border-hero-accent/40 dark:bg-hero-accent/10">
              <p className="m-0 font-medium text-baby-text dark:text-dark-text">
                Thank you! Your message has been posted. 💕
              </p>
              <p className="mt-1 text-sm text-baby-text-soft dark:text-dark-text-soft">
                Hestia will love reading it one day.
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="author" className="mb-1.5 block text-sm font-medium text-baby-text-soft dark:text-dark-text-soft">
                Your name
              </label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Grandma Jane"
                required
                className={inputBase}
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-baby-text-soft dark:text-dark-text-soft">
                Your message
              </label>
              <textarea
                id="message"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write a note for Hestia Elif..."
                required
                minLength={1}
                rows={4}
                className={`${inputBase} min-h-[120px] resize-y`}
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-blush py-3.5 font-medium text-baby-text shadow-soft transition hover:bg-baby-accent-blush hover:shadow-md dark:bg-dark-accent dark:text-dark-text dark:hover:bg-dark-accent-hover sm:w-auto sm:px-8"
            >
              Post message
            </button>
          </form>
        </div>

        {/* Messages list */}
        <h2 className="font-display text-xl font-medium text-baby-text mb-6 dark:text-dark-text">
          Messages for Hestia
        </h2>
        {loading && (
          <p className="text-baby-text-soft dark:text-dark-text-soft mb-4">Loading messages…</p>
        )}
        <ul className="list-none space-y-5 p-0 m-0">
          <li className="flex gap-4 rounded-2xl border-l-4 border-hero-accent bg-cream p-5 shadow-soft dark:border-hero-accent/70 dark:bg-dark-surface dark:shadow-soft-dark">
            <Avatar name={WELCOME_MESSAGE.author} isWelcome />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-baby-text dark:text-dark-text">{WELCOME_MESSAGE.author}</span>
                <span className="text-xs text-baby-text-soft dark:text-dark-text-soft">{WELCOME_MESSAGE.date}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-baby-text leading-relaxed dark:text-dark-text">
                {WELCOME_MESSAGE.body}
              </p>
            </div>
          </li>
          {DUMMY_MESSAGES.map((m, i) => (
            <li
              key={`dummy-${i}`}
              className="flex gap-4 rounded-2xl border border-beige-dark/60 bg-cream p-5 shadow-soft dark:border-dark-border/60 dark:bg-dark-surface dark:shadow-soft-dark"
            >
              <Avatar name={m.author} isWelcome={false} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-baby-text dark:text-dark-text">{m.author}</span>
                  <span className="text-xs text-baby-text-soft dark:text-dark-text-soft">{m.date}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-baby-text leading-relaxed dark:text-dark-text">
                  {m.body}
                </p>
              </div>
            </li>
          ))}
          {messages.map((m) => (
            <li
              key={m.id}
              className="flex gap-4 rounded-2xl border border-beige-dark/60 bg-cream p-5 shadow-soft dark:border-dark-border/60 dark:bg-dark-surface dark:shadow-soft-dark"
            >
              <Avatar name={editingId === m.id ? editAuthor : m.author} isWelcome={false} />
              <div className="min-w-0 flex-1">
                {editingId === m.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      placeholder="Your name"
                      className={`${inputBase} text-sm`}
                    />
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      placeholder="Your message"
                      rows={3}
                      className={`${inputBase} min-h-[80px] resize-y text-sm`}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="min-h-[44px] rounded-lg bg-blush px-4 py-2 text-sm font-medium text-baby-text transition hover:bg-baby-accent-blush dark:bg-dark-accent dark:text-dark-text dark:hover:bg-dark-accent-hover"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="min-h-[44px] rounded-lg border border-beige-dark px-4 py-2 text-sm font-medium text-baby-text-soft transition hover:bg-beige-dark/50 dark:border-dark-border dark:text-dark-text-soft dark:hover:bg-dark-surface-alt"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-semibold text-baby-text dark:text-dark-text">{m.author}</span>
                        <span className="text-xs text-baby-text-soft dark:text-dark-text-soft">{m.date}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(m)}
                          className="min-h-[44px] min-w-[44px] rounded-lg px-3 py-2 text-sm font-medium text-baby-text-soft transition hover:bg-blush hover:text-baby-text dark:hover:bg-dark-surface-alt dark:hover:text-dark-text"
                          title="Edit message"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMessage(m.id)}
                          className="min-h-[44px] min-w-[44px] rounded-lg px-3 py-2 text-sm font-medium text-baby-text-soft transition hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                          title="Remove message"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-baby-text leading-relaxed dark:text-dark-text">
                      {m.body}
                    </p>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-baby-text-soft dark:text-dark-text-soft">
          {useSupabase
            ? 'Messages are saved permanently. They will still be here after you refresh or open the site on another device.'
            : 'Messages are saved in your browser (localStorage) only. Add Supabase and create the messages table to save them permanently (see GALLERY_SETUP.md).'}
        </p>
      </section>
    </>
  )
}
