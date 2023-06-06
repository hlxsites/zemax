/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  readBlockConfig,
  toCamelCase,
  decorateButtons,
  decorateIcons,
  decorateBlock,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  toClassName,
} from './lib-franklin.js';

/**
 * manage the list of templates
 */
const TEMPLATE_LIST = ['news'];

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'Zemax'; // add your RUM generation information here

/**
 * Determine if we are serving content for the block-library, if so don't load the header or footer
 * @returns {boolean} True if we are loading block library content
 */
export function isBlockLibrary() {
  return window.location.pathname.includes('block-library');
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
// function buildHeroBlock(main) {
//   const h1 = main.querySelector('h1');
//   const picture = main.querySelector('picture');
//   // eslint-disable-next-line no-bitwise
//   if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
//     const section = document.createElement('div');
//     section.append(buildBlock('hero', { elems: [picture, h1] }));
//     main.prepend(section);
//   }
// }

/**
 * Helper function to create DOM elements
 * @param {string} tag DOM element to be created
 * @param {array} attributes attributes to be added
 */

export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement || html instanceof SVGElement) {
      el.append(html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

export function createForm(config) {
  const form = createTag('form', { id: config.formId }, '');

  config.fields.forEach((field) => {
    const label = createTag('label', { for: field.id }, field.label);
    const input = createTag('input', { type: 'text', id: field.id, name: field.name }, '');

    if (field.value) {
      input.setAttribute('value', field.value);
    }

    if (field.readOnly) {
      input.setAttribute('readonly', '');
    }

    if (field.disabled) {
      input.setAttribute('disabled', '');
    }

    form.appendChild(label);
    form.appendChild(input);
  });

  const submitButton = createTag('input', {
    type: 'submit', id: config.submitId, class: config.submitClass, value: config.submitText, 'data-modal-id': config.submitDataModalId,
  });
  form.appendChild(submitButton);

  return form;
}

// Methods for creating tabs
export function createTabLi(active, ariaControls, isSelected, tabText) {
  const li = document.createElement('li');

  const tabLink = createTag(
    'a',
    {
      href: `#${ariaControls}`,
      class: `tab-link ${active}`,
      role: 'tab',
      'aria-selected': isSelected,
      'aria-controls': ariaControls,
    },
    tabText,
  );
  li.appendChild(tabLink);

  return li;
}

export function createTabContentDiv(tabId, ariaLabelBy, isHidden, content) {
  const div = document.createElement('div');
  div.setAttribute('id', tabId);
  div.classList.add('tab-content');
  div.setAttribute('role', 'tabpanel');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-labelledby', ariaLabelBy);
  div.innerHTML = content;
  if (isHidden) {
    div.setAttribute('hidden', '');
  }

  return div;
}

// Activate a tab by ID
function activateTab(tabId) {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach((link) => {
    link.classList.remove('active');
    link.setAttribute('aria-selected', 'false');
    link.setAttribute('tabindex', '-1');
  });

  // Hide all tab content elements
  tabContents.forEach((content) => {
    content.classList.remove('active');
    content.classList.remove('show');
    content.setAttribute('aria-hidden', 'true');
    content.setAttribute('hidden', '');
  });

  // Activate the selected tab link
  const tabLink = document.querySelector(`.tab-link[href="#${tabId}"]`);
  tabLink.classList.add('active');
  tabLink.setAttribute('aria-selected', 'true');
  tabLink.setAttribute('tabindex', '0');

  // Show the associated tab content element
  const tabContent = document.getElementById(tabId);
  tabContent.classList.add('active');
  tabContent.classList.add('show');
  tabContent.setAttribute('aria-hidden', 'false');
}

export function addTabFeature() {
  // Get all tab links and tab content elements
  const tabLinks = document.querySelectorAll('.tab-link');

  // Handle click event for each tab link
  tabLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Get the ID of the clicked tab link
      const tabId = link.getAttribute('href').substring(1);

      activateTab(tabId);
    });

    // Handle keydown event for each tab link
    link.addEventListener('keydown', (e) => {
      let index = Array.from(tabLinks).indexOf(e.target);

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          index = index > 0 ? index - 1 : tabLinks.length - 1;
          tabLinks[index].focus();
          break;
        case 'ArrowRight':
          e.preventDefault();
          index = index < tabLinks.length - 1 ? index + 1 : 0;
          tabLinks[index].focus();
          break;
        case 'Home':
          e.preventDefault();
          tabLinks[0].focus();
          break;
        case 'End':
          e.preventDefault();
          tabLinks[tabLinks.length - 1].focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          activateTab(e.target.getAttribute('href').substring(1));
          break;
        default:
      }
    });
  });
}

