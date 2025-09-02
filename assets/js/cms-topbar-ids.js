// ===== Config =====
const STRAPI_URL   = window.STRAPI_URL  || 'http://localhost:1337';
const STRAPI_TOKEN = window.STRAPI_TOKEN || '';
const authHeaders  = STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {};

async function getJSON(path) {
  const url = `${STRAPI_URL}${path}`;
  const res = await fetch(url, { headers: { ...authHeaders } });
  if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
  return res.json();
}

// Normaliza teléfono para el enlace tel:
function toTelHref(raw = '') {
  const digits = String(raw).replace(/[^\d+]/g, ''); // deja dígitos y +
  return digits ? `tel:${digits}` : '#';
}

function setLink(el, href, text) {
  if (!el) return;
  if (href) el.setAttribute('href', href);
  if (typeof text === 'string') el.textContent = text;
}

async function renderTopBarIDs() {
  try {
    // Single Type: SiteSetting
    const resp = await getJSON('/api/site-setting'); 
    const s = resp?.data?.attributes || {};

    setLink(document.getElementById('top-email'), s.topEmail ? `mailto:${s.topEmail}` : '#', s.topEmail || '');
    setLink(document.getElementById('top-phone'), toTelHref(s.topPhone), s.topPhone || '');

    if (s.socialFacebook)  setLink(document.getElementById('top-fb'), s.socialFacebook);
    if (s.socialInstagram) setLink(document.getElementById('top-ig'), s.socialInstagram);
    if (s.socialTwitter)   setLink(document.getElementById('top-tw'), s.socialTwitter);
    if (s.socialLinkedIn)  setLink(document.getElementById('top-li'), s.socialLinkedIn);

  } catch (err) {
    console.warn('TopBar IDs: no se pudo cargar SiteSetting:', err);
    // Fallback: se mantienen los valores estáticos del HTML
  }
}

document.addEventListener('DOMContentLoaded', renderTopBarIDs);
