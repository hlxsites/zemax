import { div, h2 } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const params = getSearchParams();

  block.innerHTML = '';

  if (params.searchTerm) {
    block.prepend(h2(`Search results for “${params.searchTerm}”`));
  } else {
    block.prepend(h2('Search our site'));
  }

  const tabs = div({ class: 'tabs' });
  // tabs labels are static as there is no authoring needed
  tabs.innerHTML = `
            <div>
              <div data-view=""><a href="">Product Information</a></div>
              <div data-view="resources"><a href="">Resources</a></div>
              <div data-view="knowledgebase"><a href="">Knowledgebase</a></div>
              <div data-view="community"><a href="">Community</a></div>
          </div> `;

  tabs.querySelector(`[data-view="${params.view}"]`)?.classList.add('active');

  tabs.firstElementChild.children[0].firstElementChild.href = `/search?q=${params.searchTerm}`;
  tabs.firstElementChild.children[1].firstElementChild.href = `/search?view=resources&q=${params.searchTerm}&options%5Bprefix%5D=last&type=article`;
  tabs.firstElementChild.children[2].firstElementChild.href = `/search?view=knowledgebase&q=${params.searchTerm}`;
  tabs.firstElementChild.children[3].firstElementChild.href = `/search?view=community&q=${params.searchTerm}`;
  block.append(tabs);
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
