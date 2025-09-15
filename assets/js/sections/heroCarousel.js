// assets/js/sections/heroCarousel.js
import { cmsGet } from '../common/http.js';
import { CMS_BASE_URL } from '../common/config.js';

/**
 * Devuelve URL absoluta para un media de Strapi
 * @param {object} media - relación { data: { attributes: { url, formats } } }
 * @param {string[]} preferred - orden de preferencia de formatos
 */
function resolveMediaUrl(media, preferred = ['large', 'medium', 'small', 'thumbnail']) {
  const at = media?.data?.attributes;
  if (!at) return null;
  for (const key of preferred) {
    const u = at.formats?.[key]?.url;
    if (u) return u.startsWith('http') ? u : `${CMS_BASE_URL}${u}`;
  }
  const raw = at.url;
  return raw ? (raw.startsWith('http') ? raw : `${CMS_BASE_URL}${raw}`) : null;
}

/**
 * Crea DOM de un slide .carousel-item (Bootstrap)
 */
function createSlideDOM(slide, isActive = false) {
  const linkUrl = slide?.linkUrl || '#';
  const target = slide?.targetBlank ? '_blank' : '_self';
  const alt = slide?.alt || slide?.label || '';

  const desktopUrl = resolveMediaUrl(slide?.imageDesktop);
  const mobileUrl = resolveMediaUrl(slide?.imageMobile, ['medium', 'small', 'thumbnail', 'large']) || desktopUrl;

  // Estructura basada en tu HTML original
  const item = document.createElement('div');
  item.className = `carousel-item${isActive ? ' active' : ''}`;

  item.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-12 p-0">
          <a href="${linkUrl}" target="${target}" rel="noopener">
            <picture>
              <source media="(min-width: 768px)" srcset="${desktopUrl ?? ''}">
              <img src="${mobileUrl ?? ''}" alt="${alt}" class="img-fluid w-100">
            </picture>
          </a>
        </div>
      </div>
    </div>
  `;

  return item;
}

/**
 * Monta sección heroCarousel desde CMS
 * @param {{
 *  endpoint?: string,
 *  selectors?: { inner?: string },
 *  onBeforeMount?: Function,
 *  onMounted?: Function,
 *  onError?: Function,
 *  onFinally?: Function,
 * }} options
 */
export async function mountHeroCarousel(options = {}) {
  const {
    endpoint = '/api/hero-carousel?populate[slides][populate]=imageDesktop,imageMobile',
    selectors = { inner: '#hero-carousel-inner' },
    onBeforeMount,
    onMounted,
    onError,
    onFinally,
  } = options;

  try {
    onBeforeMount?.();

    const payload = await cmsGet(endpoint);

    // Normalizar singleType vs collectionType
    const record =
      payload?.data?.attributes
        ? { id: payload.data.id, ...payload.data.attributes }
        : Array.isArray(payload?.data)
          ? payload.data[0]?.attributes
          : payload?.data ?? payload;

    const inner = document.querySelector(selectors.inner);
    if (!inner) {
      throw new Error(`Contenedor de carrusel no encontrado: ${selectors.inner}`);
    }

    // Idempotencia: limpiar items previos
    inner.innerHTML = '';

    const slides = Array.isArray(record?.slides)
      ? record.slides
      : record?.slides?.length >= 0
        ? record.slides
        : record?.slides?.data // defensivo si viniera como relación cruda
          ? record.slides.data.map(s => s.attributes)
          : [];

    // Ordenar por 'order' asc, activos primero
    const normalized = slides
      .filter(s => s?.active !== false) // si active es false, ocultar
      .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

    // Render
    normalized.forEach((slide, idx) => {
      const node = createSlideDOM(slide, idx === 0);
      inner.appendChild(node);
    });

    // Si no hubo slides, no dejar el carrusel vacío roto
    if (normalized.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'carousel-item active';
      empty.innerHTML = `
        <div class="container">
          <div class="row">
            <div class="col-12 p-3 text-center">
              <small class="text-muted">No hay banners disponibles</small>
            </div>
          </div>
        </div>`;
      inner.appendChild(empty);
    }

    onMounted?.(record);
  } catch (err) {
    console.error('[heroCarousel] Error:', err);
    onError?.(err);
  } finally {
    onFinally?.();
  }
}
