import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { a, ul } from '../../scripts/dom-helpers.js';

function getUrlForPage(pageNo) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('page', pageNo);
  return `?${searchParams}`;
}

function createPageItems(currentPage, totalPages) {
  const maxPages = 5;
  let startPage;
  let endPage;

  if (totalPages <= maxPages) {
    // If there are 5 pages or less, show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // If there are more than 5 pages
    if (currentPage <= Math.floor(maxPages / 2)) {
      // If the current page is at the start
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + Math.floor(maxPages / 2) >= totalPages) {
      // If the current page is at the end
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      // Anywhere in the middle
      startPage = currentPage - Math.floor(maxPages / 2);
      endPage = startPage + maxPages - 1;
    }
  }

  // Create an array of page numbers
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}

function createPagination(block, page, pages) {
  const list = ul();

  const pageItems = createPageItems(page, pages);

  function addLink(ignore, str, ignore2) {
    const li = document.createElement('li');
    if (str !== '...') {
      li.append(a({ href: getUrlForPage(page), class: Number(str) === page ? 'current-page' : '' }, str));
    } else {
      li.append(str);
    }
    list.appendChild(li);
  }

  // prev
  addLink(list, ' < ', 1);

  // always show first page
  if (pageItems[0] !== 1) {
    addLink(list, 1, null);
    addLink(list, '...', null);
  }

  // list pages around current page
  pageItems.forEach((pageItem) => {
    addLink(list, pageItem, pageItem);
  });

  // always show last page
  if (pageItems[pageItems.length - 1] !== pages) {
    addLink(list, '...', null);
    addLink(list, pages, null);
  }

  // next
  addLink(list, ' > ', page + 1);

  return list;
}

export default async function decorate(block) {
  const { page, pages } = readBlockConfig(block);

  for (let i = 1; i <= 20; i++) {
    block.append(createPagination(block, i, 20));
  }
}
