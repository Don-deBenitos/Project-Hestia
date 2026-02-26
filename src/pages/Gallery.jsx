import { useState, useEffect, useRef } from 'react'
import {
  fetchGalleryEntries,
  addGalleryEntry,
  updateGalleryEntryTitle,
  deleteGalleryEntry,
  uploadPhoto,
  updatePhotoAlt,
  removePhoto,
  isVideoMedia,
} from '../lib/galleryApi'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Fallback when Supabase is not configured
const GALLERY_TIMELINE = [
  {
    id: 'local-1',
    title: 'Welcome home — first days',
    photos: [
      { src: '/image/hestia.jpg', alt: 'Newborn feet' },
      { src: '/image/hestia.jpg', alt: 'Sleeping' },
      { src: '/image/hestia.jpg', alt: 'Baby hands' },
    ],
  },
  {
    id: 'local-2',
    title: 'Baby turning 1 month old',
    photos: [
      { src: '/image/hestia.jpg', alt: 'In blanket' },
      { src: '/image/hestia.jpg', alt: 'Soft light' },
      { src: '/image/hestia.jpg', alt: 'Nursery' },
    ],
  },
  {
    id: 'local-3',
    title: '2 months — first smiles',
    photos: [
      { src: '/image/hestia.jpg', alt: 'Smiling' },
      { src: '/image/hestia.jpg', alt: 'First weeks' },
    ],
  },
  {
    id: 'local-4',
    title: '3 months old',
    photos: [
      { src: '/image/hestia.jpg', alt: 'Growing' },
      { src: '/image/hestia.jpg', alt: 'Every day' },
    ],
  },
]

/** Whether this gallery item is a video (by type or URL). */
function isVideo(item) {
  return item?.type === 'video' || isVideoMedia(item?.src)
}

