import { searchResults, createTag, getMetadata } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  // const blockConfig = readBlockConfig(block);
  // const { category } = blockConfig;
  const category = getMetadata('category');
  console.log(category);

  const filteredCards = await searchResults('/query-index.json', category);
  block.innerHTML = '';
  console.log(filteredCards);

  const cardsWrapper = createTag('ul', {});
  filteredCards.forEach((item) => {
    const cardsList = createTag('li', {});
    const cardTitle = createTag('h4', { class: 'card-title' });
    const cardDescription = createTag('p', { class: 'card-description' });
    const cardImage = createTag('div', { class: 'cards-card-image' });
    cardTitle.innerText = item.title;
    cardDescription.innerText = item.description;
    cardImage.innerHTML = createOptimizedPicture(item.image, 'test', false, [{ width: '380', height: '214' }]).outerHTML;
    cardsList.append(cardImage, cardTitle, cardDescription);
    cardsWrapper.append(cardsList);
  });

  block.innerHTML = '';
  block.append(cardsWrapper);
}
