import { a, div, h2 } from '../../scripts/dom-helpers.js';

function createTabs(params) {
  const tabs = div({ class: 'tabs' });
  // tabs labels are static as there is no authoring needed

  tabs.appendChild(
    div(
      div({ 'data-view': '' },
        a({ href: `/search?q=${params.searchTerm}` }, 'Product Information'),
      ),
      div({ 'data-view': 'resources' },
        a({ href: `/search?view=resources&q=${params.searchTerm}&options%5Bprefix%5D=last&type=article` }, 'Resources'),
      ),
      div({ 'data-view': 'knowledgebase' },
        a({ href: `/search?view=knowledgebase&q=${params.searchTerm}` }, 'Knowledgebase'),
      ),
      div({ 'data-view': 'community' },
        a({ href: `/search?view=community&q=${params.searchTerm}` }, 'Community'),
      ),
    ),
  );

  tabs.querySelector(`[data-view="${params.view}"]`)?.classList.add('active');
  return tabs;
}

export default async function decorate(block) {
  const params = getSearchParams();

  block.innerHTML = '';
  if (params.searchTerm) {
    block.prepend(h2(`Search results for “${params.searchTerm}”`));
  } else {
    block.prepend(h2('Search our site'));
  }

  block.append(createTabs(params));

  if (params.view === '') {
    h2('Product Information');
  }
}

function getSearchParams() {
  /**
   * @type {'resources'|'resources'|'knowledgebase'|'community'}
   */
  const view = new URLSearchParams(window.location.search).get('view') || '';
  /**
   * @type {number}
   */
  const page = new URLSearchParams(window.location.search).get('page');
  /**
   * @type {'article'|undefined}
   */
  const type = new URLSearchParams(window.location.search).get('type');
  /**
   * @type {string}
   */
  const searchTerm = new URLSearchParams(window.location.search).get('q');
  /**
   * @type {'last'|'first'}
   */
  const prefix = new URLSearchParams(window.location.search).get('options[prefix]');

  return {
    view, page, type, searchTerm, prefix,
  };
}
