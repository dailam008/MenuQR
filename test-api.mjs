import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://vdtwehjkkkpytcpfmige.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdHdlaGpra2tweXRjcGZtaWdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI5OTA3OCwiZXhwIjoyMDk1ODc1MDc4fQ.yjByec1Wfjbi3uCBfI67khBq847VAodr61vGUwVrC0k'
)

async function testApi() {
  const { data: outlet } = await supabase.from('outlets').select('*').limit(1).single()
  
  const today = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('id-ID', { weekday: 'short' })
    days.push({ date: iso, label })
  }

  const since = days[0].date + 'T00:00:00.000Z'
  const { data: rawViews } = await supabase
    .from('menu_views')
    .select('viewed_at')
    .eq('outlet_id', outlet.id)
    .gte('viewed_at', since)
    .is('menu_item_id', null)

  const countsByDate = {}
  for (const v of rawViews ?? []) {
    const d = v.viewed_at.slice(0, 10)
    countsByDate[d] = (countsByDate[d] || 0) + 1
  }

  const views_per_day = days.map(d => ({
    date: d.date,
    label: d.label,
    count: countsByDate[d.date] ?? 0,
  }))

  console.log("Since:", since)
  console.log("Raw Views:", rawViews)
  console.log("Counts By Date:", countsByDate)
  console.log("Views Per Day:", views_per_day)
  console.log("Has Scan Data:", views_per_day.some(d => d.count > 0))
}

testApi()
