/**
 * @param {teaser} $block
 */
export default function decorateTeaser(block) {
  // create close icon
  const divElem = document.createElement('div');
  divElem.className = 'close';
  const spanElem = document.createElement('span');
  divElem.appendChild(spanElem);
  const imgElement = document.createElement('img');
  imgElement.src = '/icons/icon-close.png';
  imgElement.alt = 'close icon';
  spanElem.append(imgElement);
  spanElem.addEventListener('click', () => {
    block.classList.add('hidden');
    return false;
  });
  block.append(divElem);
}
