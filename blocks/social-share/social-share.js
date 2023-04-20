import {
  a, div, li, ul, span,
} from '../../scripts/dom-helpers.js';

function getURL() {
  return encodeURIComponent(window.location.href);
}

function getTitle() {
  const h2 = document.querySelector('h2');
  return h2 ? encodeURIComponent(h2.textContent) : '';
}

function onSocialShareClick(event) {
  event.preventDefault();
  const href = event.currentTarget.getAttribute('href');
  if (!href) return;
  window.open(href, 'popup', 'width=800,height=700,scrollbars=no,resizable=no');
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
        decorateLink(social, 'Email', icon, `mailto:subject=${title}&body=${title}`);
        break;
      default:
        break;
    }
  });
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
  const container = block.querySelector('main .social-links .icon-container');
  document.onscroll = () => {
    const windowTop = window.pageYOffset;
    if (windowTop > 100) { container.classList.add('sticky'); } else { container.classList.remove('sticky'); }
  };
}
