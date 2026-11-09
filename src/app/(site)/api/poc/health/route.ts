import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
async function probe(name: string, url: string, headers?: HeadersInit) {
  try {
    const response = await fetch(url, {headers, cache:'no-store', signal:AbortSignal.timeout(2500)});
    return { name, status: response.status, available: response.ok };
  } catch { return {name, status: null, available: false}; }
}
export async function GET() {
  const [medusa,keygen,vscore,licensingAgent] = await Promise.all([
    probe('medusa','http://127.0.0.1:9050/health'),
    probe('keygen','http://127.0.0.1:9045/v1/health', {'Host':'keygen.localhost'}),
    probe('vscore-1.1','http://127.0.0.1:4011/'),
    probe('licensing-agent','http://127.0.0.1:9053/health'),
  ]);
  return NextResponse.json({ environment:'local-poc', services:[medusa,keygen,vscore,licensingAgent] }, { headers:{'Cache-Control':'no-store'} });
}
