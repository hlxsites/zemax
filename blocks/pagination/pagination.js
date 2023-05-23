import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { a, ul } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const { page, pages } = readBlockConfig(block);
  block.textContent = '';
  block.append(createPagination(block, Number(page), Number(pages)));
}

function getUrlForPage(pageNo) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('page', pageNo);
  return `?${searchParams}`;
}

/**
 * Create an array of page numbers to display in the pagination
 * @param currentPage
 * @param totalPages
 * @return {number[]}
 */
function createPageItems(currentPage, totalPages) {
  const maxPages = 5;
  let startPage;
  let endPage;

  if (totalPages <= maxPages) {
    // If there are 5 pages or less, show all pages
    startPage = 1;
    endPage = totalPages;
  } else if (currentPage <= Math.floor(maxPages / 2)) {
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

  // Create an array of page numbers
  const pages = [];
  // eslint-disable-next-line no-plusplus
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}

/**
 *
 * @param block
 * @param page {number}
 * @param pages {number}
 * @return {Element}
 */
function createPagination(block, page, pages) {
  const list = ul();

  const pageItems = createPageItems(page, pages);

  function addLink(str, pageNo = null) {
    const li = document.createElement('li');
    if (pageNo) {
      const isCurrentPage = Number(pageNo) === page;
      li.append(a({ href: getUrlForPage(pageNo), class: isCurrentPage ? 'current-page' : '' }, str));
    } else {
      li.append(str);
    }
    list.appendChild(li);
  }

  // prev
  if (page > 1) addLink(' < ', page - 1);

  // always show first page
  if (pageItems[0] !== 1) {
    addLink(1, 1);
    addLink('...');
  }

  // list pages around current page
  pageItems.forEach((pageItem) => {
    addLink(pageItem, pageItem);
  });

  // always show last page
  if (pageItems[pageItems.length - 1] !== pages) {
    addLink('...', '...');
    addLink(pages, pages);
  }

  // next
  if (page < pages) addLink(' > ', page + 1);

  return list;
}