function SlideShow({ photos }) {
  const [index, setIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px', threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const len = photos.length
  const prev = () => setIndex((i) => (i === 0 ? len - 1 : i - 1))
  const next = () => setIndex((i) => (i === len - 1 ? 0 : i + 1))

  if (len === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-beige-dark bg-beige-dark/20 py-16 text-center text-baby-text-soft dark:border-dark-border dark:bg-dark-surface/30 dark:text-dark-text-soft">
        No photos or videos in this section.
      </div>
    )
  }

  const current = photos[index]
  const currentIsVideo = isVideo(current)

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-2xl bg-beige-dark shadow-soft dark:bg-dark-surface dark:shadow-soft-dark [contain:layout_paint]">
      <div className="aspect-[4/3] relative">
        {!inView ? (
          <div className="absolute inset-0 bg-beige-dark/50 dark:bg-dark-surface/50" aria-hidden />
        ) : (
          <>
            {currentIsVideo ? (
              <video
                key={current.src}
                src={current.src}
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                aria-label={current.alt || 'Video'}
              />
            ) : (
              <img
                src={current.src}
                alt={current.alt}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            )}
            {len > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 active:bg-black/70"
                  aria-label="Previous"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 active:bg-black/70"
                  aria-label="Next"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition ${
                        i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to item ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Gallery() {
  const [entries, setEntries] = useState([])
  const [manageMode, setManageMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(null) // entryId
  const [editingTitle, setEditingTitle] = useState(null)
  const [editingTitleValue, setEditingTitleValue] = useState('')
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const configured = isSupabaseConfigured()
  const canManage = configured && !!user

  /** Entries from Supabase have UUID; fallback entries have id like 'local-1' and are read-only in manage mode */
  const isSupabaseEntry = (entry) => entry?.id && !String(entry.id).startsWith('local-')

  useEffect(() => {
    setError(null)
    if (configured) {
      fetchGalleryEntries()
        .then((data) => {
          setLoading(false)
          if (data === null) {
            setError('Could not load gallery.')
            setEntries(GALLERY_TIMELINE)
          } else if (Array.isArray(data)) {
            setEntries(data)
          } else {
            setEntries(GALLERY_TIMELINE)
          }
        })
        .catch((err) => {
          console.error('Gallery load error:', err)
          setLoading(false)
          setError('Could not load gallery.')
          setEntries(GALLERY_TIMELINE)
        })
    } else {
      setLoading(false)
      setEntries(GALLERY_TIMELINE)
    }
  }, [configured])

  const refresh = async () => {
    if (!configured) return
    setError(null)
    try {
      const data = await fetchGalleryEntries()
      if (data === null) {
        setError('Could not load gallery.')
        setEntries(GALLERY_TIMELINE)
        return
      }
      setEntries(Array.isArray(data) ? data : GALLERY_TIMELINE)
    } catch (err) {
      console.error('Gallery refresh error:', err)
      setError('Could not load gallery.')
      setEntries(GALLERY_TIMELINE)
    }
  }

  const handleAddSection = async () => {
    const title = newSectionTitle.trim() || 'New section'
    setNewSectionTitle('')
    setError(null)
    const result = await addGalleryEntry(title)
    if (result) {
      await refresh()
    } else {
      setError('Could not add section. Check that the gallery_entries table exists and RLS allows insert.')
    }
  }

  const handleUpdateTitle = async (entryId, title) => {
    setError(null)
    const ok = await updateGalleryEntryTitle(entryId, title)
    if (ok) {
      await refresh()
      setEditingTitle(null)
    } else {
      setError('Could not update title.')
    }
  }

  const handleDeleteEntry = async (entry) => {
    if (!confirm(`Delete section "${entry.title}" and all its photos?`)) return
    setError(null)
    const ok = await deleteGalleryEntry(entry.id, entry.photos || [])
    if (ok) {
      await refresh()
    } else {
      setError('Could not delete section.')
    }
  }

  const handleUpload = async (entryId, file, alt) => {
    if (!file) return
    setError(null)
    setUploading(entryId)
    try {
      const result = await uploadPhoto(entryId, file, alt || '')
      if (result?.success && result.src) {
        await refresh()
      } else {
        const err = result?.error
        const msg =
          typeof err?.message === 'string'
            ? err.message
            : typeof err?.error === 'string'
              ? err.error
              : err?.error_description || (err && JSON.stringify(err))
        setError(
          msg ||
            'Could not upload photo. Check that the "gallery" storage bucket exists and allows uploads. Open the browser console (F12) for details.'
        )
      }
    } catch (err) {
      setError(err?.message || 'Upload failed.')
    } finally {
      setUploading(null)
    }
  }

  const handleUpdateAlt = async (entryId, photoIndex, alt) => {
    setError(null)
    const ok = await updatePhotoAlt(entryId, photoIndex, alt)
    if (ok) {
      await refresh()
    } else {
      setError('Could not update caption.')
    }
  }

  const handleRemovePhoto = async (entryId, photoIndex, photos) => {
    if (!confirm('Remove this photo?')) return
    setError(null)
    const ok = await removePhoto(entryId, photoIndex, photos)
    if (ok) {
      await refresh()
    } else {
      setError('Could not remove photo.')
    }
  }

  const displayEntries = entries.map((e) => ({
    ...e,
    photos: Array.isArray(e.photos) ? e.photos : [],
  }))

  return (
    <>
      <section className="py-10 pb-6 text-center sm:py-12 sm:pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-medium tracking-wide text-baby-text sm:text-4xl md:text-5xl dark:text-dark-text">
            Photo Gallery
          </h1>
          <p className="mt-2 text-baby-text-soft dark:text-dark-text-soft">Precious moments of Hestia Elif</p>
          {canManage && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => { setManageMode((m) => !m); setError(null); }}
                className="rounded-lg bg-baby-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-dark-accent"
              >
                {manageMode ? 'Done editing' : 'Manage gallery'}
              </button>
            </div>
          )}
          {error && (
            <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-center text-baby-text-soft dark:text-dark-text-soft">Loading gallery…</p>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            {displayEntries.map((entry, i) => (
              <div key={entry.id} className="relative [content-visibility:auto] [contain-intrinsic-size:auto_300px]">
                {i > 0 && (
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-beige-dark dark:bg-dark-border -translate-y-12 sm:left-[1.25rem]" aria-hidden />
                )}
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-10 flex flex-col items-center pt-1 sm:w-12">
                    <div className="h-3 w-3 rounded-full bg-baby-accent dark:bg-dark-accent ring-4 ring-cream dark:ring-dark-bg" />
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    {manageMode && canManage ? (
                      <>
                        {!isSupabaseEntry(entry) ? (
                          <p className="text-sm text-baby-text-soft dark:text-dark-text-soft py-2">
                            Sample section — add a new section below to upload and manage your own photos.
                          </p>
                        ) : editingTitle === entry.id ? (
                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={editingTitleValue}
                              onChange={(e) => setEditingTitleValue(e.target.value)}
                              className="flex-1 min-w-[200px] rounded border border-beige-dark bg-cream px-3 py-2 text-baby-text dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateTitle(entry.id, editingTitleValue)
                                if (e.key === 'Escape') setEditingTitle(null)
                              }}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateTitle(entry.id, editingTitleValue)}
                              className="rounded bg-baby-accent px-3 py-2 text-sm text-white dark:bg-dark-accent"
                            >
                              Save
                            </button>
                            <button type="button" onClick={() => setEditingTitle(null)} className="text-sm text-baby-text-soft dark:text-dark-text-soft">Cancel</button>
                          </div>
                        ) : (
                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            <h2 className="font-display text-xl font-medium text-baby-text dark:text-dark-text">
                              {entry.title}
                            </h2>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTitle(entry.id)
                                setEditingTitleValue(entry.title)
                              }}
                              className="text-sm text-baby-text-soft underline hover:no-underline dark:text-dark-text-soft"
                            >
                              Edit title
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEntry(entry)}
                              className="text-sm text-red-600 dark:text-red-400"
                            >
                              Delete section
                            </button>
                          </div>
                        )}
                        {isSupabaseEntry(entry) && (
                          <>
                            <div className="mb-4 rounded-xl border border-dashed border-beige-dark p-4 dark:border-dark-border">
                              <p className="mb-2 text-sm text-baby-text-soft dark:text-dark-text-soft">Upload photo or video</p>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                disabled={!!uploading}
                                className="text-sm text-baby-text dark:text-dark-text"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  const alt = prompt('Caption for this item (optional):') || ''
                                  if (file) handleUpload(entry.id, file, alt)
                                  e.target.value = ''
                                }}
                              />
                              {uploading === entry.id && <span className="ml-2 text-sm text-baby-text-soft">Uploading…</span>}
                            </div>
                            {entry.photos.length > 0 && (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-baby-text dark:text-dark-text">Items in this section</p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  {entry.photos.map((photo, pi) => (
                                    <div
                                      key={pi}
                                      className="flex flex-col gap-2 rounded-lg border border-beige-dark bg-cream/50 p-3 dark:border-dark-border dark:bg-dark-surface/50"
                                    >
                                      {isVideo(photo) ? (
                                        <video
                                          src={photo.src}
                                          className="aspect-video w-full rounded object-cover"
                                          preload="metadata"
                                          muted
                                          playsInline
                                          aria-label={photo.alt || 'Video'}
                                        />
                                      ) : (
                                        <img
                                          src={photo.src}
                                          alt={photo.alt}
                                          className="aspect-video w-full rounded object-cover"
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      )}
                                      <input
                                        type="text"
                                        defaultValue={photo.alt}
                                        placeholder="Caption"
                                        className="rounded border border-beige-dark bg-white px-2 py-1 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                                        onBlur={(e) => {
                                          const v = e.target.value
                                          if (v !== photo.alt) handleUpdateAlt(entry.id, pi, v)
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(entry.id, pi, entry.photos)}
                                        className="self-start text-sm text-red-600 dark:text-red-400"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {!entry.photos.length && (
                              <p className="rounded-2xl border border-dashed border-beige-dark bg-beige-dark/30 py-8 text-center text-baby-text-soft dark:border-dark-border dark:bg-dark-surface/30 dark:text-dark-text-soft">
                                No photos or videos yet. Use the upload area above to add some.
                              </p>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <h2 className="font-display text-xl font-medium text-baby-text dark:text-dark-text mb-4">
                          {entry.title}
                        </h2>
                        <SlideShow photos={entry.photos} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {manageMode && canManage && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-beige-dark p-4 dark:border-dark-border">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="New section title"
                  className="min-w-[200px] flex-1 rounded border border-beige-dark bg-cream px-3 py-2 text-baby-text dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                />
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="rounded bg-baby-accent px-4 py-2 text-sm font-medium text-white dark:bg-dark-accent"
                >
                  Add section
                </button>
              </div>
            )}
          </div>
        )}

        {!configured && (
          <p className="mt-10 text-center text-sm text-baby-text-soft dark:text-dark-text-soft">
            To add, remove, or update photos from the app after deploy, set up Supabase and add <code className="rounded bg-beige-dark px-1 dark:bg-dark-surface dark:text-dark-text-soft">VITE_SUPABASE_URL</code> and <code className="rounded bg-beige-dark px-1 dark:bg-dark-surface dark:text-dark-text-soft">VITE_SUPABASE_ANON_KEY</code> to your environment. Until then, edit <code className="rounded bg-beige-dark px-1 dark:bg-dark-surface dark:text-dark-text-soft">GALLERY_TIMELINE</code> in Gallery.jsx.
          </p>
        )}
      </section>
    </>
  )
}
