'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, MapPin, Clock, Utensils, X, Info } from 'lucide-react'
import type { Outlet, Category, MenuItem } from '@/types/database'
import { formatRupiah, parseMenuImage } from '@/lib/utils'

interface MenuPublicClientProps {
  outlet: Outlet
  categories: Category[]
  menuItems: MenuItem[]
}

interface TagDef {
  label: string
  color: string
  text: string
}

export default function MenuPublicClient({ outlet, categories, menuItems }: MenuPublicClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const categoryRefs = useRef<Record<string, HTMLHeadingElement | null>>({})
  const tabsRef = useRef<HTMLDivElement>(null)

  // Extract tags based on keywords in name or description
  const getItemTags = (item: MenuItem): TagDef[] => {
    const tags: TagDef[] = []
    const text = `${item.name} ${item.description || ''}`.toLowerCase()

    if (text.includes('pedas') || text.includes('🌶️')) {
      tags.push({ label: 'Pedas 🌶️', color: '#fef2f2', text: '#ef4444' })
    }
    if (text.includes('manis') || text.includes('🍯')) {
      tags.push({ label: 'Manis 🍯', color: '#fffbeb', text: '#d97706' })
    }
    if (text.includes('veg') || text.includes('🥦') || text.includes('sehat')) {
      tags.push({ label: 'Vegetarian 🥦', color: '#f0fdf4', text: '#16a34a' })
    }
    if (text.includes('dingin') || text.includes('es') || text.includes('❄️') || text.includes('fresh')) {
      tags.push({ label: 'Segar ❄️', color: '#ecfeff', text: '#0891b2' })
    }
    if (text.includes('hangat') || text.includes('panas') || text.includes('☕')) {
      tags.push({ label: 'Hangat ☕', color: '#fff7ed', text: '#ea6c0a' })
    }
    if (text.includes('goreng') || text.includes('crispy') || text.includes('krispi')) {
      tags.push({ label: 'Crispy ✨', color: '#faf5ff', text: '#9333ea' })
    }

    return tags
  }

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems
    const q = searchQuery.toLowerCase()
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    )
  }, [menuItems, searchQuery])

  // Group filtered items by category
  const groupedMenu = useMemo(() => {
    const grouped: { id: string | null; name: string; items: MenuItem[] }[] = []

    // Categories in order
    categories.forEach((cat) => {
      const catItems = filteredItems.filter((item) => item.category_id === cat.id)
      if (catItems.length > 0) {
        grouped.push({ id: cat.id, name: cat.name, items: catItems })
      }
    })

    // Uncategorized items
    const uncategorized = filteredItems.filter((item) => !item.category_id)
    if (uncategorized.length > 0) {
      grouped.push({ id: null, name: 'Lainnya', items: uncategorized })
    }

    return grouped
  }, [categories, filteredItems])

  // Dynamic active tab scrolling observer
  useEffect(() => {
    if (searchQuery) return // Disable scroll highlight during search filtering

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-category-id')
          setSelectedCategory(id)

          // Scroll the sticky tab list horizontally to keep the active tab visible
          const tabButton = document.getElementById(`tab-btn-${id || 'lainnya'}`)
          if (tabButton && tabsRef.current) {
            const tabsContainer = tabsRef.current
            const scrollLeft =
              tabButton.offsetLeft -
              tabsContainer.clientWidth / 2 +
              tabButton.clientWidth / 2
            tabsContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' })
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    Object.values(categoryRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [groupedMenu, searchQuery])

  // Set first category as active initially
  useEffect(() => {
    if (groupedMenu.length > 0 && !selectedCategory) {
      setSelectedCategory(groupedMenu[0].id)
    }
  }, [groupedMenu, selectedCategory])

  // Track page view once on mount
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ outlet_id: outlet.id })
        })
      } catch (err) {
        console.error('Failed to track page view', err)
      }
    }
    trackView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToCategory = (id: string | null) => {
    setSelectedCategory(id)
    const target = categoryRefs.current[id || 'lainnya']
    if (target) {
      const yOffset = -130 // height of sticky search + tabs
      const y = target.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const openDetail = (item: MenuItem) => {
    setSelectedItem(item)
    setModalOpen(true)
    document.body.style.overflow = 'hidden' // Lock scroll

    // Track item view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outlet_id: outlet.id, menu_item_id: item.id })
    }).catch(console.error)
  }

  const closeDetail = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedItem(null), 300) // Delay cleanup for fade-out animation
    document.body.style.overflow = '' // Unlock scroll
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 60 }}>
      {/* 1. Header Warung Premium */}
      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
        {/* Cover Image Background (Premium gradient pattern fallback) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            zIndex: 0,
          }}
        />
        {/* Abstract decorative orange orb */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
        
        {/* Overlay Dark Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content over Cover */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 20px',
            zIndex: 2,
            maxWidth: '640px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '16px',
          }}
        >
          {/* Logo floating */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: '#ffffff',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              border: '4px solid #ffffff',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {outlet.logo_url ? (
              <img
                src={outlet.logo_url}
                alt={outlet.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Utensils size={32} color="#ffffff" />
              </div>
            )}
          </div>

          {/* Info Details */}
          <div style={{ flex: 1, color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                }}
              >
                Buka Sekarang
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '4px' }}>
              {outlet.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8, fontSize: '12px' }}>
              <MapPin size={12} color="#f97316" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                {outlet.address || 'Alamat tidak ditentukan'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Box (Optional) */}
      {outlet.description && (
        <div style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9', padding: '12px 20px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', fontSize: '13px', color: '#64748b', lineHeight: 1.6, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Info size={14} color="#f97316" style={{ marginTop: '2px', flexShrink: 0 }} />
            <p>{outlet.description}</p>
          </div>
        </div>
      )}

      {/* Sticky Navigation Container */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248, 250, 252, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '12px 16px 8px' }}>
          
          {/* 2. Search Bar Sticky */}
          <div style={{ position: 'relative', width: '100%', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Cari makanan atau minuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                fontSize: '14px',
                color: '#1e293b',
                outline: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              }}
              className="search-input-field"
            />
            <Search
              size={18}
              color="#94a3b8"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={12} color="#64748b" />
              </button>
            )}
          </div>

          {/* 3. Tab Kategori Sticky */}
          {groupedMenu.length > 0 && (
            <div
              ref={tabsRef}
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth',
              }}
              className="hide-scrollbar"
            >
              {groupedMenu.map((group) => {
                const isActive = selectedCategory === group.id
                return (
                  <button
                    key={group.id ?? 'lainnya'}
                    id={`tab-btn-${group.id || 'lainnya'}`}
                    onClick={() => scrollToCategory(group.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: isActive ? '#fff7ed' : '#ffffff',
                      color: isActive ? '#f97316' : '#64748b',
                      border: isActive ? '1.5px solid #fdba74' : '1.5px solid #e2e8f0',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    {group.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Menu Grid / Container */}
      <div style={{ maxWidth: '640px', margin: '16px auto 0', padding: '0 16px' }}>
        {groupedMenu.length === 0 ? (
          /* 6. Empty state total menu / category */
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px', filter: 'grayscale(0.2)' }}>🍽️</div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
              Menu tidak ditemukan
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '280px', margin: '0 auto', lineHeight: 1.5 }}>
              Maaf, kata kunci "{searchQuery}" tidak cocok dengan menu manapun di outlet ini.
            </p>
          </div>
        ) : (
          groupedMenu.map((group) => (
            <div
              key={group.id ?? 'lainnya'}
              ref={(el) => {
                categoryRefs.current[group.id ?? 'lainnya'] = el
              }}
              data-category-id={group.id ?? 'lainnya'}
              style={{ scrollMarginTop: '130px', marginBottom: '32px' }}
            >
              {/* Category Section Header */}
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    width: '4px',
                    height: '18px',
                    background: 'linear-gradient(to bottom, #f97316, #ea6c0a)',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                />
                {group.name}
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                  ({group.items.length})
                </span>
              </h2>

              {/* Grid 4. Cards Menu */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                {group.items.map((item) => {
                  const tags = getItemTags(item)
                  return (
                    <div
                      key={item.id}
                      onClick={() => openDetail(item)}
                      style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'row',
                        height: '115px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        position: 'relative',
                        opacity: item.is_available ? 1 : 0.65,
                      }}
                      className="menu-item-card"
                    >
                      {/* Image container 16:9 like crop */}
                      <div
                        style={{
                          width: '115px',
                          height: '100%',
                          position: 'relative',
                          overflow: 'hidden',
                          background: '#f8fafc',
                          flexShrink: 0,
                        }}
                      >
                        {(() => {
                          const parsedImage = parseMenuImage(item.image_url)
                          return parsedImage ? (
                            <img
                              src={parsedImage.medium}
                              alt={item.name}
                              loading="lazy"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff7ed',
                              }}
                            >
                              <Utensils size={24} color="#fcd34d" />
                            </div>
                          )
                        })()}

                        {/* Sold out overlay */}
                        {!item.is_available && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(15, 23, 42, 0.55)',
                              backdropFilter: 'blur(2px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10,
                            }}
                          >
                            <span
                              style={{
                                color: '#ffffff',
                                fontSize: '11px',
                                fontWeight: 800,
                                background: '#ef4444',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                              }}
                            >
                              Habis
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content block */}
                      <div
                        style={{
                          flex: 1,
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minWidth: 0,
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: '14px',
                              fontWeight: 800,
                              color: '#1e293b',
                              marginBottom: '3px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.name}
                          </h3>
                          {item.description && (
                            <p
                              style={{
                                fontSize: '11px',
                                color: '#64748b',
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Price & tags at bottom */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '4px',
                          }}
                        >
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#f97316' }}>
                            {formatRupiah(item.price)}
                          </span>

                          {/* Quick Tag Display (first tag only on list card to keep it clean) */}
                          {tags.length > 0 && (
                            <span
                              style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                background: tags[0].color,
                                color: tags[0].text,
                                padding: '2px 6px',
                                borderRadius: '6px',
                              }}
                            >
                              {tags[0].label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Tap Foto → Modal Detail */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: modalOpen ? 'rgba(15, 23, 42, 0.65)' : 'rgba(15, 23, 42, 0)',
            backdropFilter: modalOpen ? 'blur(8px)' : 'blur(0px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
          }}
          onClick={closeDetail}
        >
          {/* Modal content body */}
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#ffffff',
              borderRadius: '24px 24px 0 0',
              overflow: 'hidden',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
              transform: modalOpen ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Top Close Button (floating) */}
            <button
              onClick={closeDetail}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.5)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 100,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <X size={18} color="#ffffff" />
            </button>

            {/* Modal Image Header */}
            <div style={{ width: '100%', height: '240px', position: 'relative', background: '#f8fafc', flexShrink: 0 }}>
              {(() => {
                const parsedImage = parseMenuImage(selectedItem.image_url)
                return parsedImage ? (
                  <img
                    src={parsedImage.large}
                    alt={selectedItem.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff7ed',
                    }}
                  >
                    <Utensils size={48} color="#fcd34d" />
                  </div>
                )
              })()}

              {/* Status Badge */}
              {!selectedItem.is_available && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 800,
                      background: '#ef4444',
                      padding: '4px 16px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Habis
                  </span>
                </div>
              )}
            </div>

            {/* Modal Details Section (Scrollable if description is very long) */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Tag chips */}
              {getItemTags(selectedItem).length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {getItemTags(selectedItem).map((t) => (
                    <span
                      key={t.label}
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        background: t.color,
                        color: t.text,
                        padding: '4px 10px',
                        borderRadius: '8px',
                      }}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              )}

              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.3,
                  marginBottom: '8px',
                }}
              >
                {selectedItem.name}
              </h2>

              <div style={{ fontSize: '22px', fontWeight: 900, color: '#f97316', marginBottom: '16px' }}>
                {formatRupiah(selectedItem.price)}
              </div>

              <div style={{ width: '100%', height: '1.5px', background: '#f1f5f9', marginBottom: '16px' }} />

              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                Deskripsi Menu
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {selectedItem.description || 'Tidak ada deskripsi tertulis untuk menu ini.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Footer Micro (Powered by MenuQR) */}
      <footer style={{ marginTop: '48px', textAlign: 'center', padding: '16px' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
          Menu digital oleh{' '}
          <a
            href="/"
            style={{
              color: '#f97316',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ea6c0a')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#f97316')}
          >
            MenuQR
          </a>
        </p>
      </footer>
    </div>
  )
}
