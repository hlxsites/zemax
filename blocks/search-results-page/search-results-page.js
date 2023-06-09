import {
  a, div, h2, h3, h4, h5, img, p, span,
} from '../../scripts/dom-helpers.js';
import {
  buildBlock, decorateBlock, loadBlocks,
} from '../../scripts/lib-franklin.js';
import { createOptimizedPicture } from '../../scripts/scripts.js';

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
    block.append(createProductInformationResult(params));
    block.append(createResourceResult(params, false, 3));
    block.append(createKnowledgebaseResult(params, false, 4));
    block.append(createCommunityResult(params, false));
  }

  if (params.view === 'resources') {
    block.append(createResourceResult(params));
  }
  if (params.view === 'knowledgebase') {
    block.append(createKnowledgebaseResult(params));
  }
  if (params.view === 'community') {
    block.append(createCommunityResult(params));
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
  const page = Number(new URLSearchParams(window.location.search).get('page')) || 1;
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

/**
 *@typedef {Object} FranklinSearchResults
 * @property {number} total
 * @property {number} offset
 * @property {number} limit
 * @property {FranklinResult[]} data
 */

/**
 *@typedef {Object} FranklinResult
 * @property {string} path
 * @property {string} title
 * @property {string} image
 * @property {string} description
 * @property {string} category
 * @property {string} publishdate
 * @property {string} lastModified
 */

/**
 *
 * @param params
 * @param perPage {number}
 * @return {Promise<FranklinSearchResults>}
 */
async function searchResources(params) {
  const resp = await fetch(`${window.location.origin}/query-index.json`);
  const json = await resp.json();
  return json.data
    .filter((entry) => entry.path.startsWith('/blogs'))
    .filter((entry) => (entry.description + entry.title).toLowerCase()
      .includes(params.searchTerm.toLowerCase()));
}

/**
 *
 * @param params
 * @return {Promise<FranklinSearchResults>}
 */
async function searchProducts(params) {
  const resp = await fetch(`${window.location.origin}/query-index.json`);
  const json = await resp.json();
  return json.data
    .filter((entry) => entry.path.startsWith('/pages/') || entry.path.startsWith('/products/'))
    .filter((entry) => (entry.description + entry.title).toLowerCase()
      .includes(params.searchTerm.toLowerCase()));
}

function getPlainTextFromHtml(html) {
  const textBody = document.createElement('div');
  textBody.innerHTML = html;
  return textBody;
}

function createProductInformationResult(params) {
  const resultsDiv = div({ class: 'search-result-section productinformation' },
    createSearchSectionTitle('Product Information'),
    div({ class: 'results-loading-spinner' }));

  searchProducts(params).then((result) => {
    const firstPage = result.slice(0, 3);

    const columnsRows = firstPage
      .map((entry) => [
        img({ src: entry.image, alt: entry.title }),
        div(
          h4(getPlainTextFromHtml(entry.title)),
          p(entry.description),
          a({ href: entry.path, class: 'button learn-more' }, 'Learn more'),
        ),
      ]);

    const columnsWrapper = div();
    const columnsBlock = buildBlock('columns', columnsRows);
    columnsBlock.classList.add('columns', 'product-information');
    columnsWrapper.append(columnsBlock);
    decorateBlock(columnsBlock);

    resultsDiv.textContent = '';
    resultsDiv.append(
      createSearchSectionTitle('Product Information', firstPage.length, result.length),
      columnsWrapper,
    );

    // Decorate and load all the newly injected content
    loadBlocks(resultsDiv);

    // eslint-disable-next-line no-console
  }).catch(console.error);

  return resultsDiv;
}

/**
 *
 * @param page {number}
 * @param totalPages {number}
 * @return {Element}
 */
function createPagination(page, totalPages) {
  const wrapper = div();
  const pagination = buildBlock('pagination', [
    ['page', page.toString()],
    ['pages', totalPages.toString()],
  ]);
  wrapper.append(pagination);
  decorateBlock(pagination);
  return wrapper;
}

function createResourceResult(params, showPaginationBlock = true, perPage = 12) {
  const resultsDiv = div({ class: 'search-result-section resources' },
    createSearchSectionTitle('Resources'),
    div({ class: 'results-loading-spinner' }));

  searchResources(params).then((result) => {
    const firstPage = result.slice((params.page - 1) * perPage, params.page * perPage);

    function getCategoryFromPath(path) {
      if (path.startsWith('/blogs/news')) return 'News';
      if (path.startsWith('/blogs/webinars')) return 'Webinar';
      if (path.startsWith('/blogs/free-tutorials')) return 'Free Tutorials';
      if (path.startsWith('/blogs/eguides')) return 'eGuide';
      if (path.startsWith('/blogs/success-stories')) return 'Success Story';
      return '';
    }

    const cardRows = firstPage
      .map((entry) => [
        createOptimizedPicture(entry.image, entry.title),
        div(
          h5(getCategoryFromPath(entry.path)),
          p(entry.title),
          p({ class: 'button-container' },
            a({ href: entry.path, class: 'button' }, 'Learn more'),
          ),
        ),
      ]);

    const cardsWrapper = div();
    const cardsBlock = buildBlock('cards', cardRows);
    cardsBlock.classList.add('layout-3-card', 'search-results', 'resource-center', 'curved-text', 'orange');
    cardsWrapper.append(cardsBlock);
    decorateBlock(cardsBlock);

    resultsDiv.textContent = '';
    resultsDiv.append(createSearchSectionTitle('Resources', firstPage.length, result.length));
    resultsDiv.append(cardsWrapper);
    if (showPaginationBlock) {
      resultsDiv.append(createPagination(params.page, Math.ceil(result.length / perPage)));
    }

    // Decorate and load all the newly injected content
    loadBlocks(resultsDiv);
    // eslint-disable-next-line no-console
  }).catch(console.error);

  return resultsDiv;
}

/**
 * @typedef {Object} ZendeskSearchResults
 * @property {number} count - The total count of results.
 * @property {string} next_page - The URL to the next page of results.
 * @property {number} page - The current page number.
 * @property {number} page_count - The total count of pages.
 * @property {number} per_page - The number of results per page.
 * @property {?string} previous_page - URL to previous page of results. Null on first page.
 * @property {Array.<ZendeskResult>} results - The array of results.
 */

/**
 * @typedef {Object} ZendeskResult
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
 * @property {?number} user_segment_id - The unique identifier of the user segment.
 * @property {number} permission_group_id - The unique identifier of the permission group.
 * @property {Array.<number>} content_tag_ids - The array of content tag identifiers.
 * @property {Array.<string>} label_names - The array of label names.
 * @property {string} body - The HTML body content.
 * @property {string} snippet - The snippet content.
 * @property {string} result_type - The type of the result.
 */

/**
 *
 * @param params
 * @param perPage {number}
 * @return {Promise<ZendeskSearchResults>}
 */
async function searchKnowledgebase(params, perPage) {
  const locale = 'en-us';
  const response = await fetch(`https://zemax.zendesk.com/api/v2/help_center/articles/search?${
    new URLSearchParams({
      page: params.page,
      per_page: perPage,
      query: params.searchTerm,
      sort_order: 'desc',
      locale,
    })}`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}

/**
 * @typedef {Object} CommunityPost
 * @property {string} contentType - The type of content.
 * @property {string} id - The ID of the post.
 * @property {string} publicId - The public ID of the post.
 * @property {string} title - The title of the post.
 * @property {string} content - The content of the post.
 * @property {string} featuredImage - The featured image of the post.
 * @property {string} publicLabel - The public label of the post.
 * @property {string} categoryId - The ID of the post's category.
 * @property {string} categoryName - The name of the post's category.
 * @property {string[]} tags - The tags of the post.
 * @property {string[]} moderatorTags - The moderator tags of the post.
 * @property {string} moderationLabel - The moderation label of the post.
 * @property {number} replyCount - The number of replies to the post.
 * @property {number} likes - The number of likes on the post.
 * @property {number} votes - The number of votes on the post.
 * @property {number} views - The number of views of the post.
 * @property {string[]} voteSet - The set of votes on the post.
 * @property {string[]} likeSet - The set of likes on the post.
 * @property {boolean} trashed - Whether the post has been trashed.
 * @property {boolean} sticky - Whether the post is sticky.
 * @property {boolean} bestAnswer - Whether the post is the best answer.
 * @property {Object} author - The author of the post.
 * @property {Object} lastContributor - The last contributor to the post.
 * @property {string} createdAt - The timestamp when the post was created.
 * @property {string} lastActivityAt - The timestamp of the last activity on the post.
 * @property {string} status - The status of the post.
 * @property {Object} ideaStatus - The status of the idea in the post.
 * @property {string[]} productAreas - The product areas related to the post.
 * @property {string} lastPostId - The ID of the last post in the thread.
 * @property {string} publishedAt - The timestamp when the post was published.
 */

/**
 *
 * @param params
 * @return {Promise<Array<CommunityPost>>}
 */
async function searchCommunity(params) {
  const response = await fetch(`https://zemaxportalfunctions.azurewebsites.net/api/insided_search?${
    new URLSearchParams({
      pageSize: 12,
      page: 1,
      q: params.searchTerm,
    })}`, {
    headers: {
      authsdi: 'iddqd',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await response.json();
  return json.result;
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

function createSearchSectionTitle(title, resultCount, totalResultCount, moreLink) {
  return div({ class: 'search-result-section-header' },
    h3(title,
      resultCount && totalResultCount ? span({ class: 'search-count-result' }, `${resultCount} of ${totalResultCount} results`) : '',
      resultCount && !totalResultCount ? span({ class: 'search-count-result' }, `showing first ${resultCount} results`) : '',
    ),
    moreLink || '',
  );
}

function createKnowledgebaseResult(params, showPaginationBlock = true, perPage = 12) {
  const resultsDiv = div({ class: 'search-result-section knowledgebase' },
    createSearchSectionTitle('Knowledgebase'),
    div({ class: 'results-loading-spinner' }));

  searchKnowledgebase(params, perPage).then((searchResults) => {
    let resultElements;
    try {
      resultElements = searchResults.results
        .map((item) => {
          const textBody = document.createElement('div');
          textBody.innerHTML = item.body;

          return (div({ class: '' },
            a({ href: item.html_url, target: '_blank' },
              h4(item.title),
              p(trimToLength(233, textBody.textContent)),
            ),
          ));
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      resultElements = [p('Unable to load results.')];
    }

    const moreLink = a({
      href: `https://support.zemax.com/hc/en-us/search?query=${params.searchTerm}`,
      class: 'learn-more learn-classNamearrow',
      target: '_blank',
      rel: 'null noopener',
    }, 'Search the Knowledgebase');

    resultsDiv.textContent = '';
    resultsDiv.append(createSearchSectionTitle('Knowledgebase', searchResults?.results?.length, searchResults?.count, moreLink));
    resultsDiv.append(...resultElements,
    );

    if (showPaginationBlock) {
      resultsDiv.append(createPagination(params.page, searchResults.page_count));
    }

    // Decorate and load all the newly injected content
    loadBlocks(resultsDiv);
  });

  return resultsDiv;
}

function createCommunityResult(params, paginate = true) {
  function convertToSlug(Text) {
    return Text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '-')
      .replace('---', '-')
      .replace('--', '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  function getRelativeDate(dateString) {
    const date = new Date(dateString);
    const dateCurrent = new Date();
    const lastDay = Math.ceil((date - dateCurrent) / 1000 / 3600 / 24) * (-1);
    let day = 'day';
    if (parseInt(lastDay, 10) > 1) day = 'days';

    return `${lastDay} ${day} ago`;
  }

  const resultsDiv = div({ class: 'search-result-section community' },
    createSearchSectionTitle('Community'),
    div({ class: 'results-loading-spinner' }));

  searchCommunity(params).then((searchResults) => {
    let resultElements;
    try {
      resultElements = searchResults
        .map((item) => {
          const categorySlug = `${convertToSlug(item.categoryName)}-${item.categoryId}`;
          const postSlug = `${convertToSlug(item.title)}-${item.publicId}`;
          const url = `https://community.zemax.com/${categorySlug}/${postSlug}`;
          const link = a({ class: 'search-community-block', href: url, target: '_blank' },
            h4(item.title),
            p(),
          );

          link.querySelector('p').innerHTML = `
          Last Post: <strong>${(getRelativeDate(item.lastActivityAt))}</strong> 
          | Replies: <strong>${item.replyCount}</strong>`;
          return link;
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      resultElements = [p('Unable to load results.')];
    }
    const moreLink = a({
      href: `https://support.zemax.com/hc/en-us/search?query=${params.searchTerm}`,
      class: 'learn-more learn-classNamearrow',
      target: '_blank',
      rel: 'null noopener',
    }, 'Search the Community');

    resultsDiv.textContent = '';
    resultsDiv.append(createSearchSectionTitle('Community', searchResults?.length, null, moreLink));
    resultsDiv.append(...resultElements);
    if (paginate) {
      resultsDiv.append(p({ class: 'button-container load-more' }, a({
        class: 'button secondary',
        href: `https://support.zemax.com/hc/en-us/search?query=${params.searchTerm}`,
      }, 'Load More results')));
    }
    // Decorate and load all the newly injected content
    loadBlocks(resultsDiv);
  });

  return resultsDiv;
}
