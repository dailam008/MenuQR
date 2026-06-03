import { sendEmail } from './email'

// Helper to format date in Indonesian format: e.g. "04 Juni 2026"
function formatDateIndo(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// 7A. Email aktivasi Pro
export async function sendActivationEmail(email: string, name: string, startDate: Date, endDate: Date) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://menu-qr-self.vercel.app'
  const startDateStr = formatDateIndo(startDate)
  const endDateStr = formatDateIndo(endDate)

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Selamat! Akun Pro MenuQR Kamu Sudah Aktif 🎉</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #f97316, #ea6c0a); padding: 36px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
          .content { padding: 32px 24px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
          .highlight-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .highlight-box h4 { margin: 0 0 8px 0; color: #c2410c; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .highlight-box p { margin: 0; font-size: 13.5px; color: #9a3412; font-weight: 600; }
          .benefit-list { margin: 24px 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
          .benefit-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: #475569; }
          .benefit-icon { color: #f97316; font-weight: bold; }
          .btn-cta { display: block; text-align: center; background: #f97316; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 32px auto 16px; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3); width: 200px; }
          .footer { border-top: 1px solid #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #fafafa; line-height: 1.5; }
          .footer a { color: #f97316; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Menu<span style="color: #ffe4e6;">QR</span></h1>
          </div>
          <div class="content">
            <div class="greeting">Halo ${name},</div>
            <p>Kabar gembira! Pembayaran Anda telah kami verifikasi, dan <strong>Akun Pro MenuQR Anda sudah aktif!</strong> 🎉</p>
            
            <div class="highlight-box">
              <h4>Masa Aktif Paket PRO</h4>
              <p>Mulai: ${startDateStr}<br/>Selesai: ${endDateStr}</p>
            </div>

            <p>Sekarang Anda bebas menggunakan seluruh fitur premium kami tanpa batas:</p>
            
            <ul class="benefit-list">
              <li class="benefit-item"><span class="benefit-icon">✓</span> Kelola hingga 5 outlet cabang aktif (Gratis cuma 1)</li>
              <li class="benefit-item"><span class="benefit-icon">✓</span> Upload menu makanan & minuman tanpa batas (Gratis maks 50)</li>
              <li class="benefit-item"><span class="benefit-icon">✓</span> Desain QR Code kustom premium (Warna & Frame stiker)</li>
              <li class="benefit-item"><span class="benefit-icon">✓</span> Grafik analitik pengunjung & performa menu detail</li>
              <li class="benefit-item"><span class="benefit-icon">✓</span> Prioritas dukungan teknis langsung dari admin</li>
            </ul>

            <a href="${appUrl}/dashboard" class="btn-cta" target="_blank">Buka Dashboard</a>
            
          </div>
          <div class="footer">
            <p>Ada pertanyaan? Silakan hubungi kami via WhatsApp di <a href="https://wa.me/6289618418569">0896-1841-8569</a> atau email admin di <a href="mailto:daimoh442@gmail.com">daimoh442@gmail.com</a>.</p>
            <p>&copy; ${new Date().getFullYear()} MenuQR. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Selamat! Akun Pro MenuQR kamu sudah aktif 🎉',
    html
  })
}

// 7B. Email reminder H-7 expired
export async function sendReminderEmail(email: string, name: string, endDate: Date, daysRemaining: number) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://menu-qr-self.vercel.app'
  const endDateStr = formatDateIndo(endDate)

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Plan Pro MenuQR Kamu Habis ${daysRemaining} Hari Lagi</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 36px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; }
          .content { padding: 32px 24px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
          .warning-box { background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .warning-box p { margin: 0; font-size: 14px; color: #b45309; font-weight: 600; }
          .btn-cta { display: block; text-align: center; background: #f97316; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 32px auto 16px; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3); width: 200px; }
          .footer { border-top: 1px solid #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #fafafa; }
          .footer a { color: #f97316; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Menu<span style="color: #fef3c7;">QR</span></h1>
          </div>
          <div class="content">
            <div class="greeting">Halo ${name},</div>
            <p>Kami ingin menginformasikan bahwa masa aktif paket Pro MenuQR Anda akan segera berakhir.</p>
            
            <div class="warning-box">
              <p>⚠️ Paket Pro Anda berakhir pada tanggal <strong>${endDateStr}</strong> (${daysRemaining === 0 ? 'hari ini' : `${daysRemaining} hari lagi`}).</p>
            </div>

            <p>Perpanjang paket Pro Anda sekarang agar tidak kehilangan akses ke fitur multi-outlet, kustom QR premium, domain kustom, serta statistik analitik menu Anda.</p>

            <a href="${appUrl}/upgrade" class="btn-cta" target="_blank">Perpanjang Sekarang</a>
            
          </div>
          <div class="footer">
            <p>Ada kendala pembayaran? Silakan hubungi kami via WhatsApp: <a href="https://wa.me/6289618418569">wa.me/6289618418569</a>.</p>
            <p>&copy; ${new Date().getFullYear()} MenuQR. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Plan Pro MenuQR kamu habis ${daysRemaining} hari lagi`,
    html
  })
}

// 7C. Email auto-downgrade notification
export async function sendDowngradeEmail(email: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://menu-qr-self.vercel.app'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Masa Aktif Plan Pro MenuQR Telah Berakhir</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0; }
          .header { background: #64748b; padding: 36px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; }
          .content { padding: 32px 24px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
          .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .info-box p { margin: 0; font-size: 13.5px; color: #475569; }
          .btn-cta { display: block; text-align: center; background: #f97316; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 32px auto 16px; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3); width: 200px; }
          .footer { border-top: 1px solid #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #fafafa; }
          .footer a { color: #f97316; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Menu<span style="color: #cbd5e1;">QR</span></h1>
          </div>
          <div class="content">
            <div class="greeting">Halo ${name},</div>
            <p>Masa aktif paket Pro MenuQR Anda telah berakhir dan akun Anda otomatis kembali ke paket <strong>Gratis</strong>.</p>
            
            <div class="info-box">
              <p>🔒 <strong>Tenang saja, data menu Anda tetap aman!</strong> Namun, akses ke fitur premium seperti analitik, custom domain, dan pengelolaan multi-outlet telah dinonaktifkan sementara.</p>
            </div>

            <p>Segera perpanjang paket Pro Anda sekarang untuk mengaktifkan kembali semua kemudahan mengelola menu digital Anda.</p>

            <a href="${appUrl}/upgrade" class="btn-cta" target="_blank">Upgrade ke Pro</a>
            
          </div>
          <div class="footer">
            <p>Hubungi admin untuk bantuan: <a href="https://wa.me/6289618418569">wa.me/6289618418569</a>.</p>
            <p>&copy; ${new Date().getFullYear()} MenuQR. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Plan Pro MenuQR kamu sudah berakhir',
    html
  })
}
