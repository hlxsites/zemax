// eslint-disable-next-line import/no-cycle
import { loadScript } from './scripts.js';
import { sampleRUM, fetchPlaceholders } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// fetch placeholders file
const placeholders = await fetchPlaceholders();

// OneTrust Cookies Consent Notice start
const otId = placeholders.onetrustid;
if (otId) {
  loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
    'data-domain-script': `${otId}`,
  });

  window.OptanonWrapper = () => {};
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
