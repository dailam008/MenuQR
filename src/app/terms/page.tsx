import Link from 'next/link'
import { QrCode, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Syarat & Ketentuan | MenuQR',
}

export default function TermsPage() {
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
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#171717', marginBottom: 24 }}>Syarat & Ketentuan</h1>
        <p style={{ fontSize: 15, color: '#666', marginBottom: 32 }}>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 15, lineHeight: 1.7, color: '#444' }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 12 }}>1. Penerimaan Syarat</h2>
            <p>Dengan mengakses dan menggunakan layanan MenuQR, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 12 }}>2. Penggunaan Layanan</h2>
            <p>MenuQR menyediakan platform untuk membuat dan mengelola menu digital berbasis QR code. Anda bertanggung jawab penuh atas keakuratan informasi, harga, dan foto menu yang Anda unggah ke platform kami.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 12 }}>3. Hak Kekayaan Intelektual</h2>
            <p>Anda tetap memiliki hak cipta atas foto dan konten menu Anda. Namun, dengan mengunggahnya ke MenuQR, Anda memberikan lisensi kepada kami untuk menampilkan konten tersebut kepada pelanggan Anda secara online.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 12 }}>4. Pembatasan Tanggung Jawab</h2>
            <p>MenuQR tidak bertanggung jawab atas kerugian finansial yang diakibatkan oleh kesalahan ketik harga pada menu Anda, kegagalan koneksi internet pelanggan, atau transaksi yang terjadi di luar platform kami.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
