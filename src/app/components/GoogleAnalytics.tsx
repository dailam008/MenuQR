'use client'

import Script from 'next/script'

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  if (!gaId) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}

/** Track CTA clicks & custom events */
export function trackEvent(action: string, category: string, label?: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
    })
  }
}
