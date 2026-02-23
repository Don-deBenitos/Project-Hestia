import { supabase, isSupabaseConfigured } from './supabase'

const TABLE = 'milestones'

/**
 * @typedef {{ id: string, date: string, title: string, note: string, sort_order: number, achieved: boolean }} Milestone
 */

/**
 * Fetch all milestones from Supabase. Returns null if not configured or error.
 * @returns {Promise<Milestone[]|null>}
 */
export async function fetchMilestones() {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, date, title, note, sort_order, achieved')
      .order('sort_order', { ascending: true })
    if (error) {
      console.error('Milestones fetch error:', error)
      return null
    }
    if (!data) return []
    return data.map((row) => ({
      id: String(row.id),
      date: row.date ?? '—',
      title: row.title ?? '',
      note: row.note ?? '',
      sort_order: Number(row.sort_order) ?? 0,
      achieved: Boolean(row.achieved),
    }))
  } catch (err) {
    console.error('Milestones fetch error:', err)
    return null
  }
}

/**
 * Add a new milestone.
 * @param {{ date?: string, title: string, note?: string, achieved?: boolean }}
 * @returns {Promise<{ id: string }|null>}
 */
export async function addMilestone({ date = '—', title, note = '', achieved = false }) {
  if (!isSupabaseConfigured()) return null
  const { data: max } = await supabase
    .from(TABLE)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const sort_order = (max?.sort_order ?? -1) + 1
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ date: String(date).trim() || '—', title: String(title).trim(), note: String(note).trim(), sort_order, achieved: Boolean(achieved) })
    .select('id')
    .single()
  if (error) {
    console.error('Add milestone error:', error)
    return null
  }
  return data ? { id: String(data.id) } : null
}

/**
 * Update a milestone.
 * @param {string} id
 * @param {{ date?: string, title?: string, note?: string, achieved?: boolean }}
 */
export async function updateMilestone(id, { date, title, note, achieved }) {
  if (!isSupabaseConfigured()) return false
  const updates = {}
  if (date !== undefined) updates.date = String(date).trim() || '—'
  if (title !== undefined) updates.title = String(title).trim()
  if (note !== undefined) updates.note = String(note).trim()
  if (achieved !== undefined) updates.achieved = Boolean(achieved)
  if (Object.keys(updates).length === 0) return true
  const { error } = await supabase.from(TABLE).update(updates).eq('id', id)
  if (error) {
    console.error('Update milestone error:', error)
    return false
  }
  return true
}

/**
 * Delete a milestone.
 * @param {string} id
 */
export async function deleteMilestone(id) {
  if (!isSupabaseConfigured()) return false
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    console.error('Delete milestone error:', error)
    return false
  }
  return true
}
