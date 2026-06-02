import Link from 'next/link'
import { QrCode, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Kebijakan Privasi | MenuQR',
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', color: '#333' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #eaeaea', padding: '16px 0' }}>
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <QrCode size={20} color="#171717" />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#171717' }}>MenuQR</span>
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#666', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Kembali
          </Link>
        </div>
      </nav>

      <div className="page-container" style={{ maxWidth: 680, padding: '64px 20px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#171717', marginBottom: 24 }}>Kebijakan Privasi</h1>
        <p style={{ fontSize: 15, color: '#666', marginBottom: 32 }}>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 15, lineHeight: 1.7, color: '#444' }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 12 }}>1. Informasi yang Kami Kumpulkan</h2>
            <p>MenuQR mengumpulkan informasi dasar saat Anda mendaftar, seperti nama, alamat email, dan detail outlet (warung/restoran) Anda. Kami juga mencatat data analitik anonim berupa jumlah kunjungan pelanggan ke halaman menu Anda.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 12 }}>2. Penggunaan Informasi</h2>
            <p>Data yang kami kumpulkan semata-mata digunakan untuk menyediakan layanan menu digital kepada Anda, menampilkan analitik dashboard, dan memperbaiki pengalaman pengguna di platform MenuQR.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 12 }}>3. Perlindungan Data</h2>
            <p>Keamanan data Anda adalah prioritas kami. Semua kata sandi dan sesi pengguna dienkripsi secara aman menggunakan teknologi standar industri yang disediakan oleh mitra autentikasi kami (Supabase).</p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 12 }}>4. Hubungi Kami</h2>
            <p>Jika Anda memiliki pertanyaan terkait privasi data Anda, silakan hubungi kami di <strong>hello@menuqr.id</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
