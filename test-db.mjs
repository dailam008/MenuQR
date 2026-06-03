import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // bypass RLS
)

async function checkData() {
  const { data: outlets } = await supabase.from('outlets').select('id, name')
  console.log('Outlets:', outlets)

  if (outlets && outlets.length > 0) {
    const outletId = outlets[0].id
    const { data: views } = await supabase.from('menu_views').select('*').eq('outlet_id', outletId)
    console.log('Views for outlet 0:', views)
  }
}

checkData()
