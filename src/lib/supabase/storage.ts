import { createClient } from './client'

export async function deleteMenuImageStorage(imageUrl: string | null) {
  if (!imageUrl) return
  const supabase = createClient()

  // Helper to extract bucket path from public URL
  const getPathFromUrl = (url: string) => {
    const parts = url.split('/public/menu-images/')
    return parts.length > 1 ? parts[1] : null
  }

  const pathsToDelete: string[] = []

  if (imageUrl.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(imageUrl)
      if (parsed.thumbnail) {
        const p = getPathFromUrl(parsed.thumbnail)
        if (p) pathsToDelete.push(p)
      }
      if (parsed.medium) {
        const p = getPathFromUrl(parsed.medium)
        if (p) pathsToDelete.push(p)
      }
      if (parsed.large) {
        const p = getPathFromUrl(parsed.large)
        if (p) pathsToDelete.push(p)
      }
    } catch {
      // Ignore
    }
  } else {
    // Standard old single image
    const p = getPathFromUrl(imageUrl)
    if (p) pathsToDelete.push(p)
  }

  if (pathsToDelete.length > 0) {
    try {
      const { error } = await supabase.storage.from('menu-images').remove(pathsToDelete)
      if (error) {
        console.error('Error removing files from storage:', error)
      }
    } catch (err) {
      console.error('Failed to execute storage delete:', err)
    }
  }
}
