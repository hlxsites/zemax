import {
  a, div, h2, h3, h4, img, p, span,
} from '../../scripts/dom-helpers.js';

/**
 * @typedef {Object} SearchResults
 * @property {number} count - The total count of results.
 * @property {string} next_page - The URL to the next page of results.
 * @property {number} page - The current page number.
 * @property {number} page_count - The total count of pages.
 * @property {number} per_page - The number of results per page.
 * @property {?string} previous_page - The URL to the previous page of results. Null if no previous page.
 * @property {Array.<Result>} results - The array of results.
 */

/**
 * @typedef {Object} Result
 * @property {number} id - The unique identifier of the result.
 * @property {string} url - The API URL of the result.
 * @property {string} html_url - The HTML URL of the result.
 * @property {number} author_id - The unique identifier of the author.
 * @property {boolean} comments_disabled - Whether comments are disabled.
 * @property {boolean} draft - Whether the result is a draft.
 * @property {boolean} promoted - Whether the result is promoted.
 * @property {number} position - The position of the result.
 * @property {number} vote_sum - The sum of votes.
 * @property {number} vote_count - The count of votes.
 * @property {number} section_id - The unique identifier of the section.
 * @property {string} created_at - The creation timestamp.
 * @property {string} updated_at - The update timestamp.
 * @property {string} name - The name of the result.
 * @property {string} title - The title of the result.
 * @property {string} source_locale - The source locale of the result.
 * @property {string} locale - The locale of the result.
 * @property {boolean} outdated - Whether the result is outdated.
 * @property {Array.<string>} outdated_locales - The list of outdated locales.
 * @property {string} edited_at - The edited timestamp.
 * @property {?number} user_segment_id - The unique identifier of the user segment. Null if not applicable.
 * @property {number} permission_group_id - The unique identifier of the permission group.
 * @property {Array.<number>} content_tag_ids - The array of content tag identifiers.
 * @property {Array.<string>} label_names - The array of label names.
 * @property {string} body - The HTML body content.
 * @property {string} snippet - The snippet content.
 * @property {string} result_type - The type of the result.
 */

function createTabs(params) {
  const tabs = div({ class: 'tabs' });
  // tabs labels are static as there is no authoring needed

  tabs.appendChild(
    div(
      div({ 'data-view': '' },
        a({ href: `/search?q=${params.searchTerm}` }, 'Product Information'),
      ),
      div({ 'data-view': 'resources' },
        a({ href: `/search?view=resources&q=${params.searchTerm}&options%5Bprefix%5D=last&type=article` },
          'Resources'),
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

async function searchResources(params) {
  const resp = await fetch(`${window.location.origin}/query-index.json`);
  const json = await resp.json();
  // todo: filter by url
  return json.data
    .filter((entry) => entry.path.startsWith('/blogs'))
    .filter((entry) => (entry.description + entry.title).toLowerCase()
      .includes(params.searchTerm.toLowerCase()));
}

async function searchProducts(params) {
  const resp = await fetch(`${window.location.origin}/query-index.json`);
  const json = await resp.json();
  return json.data
    .filter((entry) => entry.path.startsWith('/')) // todo: filter by url
    .filter((entry) => (entry.description + entry.title).toLowerCase()
      .includes(params.searchTerm.toLowerCase()));
}

async function createProductInformationResult(params) {
  const result = await searchProducts(params);
  const firstPage = result.slice(0, 3);

  const resultDivs = firstPage
    .map((entry) => (div({ class: 'search-product-block' },
      img({ src: entry.image, alt: entry.title }),
      h4(entry.title),
      p(entry.description),
      a({ href: entry.path }, 'Learn more'),
    )));

  return div(
    div({ class: 'search-heads-block' },
      h3('Product Information',
        // TODO: count
        span({ class: 'search-count-result' }, `${firstPage.length} of ${result.length} results`)),
    ),
    ...resultDivs,
  );
}

async function createResourceResult(params) {
  const result = await searchResources(params);
  const firstPage = result.slice(0, 12);

  const resultDivs = firstPage
    .map((entry) => (div({ class: 'search-product-block' },
      img({ src: entry.image, alt: entry.title }),
      h4(entry.title),
      p(entry.description),
      a({ href: entry.path }, 'Learn more'),
    )));

  return div(
    div({ class: 'search-heads-block' },
      h3('Product Information',
        // TODO: count
        span({ class: 'search-count-result' }, `${firstPage.length} of ${result.length} results`)),
    ),
    ...resultDivs,
  );
}

/**
 *
 * @param params
 * @return {Promise<SearchResults>}
 */
async function searchKnowledgebase(params) {
  const locale = 'en';
  const response = await fetch(`https://zemax.zendesk.com/api/v2/help_center/articles/search?${
    new URLSearchParams({
      page: 1,
      page_count: 1,
      per_page: 12,
      query: params.searchTerm,
      sort_order: 'desc',
      locale,
    })}`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}

function trimToLength(number, text) {
  if (text.length <= number) {
    return text;
  }
  const substringBody = text.trim().substring(0, number);
  const wordsArray = substringBody.split(' ');
  // removes the last word from the array to avoid cut-off words.
  const wordsArrayWithoutLast = wordsArray.slice(0, -1);
  return `${wordsArrayWithoutLast.join(' ')}...`;
}

async function createKnowledgebaseResult(params) {
  const searchResults = await searchKnowledgebase(params);
  const firstPage = searchResults.results;

  const resultDivs = firstPage
    .map((item) => {
      const textBody = document.createElement('div');
      textBody.innerHTML = item.body;

      return (div({ class: '' },
        a({ href: item.html_url, target: '_blank' },
          h4(item.title),
        ),
        p(trimToLength(233, textBody.textContent)),
      ));
    });

  return div(
    div({ class: 'search-heads-block' },
      h3('Knowledgebase',
        // TODO: count
        span({ class: 'search-count-result' }, `${firstPage.length} of ${searchResults.count} results`)),
      a({
        href: `https://support.zemax.com/hc/en-us/search?query=${params.searchTerm}`,
        class: 'learn-more learn-classNamearrow',
        target: '_blank',
        rel: 'null noopener',
      }, 'Search the Knowledgebase'),
    ),
    ...resultDivs,
  );
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
    block.append(await createProductInformationResult(params));
  }
  if (params.view === 'resources') {
    block.append(await createResourceResult(params));
  }
  if (params.view === 'knowledgebase') {
    block.append(await createKnowledgebaseResult(params));
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
