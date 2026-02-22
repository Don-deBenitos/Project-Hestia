import { supabase, isSupabaseConfigured } from './supabase'

/**
 * @typedef {{ id: string, author: string, body: string, date: string, created_at?: string }} Message
 */

/**
 * Fetch all messages from Supabase (newest first).
 * @returns {Promise<Message[]|null>}
 */
export async function fetchMessages() {
  if (!isSupabaseConfigured()) return null
  const { data, error } = await supabase
    .from('messages')
    .select('id, author, body, created_at')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Messages fetch error:', error)
    return null
  }
  if (!data || data.length === 0) return []
  return data.map((row) => ({
    id: row.id,
    author: row.author,
    body: row.body,
    date: formatDate(row.created_at),
    created_at: row.created_at,
  }))
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Add a new message.
 * @param {string} author
 * @param {string} body
 * @returns {Promise<Message|null>}
 */
export async function addMessage(author, body) {
  if (!isSupabaseConfigured()) return null
  const { data, error } = await supabase
    .from('messages')
    .insert({ author: author.trim(), body: body.trim() })
    .select('id, author, body, created_at')
    .single()
  if (error) {
    console.error('Add message error:', error)
    return null
  }
  return {
    id: data.id,
    author: data.author,
    body: data.body,
    date: formatDate(data.created_at),
    created_at: data.created_at,
  }
}

/**
 * Update a message.
 * @param {string} id
 * @param {string} author
 * @param {string} body
 */
export async function updateMessage(id, author, body) {
  if (!isSupabaseConfigured()) return false
  const { error } = await supabase
    .from('messages')
    .update({ author: author.trim(), body: body.trim() })
    .eq('id', id)
  if (error) console.error('Update message error:', error)
  return !error
}

/**
 * Delete a message.
 * @param {string} id
 */
export async function deleteMessage(id) {
  if (!isSupabaseConfigured()) return false
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) console.error('Delete message error:', error)
  return !error
}
