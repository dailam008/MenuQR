import Link from 'next/link'
import { QrCode, Utensils, BarChart3, Smartphone, CheckCircle2, ArrowRight, Zap, Shield, Globe, Star } from 'lucide-react'
import type { Metadata } from 'next'
import { HeroCounter } from './components/HeroCounter'
import { FAQAccordion } from './components/FAQAccordion'
import { faqJsonLd } from '@/lib/faq-data'

export const metadata: Metadata = {
  title: 'MenuQR — Menu Digital QR Code untuk Warung & Restoran Indonesia',
  description:
    'Buat menu digital profesional dengan QR code untuk warung & restoran UMKM Indonesia. Gratis 1 outlet selamanya. Setup hanya 5 menit, tanpa install aplikasi.',
  openGraph: {
    title: 'MenuQR — Menu Digital QR Code untuk Warung & Restoran',
    description: 'Buat menu digital dengan QR code dalam 5 menit. Gratis untuk 1 outlet. Pelanggan scan, langsung lihat menu.',
  },
}

const features = [
  { icon: QrCode,      title: 'QR Code Unik',       description: 'Setiap outlet mendapatkan QR code eksklusif. Pelanggan scan, langsung lihat menu.',                   color: '#f97316', bg: '#fff7ed' },
  { icon: Utensils,    title: 'Kelola Menu Mudah',   description: 'Tambah, edit, hapus item menu kapan saja. Lengkap dengan foto, harga, dan kategori.',                 color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: Smartphone,  title: 'Mobile-First',        description: 'Halaman menu dioptimasi untuk smartphone. Tampil cantik di layar kecil maupun besar.',                color: '#06b6d4', bg: '#ecfeff' },
  { icon: BarChart3,   title: 'Dashboard Sederhana', description: 'Pantau jumlah menu aktif dan status outlet dari satu dashboard yang bersih.',                         color: '#16a34a', bg: '#f0fdf4' },
  { icon: Zap,         title: 'Setup 5 Menit',       description: 'Daftar, buat outlet, upload menu, dan QR code siap disebar. Semudah itu.',                           color: '#eab308', bg: '#fefce8' },
  { icon: Shield,      title: 'Aman & Terpercaya',   description: 'Data menu Anda aman dengan enkripsi penuh dan sistem autentikasi modern.',                           color: '#ef4444', bg: '#fef2f2' },
]

const steps = [
  { num: '01', title: 'Daftar Gratis',  desc: 'Buat akun dalam 30 detik dengan email Anda.' },
  { num: '02', title: 'Buat Outlet',    desc: 'Isi nama warung, alamat, dan upload logo.' },
  { num: '03', title: 'Upload Menu',    desc: 'Tambahkan item menu lengkap dengan foto & harga.' },
  { num: '04', title: 'Sebar QR Code', desc: 'Download QR code dan tempel di meja pelanggan.' },
]

const testimonials = [
  {
    name: 'Ibu Sari Dewi',
    outlet: 'RM Padang Sari',
    city: 'Padang, Sumbar',
    initials: 'SD',
    color: '#f97316',
    stars: 5,
    text: 'Pelanggan saya langsung senang bisa lihat menu lengkap dari HP. Sekarang nggak perlu cetak menu plastik lagi, hemat banget! Setup-nya mudah, nggak sampai 10 menit.',
  },
  {
    name: 'Mas Andi Prasetyo',
    outlet: 'Mie Ayam Bakso Andi',
    city: 'Solo, Jawa Tengah',
    initials: 'AP',
    color: '#8b5cf6',
    stars: 5,
    text: 'Awalnya ragu karena nggak ngerti teknologi. Tapi ternyata gampang banget! Sekarang saya bisa update harga menu sendiri kapan aja, nggak perlu nunggu siapa-siapa.',
  },
  {
    name: 'Kak Rizky Fauzan',
    outlet: 'Kopi Kekinian RF',
    city: 'Bandung, Jawa Barat',
    initials: 'RF',
    color: '#06b6d4',
    stars: 5,
    text: 'Sebagai kedai kopi kekinian, image itu penting banget. MenuQR bikin menu kita keliatan lebih profesional. Pelanggan sering foto QR code kita buat di-share ke story!',
  },
]

