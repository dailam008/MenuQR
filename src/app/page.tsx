import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QrCode, Utensils, BarChart3, Smartphone, CheckCircle2, ArrowRight, Shield, RefreshCw, Layers, SlidersHorizontal, Eye } from 'lucide-react'
import type { Metadata } from 'next'
import { FAQAccordion } from './components/FAQAccordion'
import { faqJsonLd } from '@/lib/faq-data'

export const metadata: Metadata = {
  title: 'MenuQR — Sistem Katalog Menu Digital Berbasis QR Code',
  description:
    'Aplikasi manajemen katalog menu makanan dan minuman berbasis QR Code untuk mempermudah operasional usaha kuliner dan restoran.',
  openGraph: {
    title: 'MenuQR — Sistem Katalog Menu Digital Berbasis QR Code',
    description: 'Kelola menu digital restoran dan cetak QR Code meja dengan mudah.',
  },
}

const features = [
  {
    icon: QrCode,
    title: 'QR Code Dinamis Tiap Outlet',
    description: 'Setiap outlet memiliki tautan dan QR Code tersendiri yang dapat langsung dicetak untuk ditempatkan pada meja pelanggan.'
  },
  {
    icon: Utensils,
    title: 'Manajemen Menu & Kategori',
    description: 'Pengelola dapat menambah, mengubah harga, memperbarui foto, serta mengelompokkan menu berdasarkan kategori secara fleksibel.'
  },
  {
    icon: Smartphone,
    title: 'Antarmuka Responsif (Mobile-First)',
    description: 'Halaman katalog publik dioptimalkan untuk berbagai ukuran layar smartphone pengunjung tanpa perlu mengunduh aplikasi tambahan.'
  },
  {
    icon: RefreshCw,
    title: 'Status Ketersediaan Real-Time',
    description: 'Tandai menu yang sedang habis atau tersedia seketika agar pelanggan mendapatkan informasi yang selalu akurat.'
  },
  {
    icon: BarChart3,
    title: 'Pencatatan Riwayat Kunjungan',
    description: 'Sistem mencatat statistik pemindaian QR Code dan halaman menu yang paling sering dibuka oleh pelanggan.'
  },
  {
    icon: Shield,
    title: 'Keamanan Data Berbasis Cloud',
    description: 'Didukung basis data PostgreSQL dan Row Level Security untuk memastikan data setiap pengelola terisolasi dengan aman.'
  }
]

const steps = [
  {
    num: '01',
    title: 'Pendaftaran Akun',
    desc: 'Daftarkan akun pengelola menggunakan alamat email aktif untuk mengakses dashboard sistem.'
  },
  {
    num: '02',
    title: 'Konfigurasi Outlet',
    desc: 'Lengkapi profil outlet mencakup nama restoran, deskripsi singkat, alamat, dan logo.'
  },
  {
    num: '03',
    title: 'Kelola Data Menu',
    desc: 'Masukkan daftar makanan dan minuman lengkap dengan harga, foto, kategori, dan status stok.'
  },
  {
    num: '04',
    title: 'Cetak & Pasang QR Code',
    desc: 'Unduh file QR Code dengan template yang tersedia, lalu cetak untuk dipasang pada meja makan.'
  }
]

