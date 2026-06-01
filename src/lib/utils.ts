import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getPublicMenuUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '')
  return `${baseUrl}/menu/${slug}`
}

export interface ParsedImage {
  thumbnail: string
  medium: string
  large: string
}

export function parseMenuImage(imageUrl: string | null): ParsedImage | null {
  if (!imageUrl) return null
  
  if (imageUrl.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(imageUrl)
      return {
        thumbnail: parsed.thumbnail || imageUrl,
        medium: parsed.medium || imageUrl,
        large: parsed.large || imageUrl,
      }
    } catch {
      // Fallback
    }
  }

  return {
    thumbnail: imageUrl,
    medium: imageUrl,
    large: imageUrl,
  }
}

export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim()
}
