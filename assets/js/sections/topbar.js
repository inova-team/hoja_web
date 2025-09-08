// Convert a raw phone number to a `tel:` link
function toTelHref(raw = '') {
  const digits = String(raw).replace(/[^\d+]/g, ''); // keep only digits and plus
  return digits ? `tel:${digits}` : null;
}

// Set link href and text if the element exists
function setLink(el, href, text) {
  if (!el) return; // guard if the element is missing
  if (href) el.setAttribute('href', href); // update href when provided
  if (text) el.textContent = text; // replace text when non-empty
}

// Reveal the navbar and hide any loading indicator
function showTopbarAndHideLoader() {
  const topbar = document.getElementById('templatemo_nav_top');
  if (topbar) topbar.style.visibility = 'visible';
  const loader = document.getElementById('page-loader');
  if (loader) loader.style.display = 'none';
}

// Fetch site settings from Strapi and populate the top bar
async function renderTopbar() {
  try {
    const resp = await fetch('http://localhost:1337/api/site-setting?populate=*'); // request settings
    const data = await resp.json(); // parse JSON body
    const attrs = data?.data?.attributes || {}; // safely access attributes

    // Pull out needed fields
    const {
      topEmail,
      topPhone,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      socialLinkedIn,
    } = attrs;

    // Apply values to the DOM
    if (topEmail)
      setLink(document.getElementById('top-email'), `mailto:${topEmail}`, topEmail);
    if (topPhone)
      setLink(document.getElementById('top-phone'), toTelHref(topPhone), topPhone);
    if (socialFacebook) setLink(document.getElementById('top-fb'), socialFacebook);
    if (socialInstagram) setLink(document.getElementById('top-ig'), socialInstagram);
    if (socialTwitter) setLink(document.getElementById('top-tw'), socialTwitter);
    if (socialLinkedIn) setLink(document.getElementById('top-li'), socialLinkedIn);
  } catch (err) {
    console.warn('[TopBar] failed to fetch site-setting:', err); // log any errors
  } finally {
    showTopbarAndHideLoader(); // always reveal the nav and hide loader
  }
}

// Run once the DOM has loaded
window.addEventListener('DOMContentLoaded', renderTopbar);

