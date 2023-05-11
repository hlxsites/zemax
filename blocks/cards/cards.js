import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { createYoutubeModal } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);

  // Full card should be clickable
  block.querySelectorAll('.cards > ul > li').forEach((card) => {
    const alink = card.querySelector('a').href;

    card.addEventListener('click', (e) => {
      if (!alink.includes('youtube.com')) {
        document.location.href = alink.href;
      } else {
        e.preventDefault();
        const url = new URL(alink);
        const vid = url.searchParams.get('v');
        createYoutubeModal(block, vid);
      }
    });
  });
}
