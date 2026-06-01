/** Shared FAQ data — used by both FAQAccordion (client) and page.tsx (server) */
export const faqData = [
  {
    q: 'Apakah pelanggan perlu install aplikasi?',
    a: 'Tidak perlu sama sekali. Pelanggan cukup scan QR code menggunakan kamera HP biasa, lalu menu langsung terbuka di browser. Tidak ada aplikasi yang perlu didownload.',
  },
  {
    q: 'Bagaimana cara update harga menu?',
    a: 'Masuk ke dashboard MenuQR, klik menu yang ingin diubah, edit harga, lalu simpan. Perubahan langsung aktif secara real-time — pelanggan yang scan QR setelahnya langsung melihat harga baru.',
  },
  {
    q: 'Apakah bisa dipakai di lebih dari satu warung?',
    a: 'Untuk paket gratis, tersedia 1 outlet per akun. Jika Anda memiliki beberapa cabang atau warung, Anda bisa mendaftar dengan email berbeda untuk masing-masing outlet.',
  },
  {
    q: 'Apakah QR code bisa dicetak sendiri?',
    a: 'Ya! QR code bisa didownload dalam format PNG langsung dari dashboard. Anda bisa cetak sendiri di warung terdekat atau print di rumah untuk ditempel di meja pelanggan.',
  },
  {
    q: 'Bagaimana jika internet mati di warung?',
    a: 'MenuQR membutuhkan internet di sisi pelanggan untuk membuka menu (karena menu diakses via browser). Namun Anda bisa tetap mengelola menu di dashboard kapan saja ada koneksi.',
  },
  {
    q: 'Apakah data menu saya aman?',
    a: 'Sangat aman. MenuQR menggunakan enkripsi SSL/TLS, autentikasi aman via Supabase, dan Row Level Security sehingga hanya Anda yang bisa mengakses dan mengubah data outlet Anda.',
  },
]

/** JSON-LD schema for Google FAQ rich snippets */
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}
