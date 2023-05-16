/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createMetadata = (main, document, originalURL, blogs) => {
  const meta = {};

  // set template for news
  if (originalURL.includes('/news/')) {
    meta.Template = 'news';
  }

  // add title
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  // add description
  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  // add image
  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  // add publish date
  const blog = blogs.find((item) => item.loc === originalURL);
  if (blog.lastmod) {
    meta.PublishDate = blog.lastmod;
  } else {
    const publishDate = main.querySelector('main .section-article-post .article-resources-caption');
    if (publishDate && publishDate.innerHTML) {
      meta.PublishDate = publishDate.innerHTML.replace(/[\n\t]/gm, '');
    }
  }

  // add category
  const categoryLink = document.querySelector('main .section-article-post  .category-name > a');
  if (categoryLink && categoryLink.innerHTML && categoryLink.href) {
    categoryLink.href = `https://main--zemax--hlxsites.hlx.page${categoryLink.pathname}`;
    console.log(categoryLink.href);
    meta.Category = categoryLink;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

const appendSectionDivider = (main, document) => {
  const divider = document.createElement('p');
  divider.textContent = '---';
  main.append(divider);
};

const appendMarketoForm = (main, document) => {
  const formTitle = main.querySelector('.article-resources-form h4')?.textContent;
  const table = document.createElement('table');
  const headTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Marketo';
  th.setAttribute('colspan', 2);
  headTr.append(th);
  table.append(headTr);

  if (formTitle) {
    const formTr = document.createElement('tr');
    ['Form Title', formTitle].forEach((item) => {
      const td = document.createElement('td');
      td.textContent = item;
      formTr.append(td);
    });
    table.append(formTr);
  }

  const divTr = document.createElement('tr');
  ['Div ID', '1004'].forEach((item) => {
    const td = document.createElement('td');
    td.textContent = item;
    divTr.append(td);
  });
  table.append(divTr);
  main.append(table);

  appendSectionDivider(main, document);
};

const appendNewsletterFragment = (main, document) => {
  const table = document.createElement('table');

  const headTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Fragment';
  headTr.append(th);
  table.append(headTr);

  const linkTr = document.createElement('tr');
  const td = document.createElement('td');
  td.textContent = 'https://main--zemax--hlxsites.hlx.page/fragments/subscribe-newsletter-fragment';
  linkTr.append(td);
  table.append(linkTr);

  main.append(table);

  appendSectionDivider(main, document);
};

const addSectionDivider4Title = (main, document) => {
  const h2 = main.querySelector('h2');
  const divider1 = document.createElement('p');
  divider1.textContent = '---';
  if (h2.nextSibling) {
    h2.parentNode.insertBefore(divider1, h2.nextSibling);
  } else {
    h2.parentNode.appendChild(divider1);
  }
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: async ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    appendMarketoForm(main, document);

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'is_authenticated',
      '.skip-link',
      '.cart-popup-wrapper',
      '.icon__fallback-text',
      'header',
      '.category-name',
      '.page-container .article-resources-caption',
      '.page-container .article-resources-form',
      '.mobile-nav__item',
      'footer',
      '.newsletter-background',
      '.visually-hidden',
      '.social-sharing-post',
      'a11y-refresh-page-message',
      'a11y-selection-message',
      "ul[hidden='']",
      'onetrust-consent-sdk',
    ]);

    addSectionDivider4Title(main, document);

    appendNewsletterFragment(main, document);

    // generate metadata block
    const { originalURL } = params;
    const response = await fetch('/tools/importer/data/blogs-lastmod.json');
    const blogs = await response.json();
    createMetadata(main, document, originalURL, blogs);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
