import { supabase, isSupabaseConfigured } from './supabase'

const BUCKET = 'gallery'

/** Get storage path from a public URL (e.g. .../gallery/entryId/file.ext → entryId/file.ext) */
function pathFromPublicUrl(url) {
  if (!url) return null
  try {
    const pathname = new URL(url).pathname
    const parts = pathname.split('/').filter(Boolean)
    const idx = parts.indexOf(BUCKET)
    if (idx !== -1 && idx < parts.length - 1) return parts.slice(idx + 1).join('/')
    return parts.slice(-2).join('/')
  } catch {
    return null
  }
}

/** @typedef {{ id: string, title: string, sort_order: number, photos: { src: string, alt: string }[] }} GalleryEntry */
/** @typedef {{ title: string, photos: { src: string, alt: string }[] }} GalleryEntryShape */

/**
 * Fetch all gallery entries from Supabase. Returns null if not configured or error.
 * @returns {Promise<GalleryEntryShape[]|null>}
 */
export async function fetchGalleryEntries() {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabase
      .from('gallery_entries')
      .select('id, title, sort_order, photos')
      .order('sort_order', { ascending: true })
    if (error) {
      console.error('Gallery fetch error:', error)
      return null
    }
    if (!data) return []
    return data.map((row) => ({
      id: String(row.id),
      title: row.title ?? '',
      sort_order: Number(row.sort_order) ?? 0,
      photos: Array.isArray(row.photos) ? row.photos : [],
    }))
  } catch (err) {
    console.error('Gallery fetch error:', err)
    return null
  }
}

/**
 * Add a new gallery section.
 * @param {string} title
 * @returns {Promise<{ id: string }|null>}
 */
export async function addGalleryEntry(title) {
  if (!isSupabaseConfigured()) return null
  const { data: max } = await supabase
    .from('gallery_entries')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const sort_order = (max?.sort_order ?? -1) + 1
  const { data, error } = await supabase
    .from('gallery_entries')
    .insert({ title, sort_order, photos: [] })
    .select('id')
    .single()
  if (error) {
    console.error('Add gallery entry error:', error)
    return null
  }
  return data ? { id: String(data.id) } : null
}

/**
 * Update a gallery entry's title.
 * @param {string} entryId
 * @param {string} title
 */
export async function updateGalleryEntryTitle(entryId, title) {
  if (!isSupabaseConfigured()) return false
  const { error } = await supabase
    .from('gallery_entries')
    .update({ title: String(title).trim() })
    .eq('id', entryId)
  if (error) {
    console.error('Update gallery entry error:', error)
    return false
  }
  return true
}

/**
 * Delete a gallery entry and its photos in storage.
 * @param {string} entryId
 * @param {{ src: string }[]} photos - used to try to remove files from storage
 */
export async function deleteGalleryEntry(entryId, photos = []) {
  if (!isSupabaseConfigured()) return false
  for (const p of photos) {
    try {
      const path = pathFromPublicUrl(p.src)
      if (path) await supabase.storage.from(BUCKET).remove([path])
    } catch (_) {}
  }
  const { error } = await supabase.from('gallery_entries').delete().eq('id', entryId)
  if (error) {
    console.error('Delete gallery entry error:', error)
    return false
  }
  return true
}

/**
 * Upload a photo for an entry and append to its photos array.
 * @param {string} entryId
 * @param {File} file
 * @param {string} alt
 * @returns {Promise<{ src: string }|null>}
 */
export async function uploadPhoto(entryId, file, alt = '') {
  if (!isSupabaseConfigured()) {
    return { success: false, error: { message: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } }
  }
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${entryId}/${crypto.randomUUID()}.${ext}`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (uploadError) {
    console.error('Upload photo error:', uploadError)
    return { success: false, error: uploadError }
  }
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const src = urlData?.publicUrl ?? ''

  const { data: row, error: selectError } = await supabase
    .from('gallery_entries')
    .select('photos')
    .eq('id', entryId)
    .single()
  if (selectError) {
    console.error('Select photos for update error:', selectError)
    return { success: false, error: selectError }
  }
  const photos = Array.isArray(row?.photos) ? [...row.photos] : []
  photos.push({ src, alt })

  const { error: updateError } = await supabase
    .from('gallery_entries')
    .update({ photos })
    .eq('id', entryId)
  if (updateError) {
    console.error('Update photos after upload error:', updateError)
    return { success: false, error: updateError }
  }
  return { success: true, src, alt }
}

/**
 * Update a photo's alt text by index in the entry.
 * @param {string} entryId
 * @param {number} photoIndex
 * @param {string} alt
 */
export async function updatePhotoAlt(entryId, photoIndex, alt) {
  if (!isSupabaseConfigured()) return false
  const { data: row } = await supabase.from('gallery_entries').select('photos').eq('id', entryId).single()
  const photos = Array.isArray(row?.photos) ? [...row.photos] : []
  if (photoIndex < 0 || photoIndex >= photos.length) return false
  photos[photoIndex] = { ...photos[photoIndex], alt }
  const { error } = await supabase.from('gallery_entries').update({ photos }).eq('id', entryId)
  if (error) console.error('Update photo alt error:', error)
  return !error
}

/**
 * Remove a photo from an entry (and optionally from storage).
 * @param {string} entryId
 * @param {number} photoIndex
 * @param {{ src: string }[]} currentPhotos - full photos array to derive path
 */
export async function removePhoto(entryId, photoIndex, currentPhotos) {
  if (!isSupabaseConfigured()) return false
  const photos = [...(currentPhotos || [])]
  if (photoIndex < 0 || photoIndex >= photos.length) return false
  const removed = photos.splice(photoIndex, 1)[0]
  try {
    const path = pathFromPublicUrl(removed?.src)
    if (path) await supabase.storage.from(BUCKET).remove([path])
  } catch (_) {}
  const { error } = await supabase.from('gallery_entries').update({ photos }).eq('id', entryId)
  if (error) {
    console.error('Remove photo error:', error)
    return false
  }
  return true
}
