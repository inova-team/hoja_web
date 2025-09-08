import { strapi } from '../../../src/strapiClient.js';

// ===== Helpers =====
function withTimeout(promise, ms = 12000, message = `Request timed out after ${ms} ms`) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(message)), ms);
    promise
      .then(v => {
        clearTimeout(t);
        resolve(v);
      })
      .catch(e => {
        clearTimeout(t);
        reject(e);
      });
  });
}

// Normalize phone to tel: href
function toTelHref(raw = '') {
  const digits = String(raw).replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : null;
}

function setLink(el, href, text) {
  if (!el) return;
  if (href) el.setAttribute('href', href);
  if (text) el.textContent = text; // only replace if non-empty
}

function showTopbarAndHideLoader() {
  const topbar = document.getElementById('templatemo_nav_top');
  if (topbar) topbar.style.visibility = 'visible';
  const loader = document.getElementById('page-loader');
  if (loader) loader.style.display = 'none';
}

// Try multiple attribute names to be resilient to schema differences
function firstNonEmpty(obj, candidates) {
  for (const key of candidates) {
    const val = obj?.[key];
    if (val !== undefined && val !== null && String(val).trim() !== '') return val;
  }
  return null;
}

// ===== Main =====


async function renderTopBarIDs() {
    try {
      console.time('site-setting');
      const resp = await withTimeout(strapi.get('/site-setting', { populate: '*' }), 12000);
      console.timeEnd('site-setting');
      console.debug('[TopBar] raw response:', resp);
  
      // Soporta REST de Strapi que devuelve atributos en data.attributes o en data plano
      const s =
        (resp && resp.data && (resp.data.attributes || resp.data)) ||
        resp?.attributes ||
        resp ||
        {};
  
      console.debug('[TopBar] resolved fields:', s);
  
      // Pick fields con fallbacks
      const email = firstNonEmpty(s, ['topEmail', 'email', 'contactEmail']);
      const phone = firstNonEmpty(s, ['topPhone', 'phone', 'contactPhone', 'telephone']);
      const fb    = firstNonEmpty(s, ['socialFacebook', 'facebook', 'fb', 'facebookUrl']);
      const ig    = firstNonEmpty(s, ['socialInstagram', 'instagram', 'ig', 'instagramUrl']);
      const tw    = firstNonEmpty(s, ['socialTwitter', 'twitter', 'tw', 'twitterUrl', 'xUrl']);
      const li    = firstNonEmpty(s, ['socialLinkedIn', 'linkedin', 'li', 'linkedinUrl']);
  
      if (email) setLink(document.getElementById('top-email'), `mailto:${email}`, email);
      if (phone) setLink(document.getElementById('top-phone'), toTelHref(phone), phone);
      if (fb)    setLink(document.getElementById('top-fb'), fb);
      if (ig)    setLink(document.getElementById('top-ig'), ig);
      if (tw)    setLink(document.getElementById('top-tw'), tw);
      if (li)    setLink(document.getElementById('top-li'), li);
    } catch (err) {
      console.warn('[TopBar] failed to load SiteSetting:', err);
    } finally {
      showTopbarAndHideLoader();
    }
  }

  
// Ensure DOM exists; script is loaded as a module
window.addEventListener('DOMContentLoaded', renderTopBarIDs);
