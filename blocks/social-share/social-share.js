import {
  a, div, li, ul, span,
} from '../../scripts/dom-helpers.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

function getURL() {
  return encodeURIComponent(window.location.href);
}

function getTitle() {
  const title = getMetadata('title');
  return title ? encodeURIComponent(title.textContent) : '';
}

function onSocialShareClick(event) {
  event.preventDefault();
  const href = event.currentTarget.getAttribute('href');
  if (!href) return;
  window.open(href);
}

function decorateLink(social, type, icon, url) {
//   icon.setAttribute('aria-label', type);
  if (!url) return;

  social.append(
    a(
      {
        href: url,
        'aria-label': `Share to ${type}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        onclick: onSocialShareClick,
      },
      icon,
    ),
  );
}

function decorateIcons(element) {
  const url = getURL();
  const title = getTitle();

  element.querySelectorAll('li').forEach((social) => {
    const type = social.getAttribute('data-type');
    const icon = social.querySelector('span');
    switch (type) {
      case 'facebook':
        decorateLink(social, 'Facebook', icon, `https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'linkedin':
        decorateLink(social, 'LinkedIn', icon, `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`);
        break;
      case 'twitter':
        decorateLink(social, 'Twitter', icon, `https://www.twitter.com/share?&url=${url}&text=${title}`);
        break;
      case 'email':
        decorateLink(social, 'Email', icon, `mailto:?subject=${title}&body=${title}`);
        break;
      default:
        break;
    }
  });
}

function stickySocialNav() {
  const container = document.querySelector('main .social-links .icon-container');
  const windowTop = window.pageYOffset;
  const r = document.querySelector(':root');
  const scrollTop = parseInt((r ? getComputedStyle(r).getPropertyValue('--nav-height').replace('px', '') : 120), 10) + 50;

  if ((windowTop - scrollTop) > scrollTop) {
    container.classList.add('sticky');
  } else { container.classList.remove('sticky'); }
}

export default function decorate(block) {
  block.innerHTML = '';
  const socials = ['facebook', 'twitter', 'email', 'linkedin'];
  block.appendChild(

    div(
      { class: 'social-links' },
      ul(
        { class: 'icon-container' },
        ...socials.map((social) =>
        // eslint-disable-next-line implicit-arrow-linebreak
          li(
            { class: `share-${social}`, 'data-type': social },
            span({ class: `icon icon-${social}` }),
          )),
      ),
    ),
  );
  decorateIcons(block);
  if (window.innerWidth > 480) { document.onscroll = stickySocialNav; }
}
