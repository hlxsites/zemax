// eslint-disable-next-line import/no-cycle
import { loadScript } from './scripts.js';
import { sampleRUM, fetchPlaceholders } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
loadGoogleTagManager();
// fetch placeholders file
const placeholders = await fetchPlaceholders();

// OneTrust Cookies Consent Notice start
if (!window.location.host.includes('hlx.page') && !window.location.host.includes('localhost')) {
  const otId = placeholders.onetrustid;
  if (otId) {
    loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
      type: 'text/javascript',
      charset: 'UTF-8',
      'data-domain-script': `${otId}`,
    });

    window.OptanonWrapper = () => {
    };
  }

  const allButtons = document.querySelectorAll('a.button');
  allButtons.forEach((button) => {
    if (button.getAttribute('href').includes('cookie-policy')) {
      button.addEventListener('click', (e) => {
        // eslint-disable-next-line no-undef
        OneTrust.ToggleInfoDisplay();
        e.preventDefault();
      });
    }
  });
}

async function loadGoogleTagManager() {
  // google tag manager
  // eslint-disable-next-line func-names
  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); const f = d.getElementsByTagName(s)[0]; const j = d.createElement(s); const
      dl = l !== 'dataLayer' ? `&l=${l}` : ''; j.async = true; j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`; f.parentNode.insertBefore(j, f);
  }(window, document, 'script', 'dataLayer', 'GTM-PXZBLWC'));
}
