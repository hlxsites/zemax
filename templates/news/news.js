import { createTag } from '../../scripts/scripts.js';
import {
  getMetadata, buildBlock,
} from '../../scripts/lib-franklin.js';

/**
 *  Insert the element before heading
 * @param {parentElem} section in this case
 * @param {heading} news article heading
 */
function decoratePubDate(parentElem, heading) {
  const dt = getMetadata('publishdate');
  if (dt) {
    const pubdateele = createTag('span');
    pubdateele.classList.add('publish-date');
    pubdateele.innerHTML = dt;
    parentElem.insertBefore(pubdateele, heading);
  }
}

function buildCategoryLink(category) {
  const basepath = '/blogs/news/tagged/';
  const name = category.toLowerCase().replace(' ', '-');
  return `${basepath}${name}`;
}

/**
 *  Insert the element before heading
 * @param {parentElem} section in this case
 * @param {paragraph} news article first paragraph
 */
function decorateCategory(parentElem, paragraph) {
  const category = getMetadata('category');
  if (category) {
    const categoryele = createTag('span');
    categoryele.classList.add('category');
    categoryele.innerHTML = 'Category: ';
    const categorylink = createTag('a');
    categorylink.classList.add('category-link');
    categorylink.href = buildCategoryLink(category);
    categorylink.innerHTML = `${category}`;
    categoryele.append(categorylink);
    parentElem.insertBefore(categoryele, paragraph);
  }
}

export function decorateAutoBlock(section) {
  if (section) {
    section.classList.add('news');
    const heading = section.querySelector('h2');
    const firstPara = section.querySelector('p');
    if (heading) {
      decoratePubDate(section, heading);
      decorateCategory(section, firstPara);
    }
  }
  return section;
}

export default function buildAutoBlocks() {
  const section = document.querySelector('main div');
  decorateAutoBlock(section);
  section.append(buildBlock('social-share', '<p>Share this news</p>'));
}