const trustBadges = [
  { icon: '🛡️', text: 'Gratis 1 Outlet Selamanya' },
  { icon: '⚡', text: 'Setup 5 Menit' },
  { icon: '💳', text: 'Tanpa Kartu Kredit' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>

      {/* ─── JSON-LD FAQ Schema ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* ─── Navbar ─── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f3f4f6',
      }}>
        <div className="page-container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #f97316, #ea6c0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <QrCode size={18} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              Menu<span style={{ color: '#f97316' }}>QR</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: 13 }}>Masuk</Link>
            <Link href="/register" className="btn btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: 13 }}>
              Daftar<span className="hidden sm:inline"> Gratis</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section style={{
        background: 'linear-gradient(160deg, #fff7ed 0%, #fffbf7 40%, #ffffff 100%)',
        padding: '50px 0 60px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Decorative blobs */}
        <div className="hidden sm:block" style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="hidden sm:block" style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="page-container" style={{ textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div className="animate-fade-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#fff7ed', border: '1px solid #fed7aa',
            borderRadius: 999, padding: '5px 12px',
            fontSize: 12, fontWeight: 600, color: '#ea6c0a',
            marginBottom: 20,
          }}>
            <Zap size={12} />
            Gratis selamanya untuk 1 outlet
          </div>

          {/* Heading with stagger animation */}
          <h1 className="animate-fade-in" style={{
            fontSize: 'clamp(28px, 6vw, 56px)',
            fontWeight: 800,
            color: '#111827',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: 16,
            maxWidth: 720,
            margin: '0 auto 16px',
            animationDelay: '0.1s',
          }}>
            Menu Digital Modern<br />
            <span style={{
              background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              untuk Warung Anda
            </span>
          </h1>

          <p className="animate-fade-in px-2" style={{
            fontSize: 'clamp(14px, 4vw, 17px)', color: '#6b7280', maxWidth: 540,
            margin: '0 auto 32px', lineHeight: 1.6,
            animationDelay: '0.2s',
          }}>
            Buat QR code menu digital dalam 5 menit. Pelanggan scan, langsung lihat menu cantik di HP mereka — tanpa install app apapun.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in flex flex-col sm:flex-row gap-3 justify-center px-4" style={{ animationDelay: '0.3s', maxWidth: 420, margin: '0 auto' }}>
            <Link href="/register" id="cta-hero-register" className="btn btn-primary btn-lg w-full sm:w-auto" style={{ justifyContent: 'center' }}>
              Mulai Gratis Sekarang
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg w-full sm:w-auto" style={{ justifyContent: 'center' }}>
              Masuk ke Dashboard
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="animate-fade-in flex flex-wrap gap-x-6 gap-y-2 justify-center mt-6" style={{ animationDelay: '0.4s' }}>
            {trustBadges.map(badge => (
              <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                <span>{badge.icon}</span>
                <span style={{ fontWeight: 500 }}>{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Hero Mockup with floating animation (Hidden on mobile) */}
          <div className="hero-float animate-fade-in hidden md:block" style={{
            marginTop: 60,
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #e5e7eb',
            boxShadow: '0 24px 72px rgba(0,0,0,0.10), 0 4px 16px rgba(249,115,22,0.08)',
            overflow: 'hidden',
            maxWidth: 900,
            margin: '60px auto 0',
            animationDelay: '0.5s',
          }}>
            {/* Browser chrome */}
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f87171' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4ade80' }} />
              <div style={{ flex: 1, marginLeft: 12, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#9ca3af', textAlign: 'left' }}>
                menuqr.vercel.app/dashboard
              </div>
            </div>
            <div style={{ padding: 24, display: 'flex', gap: 24, minHeight: 300 }}>
              {/* Sidebar mock */}
              <div style={{ width: 160, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #f97316, #ea6c0a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={14} color="white" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>MenuQR</span>
                </div>
                {['Dashboard', 'Menu Saya', 'Kategori', 'QR Code', 'Pengaturan'].map((item, i) => (
                  <div key={item} style={{
                    padding: '7px 10px', borderRadius: 8, marginBottom: 2,
                    background: i === 1 ? '#fff7ed' : 'transparent',
                    color: i === 1 ? '#ea6c0a' : '#6b7280',
                    fontSize: 13, fontWeight: i === 1 ? 600 : 400,
                  }}>{item}</div>
                ))}
              </div>
              {/* Content mock */}
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignContent: 'start' }}>
                {[
                  { label: 'Total Menu', val: '24', color: '#f97316', bg: '#fff7ed' },
                  { label: 'Tersedia', val: '20', color: '#16a34a', bg: '#f0fdf4' },
                  { label: 'Kategori', val: '5', color: '#8b5cf6', bg: '#f5f3ff' },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: 14, border: `1px solid ${s.color}22` }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
                {['Nasi Goreng Spesial', 'Mie Ayam Bakso', 'Es Teh Manis', 'Jus Alpukat'].map(name => (
                  <div key={name} style={{ background: '#f9fafb', borderRadius: 10, padding: 10, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #fed7aa, #fb923c)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{name}</div>
                      <div style={{ fontSize: 10, color: '#f97316', fontWeight: 700 }}>Rp 15.000</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof Counter ─── */}
      <section style={{ padding: '32px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
        <div className="page-container">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-center items-center">
            {[
              { value: 500, suffix: '+', label: 'Warung Aktif' },
              { value: 12000, suffix: '+', label: 'Item Menu' },
              { value: 98, suffix: '%', label: 'Puas' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#f97316', lineHeight: 1 }}>
                  <HeroCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Warung Bu Ijah', 'RM Padang Jaya', 'Café Kita', 'Bakso Malang', 'Kedai Kopi'].map(name => (
                <span key={name} style={{ fontSize: 13, fontWeight: 700, color: '#d1d5db' }}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
              Semua yang kamu butuhkan
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
              Dari daftar sampai QR code siap cetak, semuanya ada dalam satu platform.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }} className="stagger">
            {features.map(f => (
              <div key={f.title} className="card card-hover animate-fade-in" style={{ padding: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#fff7ed', border: '1px solid #fed7aa',
              borderRadius: 999, padding: '5px 14px',
              fontSize: 13, fontWeight: 600, color: '#ea6c0a', marginBottom: 14,
            }}>
              <Star size={13} fill="#f97316" />
              4.9/5 rata-rata rating
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
              Dipercaya Pemilik Warung<br />di Seluruh Indonesia
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280' }}>
              Lebih dari 500 UMKM sudah digitalkan menu mereka dengan MenuQR.
            </p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} color="#f97316" fill="#f97316" />
                  ))}
                </div>

                {/* Text */}
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, flex: 1 }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}bb)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 800, color: '#ffffff', flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.outlet} · {t.city}</div>
                  </div>
                  <div style={{
                    marginLeft: 'auto', flexShrink: 0,
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: 999, padding: '2px 10px',
                    fontSize: 11, fontWeight: 600, color: '#16a34a',
                  }}>
                    ✓ Verified
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ padding: '80px 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
              Mulai dalam 4 langkah
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280' }}>Tidak perlu skill teknis. Siapa pun bisa pakai.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: i === 0 ? 'linear-gradient(135deg, #f97316, #ea6c0a)' : '#ffffff',
                  border: i === 0 ? 'none' : '2px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: i === 0 ? '0 4px 16px rgba(249,115,22,0.35)' : 'none',
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: i === 0 ? 'white' : '#f97316' }}>{step.num}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="page-container" style={{ maxWidth: 640 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', marginBottom: 12 }}>Harga Transparan</h2>
            <p style={{ fontSize: 16, color: '#6b7280' }}>Mulai gratis, upgrade kapan mau.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { name: 'Gratis', price: 'Rp 0', period: '/bulan', highlight: false, features: ['1 outlet', 'Hingga 50 item menu', 'QR Code basic', 'Halaman menu publik'] },
              { name: 'Pro', price: 'Rp 49.000', period: '/bulan', highlight: true, features: ['Hingga 5 outlet', 'Unlimited menu item', 'QR Code premium kustom', 'Custom domain', 'Analitik menu', 'Prioritas support'] },
            ].map(plan => (
              <div key={plan.name} className="card" style={{ padding: 28, border: plan.highlight ? '2px solid #f97316' : '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: 16, right: -24, background: '#f97316', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 32px', transform: 'rotate(45deg)' }}>POPULER</div>
                )}
                <div style={{ fontSize: 15, fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: '#111827' }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: '#9ca3af' }}>{plan.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} color="#16a34a" />
                      <span style={{ fontSize: 14, color: '#374151' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register" id={`cta-pricing-${plan.name.toLowerCase()}`} className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                  {plan.highlight ? 'Mulai Pro' : 'Mulai Gratis'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ padding: '80px 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280' }}>
              Belum yakin? Temukan jawaban Anda di sini.
            </p>
          </div>
          <FAQAccordion />
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <p style={{ fontSize: 14, color: '#9ca3af' }}>
              Masih ada pertanyaan lain?{' '}
              <a href="mailto:hello@menuqr.id" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
                Hubungi kami →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #ea6c0a 0%, #f97316 50%, #fb923c 100%)' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <Globe size={40} color="rgba(255,255,255,0.7)" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', marginBottom: 16 }}>
            Siap digitalkan warung Anda?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 36 }}>
            Bergabung dengan ribuan UMKM yang sudah pakai MenuQR.
          </p>
          <Link href="/register" id="cta-bottom-register" className="btn btn-lg" style={{ background: '#ffffff', color: '#ea6c0a', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            Daftar Gratis Sekarang
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── Minimalist Elegant Footer ─── */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #eaeaea', color: '#666666' }}>
        <div className="page-container" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>
            
            {/* Brand Column */}
            <div className="footer-brand-column">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <QrCode size={20} color="#171717" />
                <span style={{ fontSize: 18, fontWeight: 700, color: '#171717', letterSpacing: '-0.02em' }}>
                  MenuQR
                </span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, maxWidth: '280px', color: '#666666' }}>
                Standard baru untuk menu digital warung dan restoran. Cepat, bersih, dan elegan.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h4 style={{ color: '#171717', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>Produk</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="#pricing" className="footer-link-elegant">Harga</Link>
                <Link href="#features" className="footer-link-elegant">Fitur</Link>
                <Link href="/register" className="footer-link-elegant">Coba Gratis</Link>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#171717', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>Dukungan</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="mailto:hello@menuqr.id" className="footer-link-elegant">Hubungi Kami</a>
                <Link href="/#faq" className="footer-link-elegant">Pusat Bantuan</Link>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#171717', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/privacy" className="footer-link-elegant">Privasi</Link>
                <Link href="/terms" className="footer-link-elegant">Syarat & Ketentuan</Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: '#888888' }}>
              © {new Date().getFullYear()} MenuQR Inc. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" className="social-link-elegant" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="social-link-elegant" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
