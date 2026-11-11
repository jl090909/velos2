export const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9050';
export const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';
export const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || 'reg_01M6ZJ0C0XBX23YXZ267CCN475';
export const REGION_COUNTRY = 'gb';

export function medusaHeaders(authToken?: string | null): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-publishable-api-key': PUBLISHABLE_KEY,
  };
  if (authToken) h['Authorization'] = `Bearer ${authToken}`;
  return h;
}

export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('medusa_cart_id');
}
export function setCartId(id: string) {
  if (typeof window !== 'undefined') localStorage.setItem('medusa_cart_id', id);
}
export function clearCartId() {
  if (typeof window !== 'undefined') localStorage.removeItem('medusa_cart_id');
}
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('medusa_auth_token');
}
export function setAuthToken(t: string) {
  if (typeof window !== 'undefined') localStorage.setItem('medusa_auth_token', t);
}
export function clearAuthToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('medusa_auth_token');
}

export async function medusaFetch(path: string, init: RequestInit = {}, authToken?: string | null) {
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    ...init,
    headers: { ...medusaHeaders(authToken ?? getAuthToken()), ...(init.headers || {}) },
  });
  return res;
}
