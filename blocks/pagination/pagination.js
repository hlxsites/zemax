import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { ul } from '../../scripts/dom-helpers.js';

function addLink(list, s) {
  const li = document.createElement('li');
  li.innerHTML = s;
  list.appendChild(li);
}

export default async function decorate(block) {
  const { page, pages } = readBlockConfig(block);

  const pageCountLast = pages - 4;
  const lastIter = pages - page;
  const itemFirst = page - 2;
  const itemSecond = page - 1;
  const itemLast = page + 1;

  const list = ul();
  block.append(list);

  if (page > 1) {
    addLink(list, '<li><a href=""> &lt; </a></li>');
  } else {
    addLink(list, '<li><span> &lt; </span></li>');
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= pages; i++) {
    if (pages <= 5) {
      if (page === i) {
        addLink(list, `<li><a href="" class="current-page">${i}</a></li>`);
      } else if (i <= pages) {
        addLink(list, `<li><a href="">${i}</a></li>`);
      }
    } else if (page < 5) {
      if (page === i) {
        addLink(list, `<li><a href="" class="current-page">${i}</a></li>`);
      } else if (i === 6) {
        addLink(list, '<li><span class="dotted-page">...</span></li>');
      } else if (i === 7) {
        addLink(list, `<li><a href="">${pages}</a></li>`);
      } else {
        addLink(list, `<li><a href="">${i}</a></li>`);
      }
    } else if (page >= 5 && page <= pageCountLast) {
      if (i === 1) {
        addLink(list, `<li><a href="">${i}</a></li>`);
        addLink(list, '<li><a href="" class="dotted-page">...</a></li>');
      } else if (i === 4) {
        addLink(list, `<li><a href="" class="current-page">${page}</a></li>`);
      } else if (i === 6) {
        addLink(list, '<li><span class="dotted-page">...</span></li>');
        addLink(list, `<li><a href="">${pages}</a></li>`);
      } else if (i === 2) {
        addLink(list, `<li><a href="">${itemFirst}</a></li>`);
      } else if (i === 3) {
        addLink(list, `<li><a href="">${itemSecond}</a></li>`);
      } else if (i === 5) {
        addLink(list, `<li><a href="">${itemLast}</a></li>`);
      }
    } else if (page >= pageCountLast) {
      if (i === 1) {
        addLink(list, '<li><a href="" >1</a></li>');
      } else if (7 - lastIter === i) {
        addLink(list, `<li><a href="" class="current-page">${page}</a></li>`);
      } else if (i === 2) {
        addLink(list, '<li><span class="dotted-page">...</span></li>');
      } else if (i === 7) {
        addLink(list, `<li><a href="">${pages}</a></li>`);
      } else {
        addLink(list, `<li><a href="">${pages - 7 + i}</a></li>`);
      }
    }
  }

  if (page < pages) {
    addLink(list, '<li><a href=""> &gt; </a></li>');
  } else {
    addLink(list, '<li><span> &gt; </span></li>');
  }
}