export function createModal(modalTitle, modalBodyInnerContent, modalContentClass, modalBodyClass,
  modalId, modalContainerClass, buttonsConfig) {
  let modalBodyInnerContentHtml = '';
  if (modalBodyInnerContent !== '') {
    modalBodyInnerContentHtml = modalBodyInnerContent.outerHTML;
  }
  const modalHeaderDiv = createTag('div', { class: 'modal-header' }, '');
  const modalTitleH3 = createTag('h3', '', modalTitle);
  const modalCloseButtonIcon = createTag('button', { class: 'modal-close', 'data-modal-id': modalId }, '');
  modalHeaderDiv.appendChild(modalTitleH3);
  modalHeaderDiv.appendChild(modalCloseButtonIcon);

  modalCloseButtonIcon.addEventListener('click', hideModal);

  const modalContentDiv = createTag('div', { class: `modal-content ${modalContentClass}` }, modalHeaderDiv);
  const modalBodyDiv = createTag('div', { class: 'modal-body' }, createTag('div', { class: modalBodyClass }, modalBodyInnerContentHtml));
  modalContentDiv.appendChild(modalBodyDiv);

  const modalFooterDiv = createTag('div', { class: 'modal-footer' }, '');

  buttonsConfig.forEach((buttonConfig) => {
    const { button, userAction, listenerMethod } = buttonConfig;
    button.addEventListener(userAction, listenerMethod);
    modalFooterDiv.appendChild(button);
  });

  modalContentDiv.appendChild(modalFooterDiv);

  const modalModalDiv = createTag('div', { class: `modal-container ${modalContainerClass}`, id: modalId }, modalContentDiv);
  return modalModalDiv;
}

export function showModal(event) {
  const modalId = event.target.getAttribute('data-modal-id');
  if (modalId && document.getElementById(modalId)) {
    document.getElementById(modalId).style.display = 'block';
  }
}

export function hideModal(event) {
  const modalId = event.target.getAttribute('data-modal-id');
  if (modalId && document.getElementById(modalId)) {
    document.getElementById(modalId).style.display = 'none';
  }
}

export function findReplaceJSON(jsonObj, data) {
  Object.keys(jsonObj).forEach((key) => {
    if (typeof jsonObj[key] === 'object' && jsonObj[key] !== null) {
      findReplaceJSON(jsonObj[key], data);
    } else if (typeof jsonObj[key] === 'string') {
      if (jsonObj[key].startsWith('{{') && jsonObj[key].endsWith('}}')) {
        const newValueKey = jsonObj[key].slice(2, -2);
        jsonObj[key] = data[newValueKey];
      }
    }
  });

  return jsonObj;
}

/**
 * @typedef {Object} tableHeadings
 * @property {string} label - table heading label text.
 * @property {Array.<string>} value - The list of strings concatenated to form a single value.
 * @property {string} html - Defines html tag to be created.
 * @property {array} attributes attributes to be added
 */

export function createGenericDataTable(tableHeadings, rowData) {
  const tableElement = document.createElement('table');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  tableHeadings.forEach((heading) => {
    const { label } = heading;
    const tableHeadingElement = createTag('th', { class: '' }, label);
    tr.appendChild(tableHeadingElement);
  });
  thead.appendChild(tr);

  tableElement.appendChild(thead);
  const tbody = document.createElement('tbody');

  rowData.forEach((row) => {
    const trValue = document.createElement('tr');
    tableHeadings.forEach((heading) => {
      const clonedHeading = JSON.parse(JSON.stringify(heading));
      findReplaceJSON(clonedHeading, row);
      if (clonedHeading && clonedHeading.html && clonedHeading.html !== 'td') {
        const tagLabel = clonedHeading.htmlTagLabel ? clonedHeading.htmlTagLabel : '';
        trValue.appendChild(createTag('td', '', createTag(clonedHeading.html, clonedHeading.htmlAttributes, tagLabel)));
      } else {
        trValue.appendChild(createTag('td', clonedHeading.htmlAttributes, clonedHeading.value.join('')));
      }
    });
    tbody.appendChild(trValue);
  });

  tableElement.appendChild(tbody);
  return tableElement;
}

export async function searchResults(index, category) {
  const resp = await fetch(index);
  const json = await resp.json();
  const filteredData = json.data.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  return filteredData.length > 0 ? filteredData : undefined;
}

/**
 * Retrieves the content of a metadata tag
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value
 */
export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const $meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return $meta && $meta.content;
}

function buildPageDivider(main) {
  const allPageDivider = main.querySelectorAll('code');

  allPageDivider.forEach((el) => {
    const alt = el.innerText.trim();
    const lower = alt.toLowerCase();
    if (lower === 'divider') {
      el.innerText = '';
      el.classList.add('divider');
    }
  });
}

function buildPageCategory(main) {
  const category = getMetadata('category');
  const template = getMetadata('template');
  const firstDiv = main.querySelector('div:first-of-type');
  if (category && template !== 'news' && template !== 'category') {
    const categoryDiv = createTag('div', { class: 'category' });
    categoryDiv.innerText = category;
    firstDiv.insertBefore(categoryDiv, firstDiv.firstChild);
  }
}

/**
 * Loads the script in the head section
 * @param {string} url and other attrs
 * @returns script
 */
