import { mountNavbar } from '../sections/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  mountNavbar({
    selectors: {
      logo: '#nav-logo-img',
      menu: '#nav-menu',
      search: '#nav-search',
      mobilePlaceholder: '#inputMobileSearch',
    },
    onFinally: () => {
      const el = document.querySelector('nav.navbar');
      if (el) el.style.visibility = 'visible';
    },
  });
});
