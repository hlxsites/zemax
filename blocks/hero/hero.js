/**
 * @param {hero} $block
 */
export default function decorate(block) {
  block.querySelectorAll('.button').forEach((link) => {
    if (link.href.includes('youtube.com')) {
      link.classList.add('play');
    }
  });
}
