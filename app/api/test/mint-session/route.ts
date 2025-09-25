import { NextResponse } from 'next/server';

// Dev-only helper: returns a Supabase session object for the test user
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.TEST_STUDENT_ELITE_EMAIL;
  const password = process.env.TEST_STUDENT_ELITE_PASSWORD;

  if (!supabaseUrl || !anonKey || !email || !password) {
    return NextResponse.json({ error: 'Missing test env variables' }, { status: 500 });
  }

  // GoTrue expects application/x-www-form-urlencoded for grant_type=password
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('email', email);
  params.append('password', password);

  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: params.toString(),
  });

  const text = await res.text();
  let body: any = text;
  try { body = JSON.parse(text); } catch (_) { /* keep raw text */ }

  console.log('[mint-session] supabase status', res.status, 'body:', body);

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to mint session', details: body }, { status: 500 });
  }

  return NextResponse.json(body);
}
