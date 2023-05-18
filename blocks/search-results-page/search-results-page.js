import { div, h2 } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const params = getSearchParams();

  block.innerHTML = '';
  const tabs = div({ class: 'tabs' });
  // tabs labels are static as there is no authoring needed
  tabs.innerHTML = `
            <div>
              <div class="${!params.view ? 'active' : ''}"><a href='/search'>Product Information</a></div>
              <div class="${params.view === 'resources' ? 'active' : ''}"><a href='/search?view=resources&#x26;q=optics&#x26;options%5Bprefix%5D=last&#x26;type=article'>Resources</a></div>
              <div class="${params.view === 'knowledgebase' ? 'active' : ''}"><a href='/search?view=knowledgebase&#x26;q=optics'>Knowledgebase</a></div>
              <div class="${params.view === 'community' ? 'active' : ''}"><a href='/search?view=community&#x26;q=optics'>Community</a></div>
          </div>
`;
  block.append(tabs);


  block.prepend(h2(`Search results for “${params.searchTerm}”`));
}

function getSearchParams() {
  /**
   * @type {'resources'|'resources'|'knowledgebase'|'community'}
   */
  const view = new URLSearchParams(window.location.search).get('view');
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
