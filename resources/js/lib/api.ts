export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = (window as any).APP_URL || '';
  const url = path.startsWith('http') ? path : `${base}/api${path.startsWith('/') ? path : '/'+path}`;

  const token = localStorage.getItem('api_token');

  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    credentials: 'include', // allow sanctum cookie if available
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const error = new Error(data?.message || res.statusText || 'Request failed');
    (error as any).status = res.status;
    (error as any).data = data;
    throw error;
  }

  return data;
}
