// assets/js/sections/topbar.js
const domReady = () =>
  document.readyState === 'loading'
    ? new Promise(r => document.addEventListener('DOMContentLoaded', r, { once: true }))
    : Promise.resolve();

(async () => {
  await domReady();

  if (!window.strapiFetch) {
    console.error('[topbar] Falta cms-config.js (strapiFetch no existe).');
    return;
  }

  // Usa el UID real de tu Single Type; por tu log parece "site-setting"
  const endpoint = 'site-setting';

  let res;
  try {
    res = await window.strapiFetch(endpoint);
  } catch (e) {
    console.error('[topbar] Error pidiendo site-setting:', e);
    return;
  }

  if (!res || !res.data) {
    console.error('[topbar] Respuesta sin data en site-setting:', res);
    return;
  }

  // ✅ Strapi v5: single -> res.data { id, documentId, ...campos }
  //    v4 (legacy): single -> res.data.attributes
  const record = Array.isArray(res.data) ? res.data[0] : res.data;
  const attrs = record?.attributes || record; // funciona para v4 y v5

  if (!attrs) {
    console.warn('[topbar] Sin attrs tras normalizar:', res.data);
    return;
  }

  const $ = id => document.getElementById(id);
  const setTextHref = (id, text, href) => {
    const el = $(id);
    if (!el) { console.warn(`[topbar] Falta #${id} en el DOM`); return; }
    if (text) el.textContent = text;
    if (href) el.href = href;
  };

  // 🔁 Ajusta los nombres a tus campos reales (según tu log):
  // topEmail, topPhone, socialFacebook, socialInstagram, socialLinkedIn, socialTwitter
  setTextHref('top-email', attrs.topEmail,   attrs.topEmail   ? `mailto:${attrs.topEmail}` : null);
  setTextHref('top-phone', attrs.topPhone,   attrs.topPhone   ? `tel:${attrs.topPhone}`   : null);
  setTextHref('top-fb',    null,             attrs.socialFacebook  || '#');
  setTextHref('top-ig',    null,             attrs.socialInstagram || '#');
  setTextHref('top-tw',    null,             attrs.socialTwitter   || '#');
  setTextHref('top-li',    null,             attrs.socialLinkedIn  || '#');


  // === Siempre se ejecuta, haya éxito o error ===
  const topbar = document.getElementById('templatemo_nav_top');
  if (topbar) {
    topbar.style.visibility = 'visible';
  }


})();
