import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdtwehjkkkpytcpfmige.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdHdlaGpra2tweXRjcGZtaWdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI5OTA3OCwiZXhwIjoyMDk1ODc1MDc4fQ.yjByec1Wfjbi3uCBfI67khBq847VAodr61vGUwVrC0k'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function check() {
  const { data, error } = await supabase.rpc('get_tables_info')
  if (error) {
    // If RPC doesn't exist, try querying a dummy table or run SQL
    console.log("Error running RPC:", error.message)
    
    // Let's try querying outlets or users
    const { data: uData, error: uError } = await supabase.from('users').select('*').limit(1)
    console.log("Query 'users' result:", { data: uData, error: uError ? uError.message : null })

    const { data: mData, error: mError } = await supabase.from('merchants').select('*').limit(1)
    console.log("Query 'merchants' result:", { data: mData, error: mError ? mError.message : null })
  } else {
    console.log("Tables info:", data)
  }
}

check()
