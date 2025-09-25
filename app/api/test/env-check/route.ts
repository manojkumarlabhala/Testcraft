import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const keys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'TEST_STUDENT_ELITE_EMAIL',
    'TEST_STUDENT_ELITE_PASSWORD',
  ];

  const present: Record<string, boolean> = {};
  for (const k of keys) present[k] = Boolean(process.env[k]);

  return NextResponse.json({ present });
}
