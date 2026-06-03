'use client'

import { useEffect, useState } from 'react'

export interface PlanLimitData {
  plan: 'free' | 'pro'
  outletCount: number
  menuCount: number
  canAddOutlet: boolean
  canAddMenu: boolean
  isPro: boolean
  proUntil: Date | null
  expiresInDays: number | null
  loading: boolean
  refresh: () => Promise<void>
}

export function usePlanLimit(): PlanLimitData {
  const [data, setData] = useState<{
    plan: 'free' | 'pro'
    outletCount: number
    menuCount: number
    proExpiredAt: string | null
  }>({
    plan: 'free',
    outletCount: 0,
    menuCount: 0,
    proExpiredAt: null
  })
  const [loading, setLoading] = useState(true)

  async function fetchLimit() {
    try {
      const res = await fetch('/api/auth/plan-limit?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache' }
      })
      if (res.ok) {
        const body = await res.json()
        setData(body)
      }
    } catch (e) {
      console.error('Failed to load plan limits:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLimit()
  }, [])

  const plan = data.plan
  const isPro = plan === 'pro'
  const outletCount = data.outletCount
  const menuCount = data.menuCount

  const canAddOutlet = isPro ? outletCount < 5 : outletCount < 1
  const canAddMenu = isPro ? true : menuCount < 50

  const proUntil = data.proExpiredAt ? new Date(data.proExpiredAt) : null
  
  let expiresInDays: number | null = null
  if (proUntil) {
    const diff = proUntil.getTime() - Date.now()
    expiresInDays = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
  }

  return {
    plan,
    outletCount,
    menuCount,
    canAddOutlet,
    canAddMenu,
    isPro,
    proUntil,
    expiresInDays,
    loading,
    refresh: fetchLimit
  }
}
