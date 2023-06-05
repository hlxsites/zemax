import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { createTag, decorateLinkedPictures } from '../../scripts/scripts.js';
import { div } from '../../scripts/dom-helpers.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const blockConfig = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = blockConfig.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;
    decorateIcons(footer);
    decorateLinkedPictures(footer);
    block.append(footer);

    const languagesWrapper = document.querySelector('.footer-sub-links div:nth-child(5) ul');
    const localeSelector = createTag('select', { class: 'locale' });

    languagesWrapper.querySelectorAll('li').forEach((item) => {
      const option = document.createElement('option');
      const link = item.querySelector('a');
      option.value = link.href;
      option.textContent = item.textContent;
      localeSelector.appendChild(option);
    });

    languagesWrapper.parentNode.insertBefore(localeSelector, languagesWrapper);
    languagesWrapper.style.display = 'none';

    // add an event listener to the select box
    localeSelector.addEventListener('change', () => {
      window.location.href = localeSelector.value;
    });

    const brandAndSocialMediaDesktop = footer.querySelector('.footer-main-links > div > div:nth-child(4)');
    brandAndSocialMediaDesktop.classList.add('footer-brand-and-social-media');

    const brandAndSocialMediaMobile = div({ class: 'footer-brand-and-social-media' });
    brandAndSocialMediaMobile.innerHTML = brandAndSocialMediaDesktop.innerHTML;
    brandAndSocialMediaMobile.classList.add('hide-on-tablet');

    brandAndSocialMediaDesktop.classList.add('hide-on-mobile');

    decorateIcons(brandAndSocialMediaMobile);

    block.querySelector('.footer-copyright').before(brandAndSocialMediaMobile);
  }
}
