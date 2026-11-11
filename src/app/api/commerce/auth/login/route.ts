import { NextResponse } from 'next/server';

const MEDUSA = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9050';
const PK = process.env.MEDUSA_PUBLISHABLE_KEY || 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const res = await fetch(`${MEDUSA}/auth/customer/emailpass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json(data, { status: res.status });
  const token = typeof data === 'string' ? data : data.token;
  return NextResponse.json({ token, verification_required: data?.verification_required });
}
