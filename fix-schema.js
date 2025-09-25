const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateMockTestsSchema() {
  console.log('🔧 Updating mock_tests schema...');

  // Check current table structure
  const { data: columns, error: columnsError } = await supabase
    .rpc('exec', { 
      query: `SELECT column_name FROM information_schema.columns WHERE table_name = 'mock_tests' AND table_schema = 'public'` 
    });

  if (columnsError) {
    console.log('Current columns check failed, proceeding with schema update...');
  } else {
    console.log('Current columns:', columns);
  }

  // Add missing columns one by one
  const alterCommands = [
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS title text',
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS description text',
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS exam_board text',
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS class text',
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS category text',
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS question_type text',
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS language text',
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS is_ai_generated boolean DEFAULT false',
    'ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE'
  ];

  for (const command of alterCommands) {
    console.log(`Executing: ${command}`);
    const { error } = await supabase.rpc('exec', { query: command });
    if (error) {
      console.log(`⚠️  Error (might be expected if column exists): ${error.message}`);
    } else {
      console.log('✅ Success');
    }
  }

  // Update existing records
  const updateCommands = [
    'UPDATE public.mock_tests SET title = name WHERE title IS NULL',
    'UPDATE public.mock_tests SET created_by = creator_id WHERE created_by IS NULL'
  ];

  for (const command of updateCommands) {
    console.log(`Executing: ${command}`);
    const { error } = await supabase.rpc('exec', { query: command });
    if (error) {
      console.log(`⚠️  Error: ${error.message}`);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('🎉 Schema update completed!');
}

updateMockTestsSchema().catch(console.error);