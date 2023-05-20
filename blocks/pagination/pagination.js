import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { a, ul } from '../../scripts/dom-helpers.js';

function addLink(list, str, page) {
  const li = document.createElement('li');
  if (page != null) {
    li.append(a({ href: `?page=${page}` }, str));
  } else {
    li.append(str);
  }
  list.appendChild(li);
}

export default async function decorate(block) {
  let { page, pages } = readBlockConfig(block);

  page = 7;
  pages = 34;
  const pageCountLast = pages - 4;
  const lastIter = pages - page;
  const itemFirst = page - 2;
  const itemSecond = page - 1;
  const itemLast = page + 1;

  const list = ul();
  block.append(list);

  if (page > 1) {
    addLink(list, ' < ', 1);
  } else {
    addLink(list, '<', 1);
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= pages; i++) {
    if (pages <= 5) {
      if (page === i) {
        addLink(list, i, i);
      } else if (i <= pages) {
        addLink(list, i, i);
      }
    } else if (page < 5) {
      if (page === i) {
        addLink(list, i, i);
      } else if (i === 6) {
        addLink(list, '...', null);
      } else if (i === 7) {
        addLink(list, pages, pages);
      } else {
        addLink(list, i, i);
      }
    } else if (page >= 5 && page <= pageCountLast) {
      if (i === 1) {
        addLink(list, i, i);
        addLink(list, '...', null);
      } else if (i === 4) {
        addLink(list, page, page);
      } else if (i === 6) {
        addLink(list, '...');
        addLink(list, pages, pages);
      } else if (i === 2) {
        addLink(list, itemFirst, itemFirst);
      } else if (i === 3) {
        addLink(list, itemSecond, itemSecond);
      } else if (i === 5) {
        addLink(list, itemLast, itemLast);
      }
    } else if (page >= pageCountLast) {
      if (i === 1) {
        addLink(list, 1, 1);
      } else if (7 - lastIter === i) {
        addLink(list, page, page);
      } else if (i === 2) {
        addLink(list, '...', null);
      } else if (i === 7) {
        addLink(list, pages, pages);
      } else {
        addLink(list, pages - 7 + i, pages - 7 + i);
      }
    }
  }

  if (page < pages) {
    addLink(list, ' > ', page + 1);
  } else {
    addLink(list, '<span> &gt; </span>');
  }
}
