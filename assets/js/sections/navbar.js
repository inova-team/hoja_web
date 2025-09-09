import { cmsGet } from '../common/http.js';
import { CMS_BASE_URL } from '../common/config.js';

export async function mountNavbar(options = {}) {
  const {
    endpoint = '/api/site-navbar?populate[logo]=*&populate[menuItems]=*',
    selectors = {},
    onFinally,
  } = options;

  try {
    const payload = await cmsGet(endpoint);
    const record = payload?.data?.attributes ?? payload?.data;
    if (!record) return;

    // logo
    if (selectors.logo && record.logo) {
      const el = document.querySelector(selectors.logo);
      if (el) {
        const imgUrl = record.logo.formats?.thumbnail?.url || record.logo.url;
        el.src = imgUrl.startsWith('http') ? imgUrl : `${CMS_BASE_URL}${imgUrl}`;
        if (record.logo.alternativeText) el.alt = record.logo.alternativeText;
      }
    }

    // menu items
    if (selectors.menu && Array.isArray(record.menuItems)) {
      const list = document.querySelector(selectors.menu);
      if (list) {
        list.innerHTML = '';
        [...record.menuItems]
          .sort((a, b) => a.order - b.order)
          .forEach(item => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            const a = document.createElement('a');
            a.className = 'nav-link';
            a.href = item.url || '#';
            if (item.target) a.target = item.target;
            a.textContent = item.label;
            li.appendChild(a);
            list.appendChild(li);
          });
      }
    }

    // search icon visibility
    if (selectors.search && record.enableSearch === false) {
      const el = document.querySelector(selectors.search);
      if (el) el.style.display = 'none';
    }

    // mobile search placeholder
    if (selectors.mobilePlaceholder && record.mobileSearchPlaceholder) {
      const el = document.querySelector(selectors.mobilePlaceholder);
      if (el) el.placeholder = record.mobileSearchPlaceholder;
    }
  } catch (e) {
    console.error('[navbar] Error', e);
  } finally {
    onFinally?.();
  }
}
