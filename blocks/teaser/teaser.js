import { div, img } from '../../scripts/dom-helpers.js';

/**
 * @param {teaser} $block
 */

export default function decorateTeaser(block) {
  const closeIcon = div({ class: 'close' },
    img({ src: '/icons/icon-close.png', alt: 'close icon' }),
  );

  closeIcon.querySelector('img').addEventListener('click', () => {
    block.classList.add('hidden');
    block.closest('.teaser-container').classList.add('hidden');
    return false;
  });
  block.append(closeIcon);
}
