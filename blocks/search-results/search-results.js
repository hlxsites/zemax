import { searchResults, createTag, getMetadata } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

const CARDS_PER_PAGE = 12;

function createEllipsis() {
  return createTag('span', { class: 'ellipsis' }, '...');
}

function createPageSelector(page) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', page);
  return createTag('a', { class: 'page-number', href: url.toString() }, page);
}

function createPrevPageSelector(currentPage) {
  const prevPageUrl = new URL(window.location.href);
  let prevPageUrlStr;
  if (currentPage <= 1) {
    prevPageUrlStr = '#container-post';
  } else {
    prevPageUrl.searchParams.set('page', currentPage - 1);
    prevPageUrlStr = prevPageUrl.toString();
  }
  return createTag('a', { class: 'prev-page', href: prevPageUrlStr }, '<');
}

function createNextPageSelector(currentPage, totalPages) {
  const nextPageUrl = new URL(window.location.href);
  let nextPageUrlStr;
  if (currentPage + 1 > totalPages) {
    nextPageUrlStr = '#container-post';
  } else {
    nextPageUrl.searchParams.set('page', currentPage + 1);
    nextPageUrlStr = nextPageUrl.toString();
  }
  return createTag('a', { class: 'next-page', href: nextPageUrlStr }, '>');
}

function createPaginationSelector(currentPage, totalPages, maxVisiblePages = 4) {
  const paginationDiv = createTag('div', { class: 'pagination-selector' });

  // Add a "previous" selector
  paginationDiv.appendChild(createPrevPageSelector(currentPage));

  // Calculate range of visible pages
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  // Adjust range if there are fewer pages than maxVisiblePages
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add first page number selector
  if (startPage > 1) {
    paginationDiv.appendChild(createPageSelector(1));
    if (startPage > 2) {
      paginationDiv.appendChild(createEllipsis());
    }
  }

  // Add page number selectors
  for (let i = startPage; i <= endPage; i++) {
    const pageSelector = createPageSelector(i);
    if (i === currentPage) {
      pageSelector.classList.add('current-page');
    }
    paginationDiv.appendChild(pageSelector);
  }

  // Add last page number selector
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationDiv.appendChild(createEllipsis());
    }
    paginationDiv.appendChild(createPageSelector(totalPages));
  }

  // Add a "next" selector
  paginationDiv.appendChild(createNextPageSelector(currentPage, totalPages));

  return paginationDiv;
}

export default async function decorate(block) {
  const category = getMetadata('category');
  const filteredCards = await searchResults('/query-index.json', category);
  block.innerHTML = '';

  // default current page to 1 if not specified in params
  let currentPage = 1;
  const pageParam = new URLSearchParams(window.location.search).get('page');
  if (pageParam) {
    currentPage = parseInt(pageParam, 10);
  }
  const start = (currentPage - 1) * CARDS_PER_PAGE;
  const currentPageCards = filteredCards.slice(start, start + CARDS_PER_PAGE);

  const cardsWrapper = createTag('ul', {});
  currentPageCards.forEach((item) => {
    const cardItem = createTag('li', {});

    // cards-card-image
    const cardImage = createTag('div', { class: 'cards-card-image' });
    cardImage.innerHTML = createOptimizedPicture(item.image, 'test', false, [{ width: '380', height: '214' }]).outerHTML;

    // cards-card-body
    const cardBody = createTag('div', { class: 'cards-card-body' });

    const cardTitle = createTag('h5', { class: 'card-title' }, category);
    const cardDescription = createTag('p', { class: 'card-description' }, item.title);

    const cardLinkHref = createTag('a', { href: item.path }, 'Watch now');
    const cardLinkParagraphs = createTag('p', { class: 'button-container' });
    cardLinkParagraphs.append(cardLinkHref);

    cardBody.append(cardTitle, cardDescription, cardLinkParagraphs);

    // append both cards-card-image and cards-card-body to cardsList
    cardItem.append(cardImage, cardBody);
    cardsWrapper.append(cardItem);
  });
  block.append(cardsWrapper);

  // only show pagination if there are more than 12 cards
  if (filteredCards.length > CARDS_PER_PAGE) {
    const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
    const paginationSelector = createPaginationSelector(currentPage, totalPages);
    block.append(paginationSelector);
  }
}
