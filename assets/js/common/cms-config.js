// assets/js/common/cms-config.js

// 1. URL de Strapi (local vs producción)
window.STRAPI_URL = 'https://diplomatic-bloom-70eecbcafd.strapiapp.com';

// 2. Token opcional (NO recomendado exponer en front si es sensible)
// Si usas opción A (público sin token), puedes dejarlo vacío.
window.STRAPI_TOKEN = ''; 

// 3. Helper de fetch (usa populate=* por defecto)
window.strapiFetch = async function (endpoint, params = {}) {
  const url = new URL(`${window.STRAPI_URL}/api/${endpoint}`);
  url.search = new URLSearchParams({ populate: '*', ...params });

  const headers = {};
  if (window.STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${window.STRAPI_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Error en Strapi: ${res.status}`);
  return res.json();
};
