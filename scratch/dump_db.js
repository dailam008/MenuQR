const { createClient } = require('@supabase/supabase-js');

const url = 'https://vdtwehjkkkpytcpfmige.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdHdlaGpra2tweXRjcGZtaWdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI5OTA3OCwiZXhwIjoyMDk1ODc1MDc4fQ.yjByec1Wfjbi3uCBfI67khBq847VAodr61vGUwVrC0k';

const supabase = createClient(url, key);

async function run() {
  const { data: outlets, error } = await supabase.from('outlets').select('*');
  if (error) {
    console.error('Error fetching outlets:', error);
    return;
  }
  console.log('Outlets currently in DB:', JSON.stringify(outlets, null, 2));

  const { data: users, error: userErr } = await supabase.auth.admin.listUsers();
  if (userErr) {
    console.error('Error fetching users:', userErr);
  } else {
    console.log('Users in Auth:', JSON.stringify(users.users.map(u => ({ id: u.id, email: u.email, metadata: u.user_metadata })), null, 2));
  }
}

run();
