import { CMS_BASE_URL, CMS_TIMEOUT_MS } from './config.js';

export async function cmsGet(path, { signal } = {}) {
  const url = `${CMS_BASE_URL}${path}`;
  const ctrl = signal ? null : new AbortController();
  const usedSignal = signal || ctrl?.signal;
  const timeout = setTimeout(() => ctrl?.abort(), CMS_TIMEOUT_MS);

  try {
    const res = await fetch(url, { method: 'GET', signal: usedSignal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}
