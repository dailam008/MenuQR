import nodemailer from 'nodemailer'

// SMTP Transporter configuration
const getTransporter = () => {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  // Fallback to Mailtrap or local dev logger if variables are missing
  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // True for port 465, false for other ports
    auth: { user, pass },
  })
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const transporter = getTransporter()
  const fromName = process.env.SMTP_FROM_NAME || 'MenuQR'
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'no-reply@menuqr.com'

  if (!transporter) {
    console.log('\n✉️ ======= DEV EMAIL DUMP =======')
    console.log(`To:      ${to}`)
    console.log(`From:    "${fromName}" <${fromEmail}>`)
    console.log(`Subject: ${subject}`)
    console.log('---------------------------------')
    console.log('HTML Body (Preview):')
    console.log(html.slice(0, 1000) + '\n... (truncated for console)')
    console.log('=================================\n')
    return { success: true, message: 'Printed to console' }
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send transacation email:', error)
    return { success: false, error }
  }
}

// 1. Welcome Email Template
export function getWelcomeEmailHtml(fullName: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://menuqr.vercel.app'
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Selamat datang di MenuQR!</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #f97316, #ea6c0a); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
          .content { padding: 32px 24px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
          .steps { margin: 24px 0; }
          .step-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
          .step-icon { font-size: 22px; width: 40px; height: 40px; background: #fff7ed; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .step-text h3 { margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #0f172a; }
          .step-text p { margin: 0; font-size: 13px; color: #64748b; }
          .btn-cta { display: block; text-align: center; background: #f97316; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 32px 0 16px; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3); }
          .footer { border-top: 1px solid #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #fafafa; }
          .footer a { color: #f97316; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Menu<span style="color: #ffe4e6;">QR</span></h1>
          </div>
          <div class="content">
            <div class="greeting">Selamat datang di MenuQR, ${fullName}! 👋</div>
            <p>Terima kasih telah mendaftar di MenuQR. Sekarang, Anda siap membuat menu digital interaktif dengan QR Code untuk warung atau restoran Anda secara gratis!</p>
            
            <p>Berikut adalah <strong>3 Langkah Mudah</strong> untuk memulai aktivasi menu digital Anda:</p>
            
            <div class="steps">
              <div class="step-item">
                <div class="step-icon">🏪</div>
                <div class="step-text">
                  <h3>1. Buat Outlet Anda</h3>
                  <p>Isi data warung/restoran Anda seperti nama, deskripsi, alamat, dan unggah logo jika ada di halaman Settings.</p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-icon">🍽️</div>
                <div class="step-text">
                  <h3>2. Tambahkan Daftar Menu</h3>
                  <p>Masukkan menu makanan dan minuman terbaik Anda. Sistem kami akan memproses dan mengompres foto menu Anda secara otomatis.</p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-icon">📲</div>
                <div class="step-text">
                  <h3>3. Unduh & Sebar QR Code</h3>
                  <p>Unduh QR Code berkualitas HD dari dashboard Anda, cetak, lalu letakkan di meja makan agar pelanggan bisa langsung memindainya.</p>
                </div>
              </div>
            </div>

            <a href="${appUrl}/dashboard" class="btn-cta" target="_blank">Akses Dashboard MenuQR</a>
            
            <p style="font-size: 13px; color: #64748b;">Jika Anda membutuhkan panduan lengkap atau memiliki pertanyaan, jangan ragu untuk membalas email ini.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MenuQR. Hak Cipta Dilindungi.</p>
            <p>Warung modern, omzet melejit dengan <a href="${appUrl}">MenuQR</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}

// 2. Activation Reminder Email Template
export function getReminderEmailHtml(fullName: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://menuqr.vercel.app'

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Menu digital warungmu belum aktif</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #f97316, #ea6c0a); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; }
          .content { padding: 32px 24px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
          .reminder-box { background: #fff7ed; border-left: 4px solid #f97316; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .reminder-box p { margin: 0; font-size: 14px; color: #9a3412; font-weight: 600; }
          .btn-cta { display: block; text-align: center; background: #f97316; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 32px 0 16px; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3); }
          .footer { border-top: 1px solid #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #fafafa; }
          .footer a { color: #f97316; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Menu<span style="color: #ffe4e6;">QR</span></h1>
          </div>
          <div class="content">
            <div class="greeting">Halo ${fullName}, menu digital warungmu belum aktif nih! 🏪</div>
            
            <p>Kemarin Anda telah mendaftar di MenuQR, namun sistem mendeteksi bahwa Anda **belum membuat outlet pertama** Anda.</p>
            
            <div class="reminder-box">
              <p>💡 Apakah Anda tahu? Pemilik warung makan yang menggunakan MenuQR berhasil menghemat waktu cetak menu fisik dan memproses pesanan 25% lebih cepat!</p>
            </div>
            
            <p>Yuk, selesaikan pembuatan menu digital warung Anda hari ini. Hanya butuh waktu **kurang dari 5 menit** saja untuk setup awal!</p>

            <a href="${appUrl}/dashboard" class="btn-cta" target="_blank">Ayo Selesaikan Sekarang</a>
            
            <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Jika Anda mengalami kendala saat setup, Anda bisa membalas email ini kapan saja. Tim support kami siap membantu warung Anda naik kelas.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MenuQR. Hak Cipta Dilindungi.</p>
            <p>Warung modern, omzet melejit dengan <a href="${appUrl}">MenuQR</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}
