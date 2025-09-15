// assets/js/pages/index.js
import { mountNavbar } from '../sections/navbar.js';
import { mountHeroCarousel } from '../sections/heroCarousel.js';

document.addEventListener('DOMContentLoaded', () => {
  // Helpers para mostrar secciones ocultas por CSS cuando terminen de montar
  const unhide = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.style.visibility = 'visible';
  };

  // 1) NAVBAR
  const navbarPromise = (async () => {
    try {
      await mountNavbar({
        selectors: {
          logo: '#nav-logo-img',
          menu: '#nav-menu',
          search: '#nav-search',
          mobilePlaceholder: '#inputMobileSearch',
        },
        onFinally: () => unhide('nav.navbar'),
      });
    } catch (e) {
      // ya se loggea dentro del propio módulo; acá evitamos romper el flujo
      unhide('nav.navbar'); // que no quede oculto aunque falle
    }
  })();

  // 2) HERO CAROUSEL
  const heroPromise = (async () => {
    try {
      await mountHeroCarousel({
        endpoint: '/api/hero-carousel?populate[slides][populate]=imageDesktop,imageMobile',
        selectors: {
          inner: '#hero-carousel-inner',
        },
        onFinally: () => unhide('#hero-carousel-inner'),
      });
    } catch (e) {
      // Evitar que el carrusel quede invisible si hubo error
      unhide('#hero-carousel-inner');
    }
  })();

  // (Opcional) Espera global sin bloquear la UI. Útil para telemetría o logs.
  Promise.allSettled([navbarPromise, heroPromise]).then((results) => {
    // console.log('[orchestrator] mount results:', results);
  });
});