const systemValues = [
  {
    icon: Layers,
    title: 'Efisiensi Operasional',
    desc: 'Mengurangi ketergantungan pada buku menu fisik konvensional serta meniadakan biaya cetak ulang setiap kali ada perubahan harga.'
  },
  {
    icon: Eye,
    title: 'Akses Informasi Cepat',
    desc: 'Pengunjung cukup mengarahkan kamera ponsel ke QR Code meja untuk membuka daftar menu lengkap beserta foto dan deskripsi.'
  },
  {
    icon: SlidersHorizontal,
    title: 'Kemudahan Pengelolaan',
    desc: 'Seluruh operasional menu, dari penambahan item hingga pemantauan statistik kunjungan, dikendalikan dalam satu dashboard terpadu.'
  }
]

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b' }}>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* ─── Navbar ─── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div className="page-container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={18} color="#ffffff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Menu<span style={{ color: '#f97316' }}>QR</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="#features" className="hidden sm:inline" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500, marginRight: 8 }}>
              Fitur
            </Link>
            <Link href="#pricing" className="hidden sm:inline" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500, marginRight: 16 }}>
              Paket
            </Link>
            {user ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm" style={{ fontSize: 13.5, padding: '8px 16px' }}>
                Buka Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary btn-sm" style={{ fontSize: 13.5, padding: '7px 14px' }}>
                  Masuk
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm" style={{ fontSize: 13.5, padding: '7px 16px' }}>
                  Daftar Akun
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section style={{
        background: 'linear-gradient(180deg, #fafaf9 0%, #ffffff 100%)',
        padding: '64px 0 48px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          
          <h1 style={{
            fontSize: 'clamp(30px, 5.5vw, 50px)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.25,
            letterSpacing: '-0.025em',
            maxWidth: 780,
            margin: '0 auto 18px',
          }}>
            Sistem Katalog Menu Digital Berbasis QR Code
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2.5vw, 17px)',
            color: '#475569',
            maxWidth: 620,
            margin: '0 auto 32px',
            lineHeight: 1.65,
          }}>
            Aplikasi manajemen menu restoran untuk memperbarui daftar makanan, harga, dan ketersediaan stok secara terpusat. Pengunjung memindai QR Code untuk membuka menu tanpa instalasi aplikasi.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {user ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg" style={{ padding: '12px 28px' }}>
                Menuju Dashboard Pengelola
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link href="/register" id="cta-hero-register" className="btn btn-primary btn-lg" style={{ padding: '12px 26px' }}>
                  Daftar Akun Pengelola
                  <ArrowRight size={18} />
                </Link>
                <Link href="#features" className="btn btn-secondary btn-lg" style={{ padding: '12px 24px' }}>
                  Pelajari Fitur
                </Link>
              </>
            )}
          </div>

          {/* ─── Realistic UI Preview ─── */}
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #cbd5e1',
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)',
            overflow: 'hidden',
            maxWidth: 960,
            margin: '0 auto',
            textAlign: 'left'
          }}>
            {/* Window titlebar */}
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#cbd5e1' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#cbd5e1' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#cbd5e1' }} />
              <div style={{ flex: 1, marginLeft: 12, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#64748b' }}>
                menuqr.app/dashboard/menu
              </div>
            </div>

            {/* Application Mock View */}
            <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr 210px', minHeight: 320, background: '#ffffff' }}>
              
              {/* Sidebar */}
              <div style={{ borderRight: '1px solid #f1f5f9', padding: '16px 12px', background: '#fafaf9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16, paddingLeft: 8 }}>
                  Panel Pengelola
                </div>
                {[
                  { label: 'Ringkasan', active: false },
                  { label: 'Daftar Menu', active: true },
                  { label: 'Kategori', active: false },
                  { label: 'Cetak QR Code', active: false },
                  { label: 'Pengaturan Outlet', active: false },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: '8px 10px', borderRadius: 6, marginBottom: 4,
                    background: item.active ? '#fff7ed' : 'transparent',
                    color: item.active ? '#ea6c0a' : '#64748b',
                    fontSize: 13, fontWeight: item.active ? 700 : 500,
                  }}>{item.label}</div>
                ))}
              </div>

              {/* Main Content */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Katalog Menu</h2>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Outlet: Restoran Kopi &amp; Kuliner</p>
                  </div>
                  <span style={{ fontSize: 12, background: '#f97316', color: '#ffffff', padding: '5px 12px', borderRadius: 6, fontWeight: 600 }}>
                    + Tambah Menu
                  </span>
                </div>

                {/* Filter category bar */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  <span style={{ fontSize: 11.5, background: '#0f172a', color: '#ffffff', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>Semua (16)</span>
                  <span style={{ fontSize: 11.5, background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 6 }}>Makanan Utama</span>
                  <span style={{ fontSize: 11.5, background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 6 }}>Minuman</span>
                  <span style={{ fontSize: 11.5, background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 6 }}>Snack</span>
                </div>

                {/* Menu items list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { name: 'Nasi Ayam Bakar Madu', cat: 'Makanan Utama', price: 'Rp 28.000', status: 'Tersedia', statusBg: '#f0fdf4', statusColor: '#16a34a' },
                    { name: 'Kopi Susu Gula Aren', cat: 'Minuman', price: 'Rp 18.000', status: 'Tersedia', statusBg: '#f0fdf4', statusColor: '#16a34a' },
                    { name: 'Roti Bakar Cokelat Keju', cat: 'Snack', price: 'Rp 16.000', status: 'Tersedia', statusBg: '#f0fdf4', statusColor: '#16a34a' },
                    { name: 'Jus Mangga Harum Manis', cat: 'Minuman', price: 'Rp 15.000', status: 'Habis', statusBg: '#fef2f2', statusColor: '#ef4444' },
                  ].map(m => (
                    <div key={m.name} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{m.cat}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>{m.price}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, background: m.statusBg, color: m.statusColor, padding: '2px 8px', borderRadius: 4 }}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Preview Column */}
              <div style={{ borderLeft: '1px solid #f1f5f9', padding: '16px', background: '#fafaf9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 12 }}>QR Code Meja</span>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: 10, padding: '12px', background: '#ffffff', marginBottom: 10 }}>
                  <div style={{ width: 100, height: 100, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={84} color="#0f172a" />
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Meja Nomor 01</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>Pindai untuk membuka menu</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" style={{ padding: '72px 0', background: '#ffffff' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
              Fitur Utama Sistem
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 520, margin: '0 auto' }}>
              Modul fungsional yang dirancang untuk mendukung efisiensi pengelolaan menu restoran.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ padding: 24, border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#ea6c0a' }}>
                  <f.icon size={22} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Keunggulan Section ─── */}
      <section style={{ padding: '72px 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
              Manfaat Penerapan Sistem
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 540, margin: '0 auto' }}>
              Keuntungan penggunaan katalog digital berbasis web dibandingkan metode konvensional.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {systemValues.map(v => (
              <div key={v.title} className="card" style={{ padding: 26, background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', marginBottom: 14 }}>
                  <v.icon size={20} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Workflow Steps ─── */}
      <section style={{ padding: '72px 0', background: '#ffffff' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
              Alur Kerja Penggunaan
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              Tahapan implementasi sistem dari pendaftaran hingga pemindaian menu oleh pelanggan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((step) => (
              <div key={step.num} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px 20px', textAlign: 'left' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f97316', marginBottom: 10 }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section id="pricing" style={{ padding: '72px 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="page-container" style={{ maxWidth: 680 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Skema Layanan</h2>
            <p style={{ fontSize: 15, color: '#64748b' }}>Pilihan paket penggunaan sistem sesuai kebutuhan skala outlet.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                name: 'Paket Standar',
                price: 'Rp 0',
                period: '/ gratis',
                highlight: false,
                features: [
                  '1 outlet aktif',
                  'Maksimal 50 item menu',
                  'Template QR Code standar',
                  'Katalog publik responsif'
                ]
              },
              {
                name: 'Paket Pro',
                price: 'Rp 18.000',
                period: '/ bulan',
                highlight: true,
                features: [
                  'Hingga 5 outlet cabang aktif',
                  'Jumlah item menu tanpa batas',
                  'Semua template QR Code (Minimalis, Colorful, Classic)',
                  'Dashboard analitik kunjungan menu',
                  'Prioritas dukungan teknis admin'
                ]
              },
            ].map(plan => (
              <div key={plan.name} className="card" style={{ padding: 28, border: plan.highlight ? '2px solid #f97316' : '1px solid #e2e8f0', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: plan.highlight ? '#ea6c0a' : '#64748b', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{plan.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, flex: 1 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                  {plan.highlight ? 'Pilih Paket Pro' : 'Daftar Gratis'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ padding: '72px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
              Pertanyaan Umum
            </h2>
            <p style={{ fontSize: 15, color: '#64748b' }}>
              Informasi mengenai penggunaan dan fungsionalitas MenuQR.
            </p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', color: '#64748b' }}>
        <div className="page-container" style={{ paddingTop: '56px', paddingBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>

            {/* Brand Column */}
            <div className="footer-brand-column">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={16} color="#ffffff" />
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  Menu<span style={{ color: '#f97316' }}>QR</span>
                </span>
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, maxWidth: '300px', color: '#64748b', margin: 0 }}>
                Aplikasi katalog menu digital dan manajemen outlet berbasis web QR Code untuk mempermudah operasional usaha kuliner.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>Produk</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="#pricing" className="footer-link-elegant">Harga</Link>
                <Link href="#features" className="footer-link-elegant">Fitur</Link>
                <Link href="/register" className="footer-link-elegant">Daftar Akun</Link>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>Dukungan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="mailto:hello@menuqr.id" className="footer-link-elegant">Hubungi Kami</a>
                <Link href="/#faq" className="footer-link-elegant">Pusat Bantuan (FAQ)</Link>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>Legal</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="/privacy" className="footer-link-elegant">Kebijakan Privasi</Link>
                <Link href="/terms" className="footer-link-elegant">Syarat &amp; Ketentuan</Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              &copy; {new Date().getFullYear()} MenuQR. Sistem Manajemen Menu Digital.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Versi 1.0</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
