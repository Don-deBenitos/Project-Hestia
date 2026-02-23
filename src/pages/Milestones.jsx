import { useState, useEffect } from 'react'
import {
  fetchMilestones,
  addMilestone,
  updateMilestone,
  deleteMilestone,
} from '../lib/milestonesApi'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const FALLBACK_MILESTONES = [
  { id: 'local-1', date: 'Week 1', title: 'First week home', note: 'Settling in and getting to know each other. So much cuddling and soft light.', achieved: true },
  { id: 'local-2', date: 'Feb 18', title: 'First smile', note: 'A tiny grin while napping in the morning. We melted.', achieved: true },
  { id: 'local-3', date: '—', title: 'First laugh', note: "We're waiting for that first giggle. Any day now.", achieved: false },
  { id: 'local-4', date: '—', title: 'First solid food', note: 'A messy milestone to look forward to in a few months.', achieved: false },
  { id: 'local-5', date: '—', title: 'First word', note: "We'll capture it here when Hestia says her first word.", achieved: false },
  { id: 'local-6', date: '—', title: 'First steps', note: "The beginning of many adventures. Can't wait.", achieved: false },
]

export default function Milestones() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [manageMode, setManageMode] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editDate, setEditDate] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editNote, setEditNote] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newNote, setNewNote] = useState('')
  const { user } = useAuth()
  const configured = isSupabaseConfigured()
  const canManage = configured && !!user
  const isSupabaseItem = (m) => m?.id && !String(m.id).startsWith('local-')

  useEffect(() => {
    setError(null)
    if (configured) {
      fetchMilestones()
        .then((data) => {
          setLoading(false)
          if (data === null) {
            setError('Could not load milestones.')
            setItems(FALLBACK_MILESTONES)
          } else if (Array.isArray(data)) {
            setItems(data.length > 0 ? data : data)
          } else {
            setItems(FALLBACK_MILESTONES)
          }
        })
        .catch((err) => {
          console.error('Milestones load error:', err)
          setLoading(false)
          setError('Could not load milestones.')
          setItems(FALLBACK_MILESTONES)
        })
    } else {
      setLoading(false)
      setItems(FALLBACK_MILESTONES)
    }
  }, [configured])

  const refresh = async () => {
    if (!configured) return
    setError(null)
    try {
      const data = await fetchMilestones()
      if (data === null) {
        setError('Could not load milestones.')
        setItems(FALLBACK_MILESTONES)
        return
      }
      setItems(Array.isArray(data) ? data : FALLBACK_MILESTONES)
    } catch (err) {
      console.error('Milestones refresh error:', err)
      setError('Could not load milestones.')
      setItems(FALLBACK_MILESTONES)
    }
  }

  const handleAdd = async () => {
    const title = newTitle.trim() || 'New milestone'
    setError(null)
    setNewTitle('')
    setNewDate('')
    setNewNote('')
    const result = await addMilestone({ date: newDate.trim() || '—', title, note: newNote.trim(), achieved: false })
    if (result) await refresh()
    else setError('Could not add milestone. Check that the milestones table exists and RLS allows insert.')
  }

  const startEdit = (m) => {
    setEditingId(m.id)
    setEditDate(m.date)
    setEditTitle(m.title)
    setEditNote(m.note)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setError(null)
    const ok = await updateMilestone(editingId, { date: editDate.trim() || '—', title: editTitle.trim(), note: editNote.trim() })
    if (ok) {
      await refresh()
      setEditingId(null)
    } else setError('Could not update milestone.')
  }

  const handleToggleAchieved = async (m) => {
    if (!isSupabaseItem(m)) return
    setError(null)
    const ok = await updateMilestone(m.id, { achieved: !m.achieved })
    if (ok) await refresh()
    else setError('Could not update milestone.')
  }

  const handleDelete = async (m) => {
    if (!confirm(`Delete "${m.title}"?`)) return
    if (!isSupabaseItem(m)) return
    setError(null)
    const ok = await deleteMilestone(m.id)
    if (ok) await refresh()
    else setError('Could not delete milestone.')
  }

  return (
    <>
      <section className="py-10 pb-6 text-center sm:py-12 sm:pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-medium tracking-wide text-baby-text sm:text-4xl md:text-5xl dark:text-dark-text">
            Milestone Tracker
          </h1>
          <p className="mt-2 text-baby-text-soft dark:text-dark-text-soft">Hestia Elif's first smiles, first steps, and everything in between</p>
          {canManage && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => { setManageMode((m) => !m); setError(null); }}
                className="rounded-lg bg-baby-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-dark-accent"
              >
                {manageMode ? 'Done editing' : 'Manage milestones'}
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
          <p className="text-center text-baby-text-soft dark:text-dark-text-soft">Loading milestones…</p>
        ) : (
          <>
            <ul className="list-none p-0 m-0 space-y-3">
              {items.map((m) => (
                <li
                  key={m.id}
                  className={`flex gap-3 rounded-2xl bg-cream p-4 dark:bg-dark-surface sm:gap-4 sm:p-5 ${
                    m.achieved ? 'border-l-4 border-baby-accent-sky dark:border-dark-accent' : 'border-l-4 border-baby-accent-blush dark:border-dark-border'
                  }`}
                >
                  {manageMode && canManage && editingId === m.id ? (
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="text"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          placeholder="Date"
                          className="w-24 rounded border border-beige-dark bg-white px-2 py-1 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                        />
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                          className="min-w-[160px] flex-1 rounded border border-beige-dark bg-white px-2 py-1 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                        />
                      </div>
                      <input
                        type="text"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder="Note"
                        className="w-full rounded border border-beige-dark bg-white px-2 py-1 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={handleSaveEdit} className="rounded bg-baby-accent px-3 py-1.5 text-sm text-white dark:bg-dark-accent">
                          Save
                        </button>
                        <button type="button" onClick={cancelEdit} className="text-sm text-baby-text-soft dark:text-dark-text-soft">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="shrink-0 text-sm text-baby-text-soft dark:text-dark-text-soft">{m.date}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-baby-text dark:text-dark-text">{m.title}</div>
                        <p className="m-0 text-[0.95rem] text-baby-text-soft dark:text-dark-text-soft">{m.note}</p>
                      </div>
                      {manageMode && canManage && isSupabaseItem(m) && (
                        <div className="flex shrink-0 flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleAchieved(m)}
                            className="text-xs text-baby-text-soft underline dark:text-dark-text-soft"
                          >
                            {m.achieved ? 'Mark not achieved' : 'Mark achieved'}
                          </button>
                          <button type="button" onClick={() => startEdit(m)} className="text-xs text-baby-text-soft underline dark:text-dark-text-soft">
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(m)} className="text-xs text-red-600 dark:text-red-400">
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>

            {manageMode && canManage && (
              <div className="mt-6 rounded-xl border border-dashed border-beige-dark p-4 dark:border-dark-border">
                <p className="mb-3 text-sm font-medium text-baby-text dark:text-dark-text">Add milestone</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Date (e.g. Feb 18)"
                    className="w-full rounded border border-beige-dark bg-cream px-3 py-2 text-sm text-baby-text sm:w-32 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                  />
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Title"
                    className="min-w-[160px] flex-1 rounded border border-beige-dark bg-cream px-3 py-2 text-sm text-baby-text dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                  />
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Note (optional)"
                    className="w-full rounded border border-beige-dark bg-cream px-3 py-2 text-sm text-baby-text sm:w-full dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                  />
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="rounded bg-baby-accent px-4 py-2 text-sm font-medium text-white dark:bg-dark-accent"
                  >
                    Add milestone
                  </button>
                </div>
              </div>
            )}

            {!configured && (
              <p className="mt-6 text-center text-sm text-baby-text-soft dark:text-dark-text-soft">
                To add and edit milestones from the app, set up Supabase and add your env vars, then use <strong>Admin</strong> to sign in and manage milestones.
              </p>
            )}
          </>
        )}
      </section>
    </>
  )
}