export function loadScript(url, attrs) {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (attrs) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const attr in attrs) {
      script.setAttribute(attr, attrs[attr]);
    }
  }
  head.append(script);
  return script;
}

export async function loadScriptPromise(url, attrs) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    if (attrs) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const attr in attrs) {
        script.setAttribute(attr, attrs[attr]);
      }
    }

    script.onload = () => resolve(script);
    script.onerror = reject;

    const head = document.querySelector('head');
    head.append(script);
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // buildHeroBlock(main);
    buildPageDivider(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates all blocks in a container element.
 * @param {Element} main The container element
 */
export function decorateBlocks(main) {
  const allSections = main.querySelectorAll('div.section');
  allSections.forEach((section) => {
    main
      .querySelectorAll('div.section > div > div')
      .forEach(decorateBlock);
  });

  const sectionWrapperDiv = main.querySelectorAll('div.section > div.section-wrapper');

  if (sectionWrapperDiv && sectionWrapperDiv.length >= 0) {
    sectionWrapperDiv.forEach(() => {
      main.querySelectorAll('div.section > div > div > div')
        .forEach(decorateBlock);
    });
  }
}

/**
 * Decorates all sections in a container element.
 * @param {Element} main The container element
 */
export function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((e) => {
      if (e.tagName === 'DIV' || !defaultContent) {
        const wrapper = document.createElement('div');
        wrappers.push(wrapper);
        defaultContent = e.tagName !== 'DIV';
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].append(e);
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add('section');
    section.dataset.sectionStatus = 'initialized';
    section.style.display = 'none';

    /* process section metadata */
    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      Object.keys(meta).forEach((key) => {
        if (key === 'style') {
          const styles = meta.style.split(',').map((style) => toClassName(style.trim()));
          styles.forEach((style) => section.classList.add(style));
        } else if (key === 'layout') {
          const sectionWrapper = document.createElement('div');
          sectionWrapper.classList.add('section-wrapper');
          sectionWrapper.classList.add(meta[key].toLowerCase());
          wrappers.forEach((e) => {
            sectionWrapper.append(e);
          });
          section.append(sectionWrapper);
        } else {
          section.dataset[toCamelCase(key)] = meta[key];
        }
      });
      sectionMeta.parentNode.remove();
    }
  });
}

/**
 * Run template specific decoration code.
 * @param {Element} main The container element
 */
async function decorateTemplates(main) {
  try {
    const template = toClassName(getMetadata('template'));
    const templates = TEMPLATE_LIST;
    if (templates.includes(template)) {
      const mod = await import(`../templates/${template}/${template}.js`);
      loadCSS(`${window.hlx.codeBasePath}/templates/${template}/${template}.css`);
      if (mod.default) {
        await mod.default(main);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('template loading failed', error);
  }
}

export function createYoutubeModal(main, vid) {
  const videoContainer = createTag('div', { class: 'video-container' });
  const videoWrap = createTag('div', { class: 'video-wrap' });
  const close = createTag('div', { class: 'video-close' });
  const videoIframe = createTag('iframe', { class: 'video-iframe' });

  videoIframe.setAttribute('src', `https://www.youtube.com/embed/${vid}`);
  videoWrap.append(close, videoIframe);
  videoContainer.append(videoWrap);
  main.append(videoContainer);

  const closeButton = main.querySelector('.video-close');
  const videoContainerDiv = main.querySelector('.video-container');
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      videoContainerDiv.remove();
    });

    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 27 || event.key === 'Escape') {
        videoContainerDiv.remove();
      }
    });
  }
}

export function decorateExternalLinks(main) {
  main.querySelectorAll('a').forEach((a) => {
    const url = new URL(a.href);
    const vid = url.searchParams.get('v');
    if (a.href.includes('youtube.com')) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        createYoutubeModal(main, vid);
      });
    }
  });
}

export function linkPicture(picture) {
  const nextSib = picture.parentNode.nextElementSibling;
  if (nextSib) {
    const a = nextSib.querySelector('a');
    if (a && a.textContent.startsWith('https://')) {
      a.innerHTML = '';
      a.className = '';
      a.appendChild(picture);
    }
  }
}

export function decorateLinkedPictures(main) {
  /* thanks to word online */
  main.querySelectorAll('picture').forEach((picture) => {
    if (!picture.closest('div.block')) {
      const p = picture.parentElement;
      linkPicture(picture);
      if (p.tagName === 'P' && p.childElementCount === 0) {
        p.remove();
      }
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateLinkedPictures(main);
  decorateButtons(main);
  decorateExternalLinks(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  buildPageCategory(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    await decorateTemplates(main);
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

export function formatDate(dateStr, options = {}) {
  const parts = dateStr.split('/');
  const date = new Date(parts[2], parts[0] - 1, parts[1]);

  if (date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      ...options,
    });
  }
  return dateStr;
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  if (!isBlockLibrary()) {
    loadHeader(doc.querySelector('header'));
    loadFooter(doc.querySelector('footer'));
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.ico`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
