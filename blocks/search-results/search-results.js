import { createOptimizedPicture, readBlockConfig } from '../../scripts/lib-franklin.js';
import {
  createTag, createYoutubeModal, getMetadata, searchResults,
} from '../../scripts/scripts.js';

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
  for (let i = startPage; i <= endPage; i += 1) {
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

function getLinkLabelByCategory(category) {
  const categoryMap = {
    Webinar: 'Watch now',
    videos: 'Play now',
    'product-overviews': 'Download now',
    eguides: 'Learn more',
    'Success Story': 'Learn more',
  };
  return categoryMap[category] || 'Read more';
}

/**
 * Format date from int to string
 * @param {number} publishDate - int date value like: 44659, this date format is come
 * from serialized date from excel file
 * @returns {string} formatted date string like: Aug 2, 2022
 */
function formatDate(publishDate) {
  const date = new Date(Math.round((publishDate - 25568) * 86400 * 1000));
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
  return `${month} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Return the title for search result card, which hard code for some category,
 * for rest news blog, use publish date instead
 * @param {string} category - the category which based on url path or
 * blog category title for news blog
 * @param {number} publishDate - int date value like: 44659, this date format is come
 * @returns {string} - the blog title show in the search result card
 */
function getTitleByCategory(category, publishDate) {
  const categoryMap = {
    Webinar: 'Webinar',
    videos: 'Product video',
    'Success Story': 'Success Story',
    'product-overviews': 'Product Overview',
    eguides: 'eGuide',
  };
  return categoryMap[category] || formatDate(publishDate);
}

function getLink(item) {
  if (item.link) {
    return item.link;
  }
  if (item.path) {
    return item.path;
  }
  return '#';
}

export default async function decorate(block) {
  const category = getMetadata('category');
  const blockConfig = readBlockConfig(block);
  const indexEndpoint = blockConfig['data-source'] || '/query-index.json';

  const filteredCards = await searchResults(indexEndpoint, category);
  filteredCards.sort((a, b) => new Date(b.publishdate) - new Date(a.publishdate));

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

    if (item.image) {
      cardImage.innerHTML = createOptimizedPicture(item.image, item.title, false, [{ width: '380', height: '214' }]).outerHTML;
    } else if (item.link && item.link.includes('youtube.com')) {
      const url = new URL(item.link);
      const vid = url.searchParams.get('v');
      const img = document.createElement('img');
      img.setAttribute('loading', 'lazy');
      img.setAttribute('alt', item.title);
      img.setAttribute('src', `https://img.youtube.com/vi/${vid}/mqdefault.jpg`);
      cardImage.appendChild(img);
    }

    // cards-card-body
    const cardBody = createTag('div', { class: 'cards-card-body' });

    const cardTitle = createTag('h5', { class: 'card-title' }, getTitleByCategory(category, item.publishdate));
    const cardDescription = createTag('p', { class: 'card-description' }, item.title);

    const alink = getLink(item);
    const cardLinkHref = createTag('a', { href: alink, class: 'button' }, getLinkLabelByCategory(category));
    const cardLinkParagraphs = createTag('p', { class: 'button-container' });
    cardLinkParagraphs.append(cardLinkHref);

    cardBody.append(cardTitle, cardDescription, cardLinkParagraphs);

    // append both cards-card-image and cards-card-body to cardsList
    cardItem.append(cardImage, cardBody);

    // Full card should be clickable
    cardItem.addEventListener('click', (e) => {
      if (alink.includes('youtube.com')) {
        e.preventDefault();
        const url = new URL(alink);
        const vid = url.searchParams.get('v');
        createYoutubeModal(block, vid);
      } else if (category === 'product-overviews') {
        window.open(alink, '_blank');
      } else {
        document.location.href = alink;
      }
    });
    cardsWrapper.append(cardItem);
  });
  block.append(cardsWrapper);
  const layoutClass = blockConfig.layout || 'layout-3-card';
  block.classList.add('cards', layoutClass, 'curved-text', 'orange', 'resource-center', 'search-results');
  if (category === 'videos') {
    block.classList.add('video');
  }

  // only show pagination if there are more than 12 cards
  if (filteredCards.length > CARDS_PER_PAGE) {
    const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
    const paginationSelector = createPaginationSelector(currentPage, totalPages);
    block.append(paginationSelector);
  }
}
