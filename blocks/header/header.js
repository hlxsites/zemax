import { decorateIcons, fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';
import { button, domEl, span } from '../../scripts/dom-helpers.js';
import { createTag, decorateLinkedPictures, loadScriptPromise } from '../../scripts/scripts.js';

let elementsWithEventListener = [];
const mql = window.matchMedia('only screen and (min-width: 1024px)');
let webauth;

function collapseAllSubmenus(menu) {
  menu
    .querySelectorAll('*[aria-expanded="true"]')
    .forEach((el) => el.setAttribute('aria-expanded', 'false'));
}

function clearAllTabIndex() {
  document.querySelectorAll('.nav-menu *[tabindex]').forEach((element) => {
    element.removeAttribute('tabindex');
  });
}

function wrapChildren(element, newType) {
  const wrapper = createTag(newType);
  wrapper.innerHTML = element.innerHTML;
  element.innerHTML = '';
  element.append(wrapper);
}

function isExpandable(element) {
  let result = false;
  const adjacentElement = element.nextElementSibling;
  if (
    adjacentElement
    && (adjacentElement.querySelector('ul') || adjacentElement.querySelector('p'))
  ) {
    result = true;
  }
  return result;
}

function addDropdownIcon(element) {
  element.append(
    button({ class: 'dropdown-button', 'aria-label': 'menu drop down button' },
      span({ class: 'icon icon-dropdown' }),
    ));
}

function createSearchForm(breakpoint) {
  if (breakpoint === 'mobile') {
    const container = createTag('div', { class: 'mobile-search-container', 'aria-expanded': false }, `
      <div class='search-form'>
        <form action='/search' method='get'>
          <button class='search-button'><span class='icon icon-search'></span></button>
          <input type='text' name='q' class='search-input' />
          <input type='hidden' name='options[prefix]' value='last' aria-hidden='true' />
        </form>
      </div>
      <div class='search-close'>
        <button type='button' class='clear-input'><span class='icon icon-search-close'></span></button>
      </div>`);
    container.querySelector('.clear-input').addEventListener('click', () => {
      container.querySelector('.search-input').value = '';
      container.querySelector('.search-input').focus();
    });
    return container;
  }
  // desktop
  const dialog = domEl('dialog', { class: 'search-container', 'aria-expanded': false });
  dialog.innerHTML = `
    <div class='search-wrapper'>
      <div class='search-form'>
        <form action='/search' method='get'>
          <input type='text' name='q' class='search-input' />
          <input type='hidden' name='options[prefix]' value='last' aria-hidden='true' />
          <button class='search-button'><span class='icon icon-search'></span></button>
          <button type='button' class='close-button'><span class='icon icon-search-close'></span></button>
        </form>
      </div>
    </div>`;
  return dialog;
}

function addEventListenersMobile() {
  clearAllTabIndex();

  const toggleMenuItem = (item) => {
    const expanded = item.getAttribute('aria-expanded') === 'true';
    collapseAllSubmenus(item.closest('nav'));
    item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  };

  document
    .querySelectorAll('.menu-expandable, .m-expandable-title')
    .forEach((title) => {
      elementsWithEventListener.push(title);
      title.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenuItem(title);
      });
    });

  document.querySelectorAll('.nav-menu .icon-dropdown').forEach((dropdown) => {
    elementsWithEventListener.push(dropdown);
    dropdown.setAttribute('aria-label', 'Open section');
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggleMenuItem(dropdown.closest('.menu-expandable, .m-expandable-title'));
      }
    });
  });
}

function addEventListenersDesktop() {
  clearAllTabIndex();

  function expandMenu(element) {
    const expanded = element.getAttribute('aria-expanded') === 'true';
    collapseAllSubmenus(element.closest('ul'));
    element.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  }

  document.querySelectorAll('.menu-expandable').forEach((linkElement) => {
    elementsWithEventListener.push(linkElement);
    linkElement.setAttribute('tabindex', '0');
    linkElement.setAttribute(
      'aria-label',
      `Expand the submenu for ${linkElement.querySelector('div, p').innerText}`,
    );

    linkElement.addEventListener('keydown', (e) => {
      if (e.key === ' ' && e.target === linkElement) {
        e.preventDefault();
        e.stopPropagation();
        expandMenu(linkElement);
      }
    });
  });

  document.querySelectorAll('.nav-menu > ul > li').forEach((title) => {
    elementsWithEventListener.push(title);
    title.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      expandMenu(title);
    });

    title.addEventListener('mouseleave', () => {
      collapseAllSubmenus(document.querySelector('nav'));
    });
  });

  const searchButton = document.querySelector('.search-container form');
  if (searchButton.hasAttribute('aria-expanded')) searchButton.removeAttribute('aria-expanded');
}

function reAttachEventListeners() {
  const categoryDivs = document.querySelectorAll('.menu-nav-category');
  for (let i = 0; i < categoryDivs.length; i += 1) {
    const categoryDiv = categoryDivs[i];

    const dropdownDiv = categoryDiv.nextElementSibling;
    if (!(dropdownDiv && dropdownDiv.classList.contains('menu-nav-dropdown'))) {
      elementsWithEventListener.push(categoryDiv);
      categoryDiv.addEventListener('click', (e) => {
        const anchorLink = categoryDiv.querySelector('a');
        if (anchorLink && anchorLink.href) {
          window.location.href = anchorLink.href;
        }
        e.stopPropagation();
      });
    }
  }

  if (mql.matches) {
    addEventListenersDesktop();
  } else {
    addEventListenersMobile();
  }
}

async function login() {
  await initializeAuthLibrary();
  webauth.authorize();
}

async function logout(e) {
  e.preventDefault();
  localStorage.clear();
  await initializeAuthLibrary();
  if (!webauth) {
    window.location.assign(`${window.location.origin}`);
  } else {
    webauth.logout({
      returnTo: `${window.location.origin}`,
      clientID: 'Q5pG8LI2Ej3IMrT3LOr4jv0HPJ4kjIeJ',
    });
  }
}

function isDesktopNavigation() {
  return document.querySelector('nav').getAttribute('aria-expanded') !== 'true';
}

// utility to attach logout listeners
function attachLogoutListener(ele) {
  ele.removeEventListener('click', login);
  ele.addEventListener('mouseenter', () => {
    // only do if not on mobile
    if (isDesktopNavigation()) {
      ele.setAttribute('aria-expanded', 'true');
    }
  });
  ele.addEventListener('mouseleave', () => {
    if (isDesktopNavigation()) {
      ele.setAttribute('aria-expanded', 'false');
    }
  });
  const logoutLink = ele.querySelector('ul > li:nth-of-type(2)');
  logoutLink.addEventListener('click', logout);
}

// manage user info in local storage and attach events
async function handleAuthenticationTokens(loginLinkWrapper) {
  await initializeAuthLibrary();

  webauth.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Successful login, store tokens in localStorage
      window.location.hash = '';
      window.location.pathname = '/';
      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('idToken', authResult.idToken);
      const base64Url = authResult.idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join(''),
      );
      const userData = JSON.parse(jsonPayload);
      localStorage.setItem('displayname', `${userData.name.slice(0, userData.name.indexOf(' ') + 2)}.`);
      localStorage.setItem('auth0_id', userData.sub);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('fullname', userData.name);
      attachLogoutListener(loginLinkWrapper);

      handleAuthenticated(loginLinkWrapper);
    } else if (err) {
      // eslint-disable-next-line no-console
      console.log(`Unable to authenticate with error ${err}`);
    }
  });
}

// if user already authenticated
function handleAuthenticated(loginLinkWrapper) {
  loginLinkWrapper.querySelector('p').innerText = localStorage.getItem('displayname');
  attachLogoutListener(loginLinkWrapper);
}

function getRedirectUri() {
  if (window.location.pathname.startsWith('/pages/profile')) {
    return window.location.origin + window.location.pathname;
  }
  return window.location.origin;
}

/**
 *
 * @param title {HTMLElement}
 * @param content {HTMLElement}
 */
function makeExpandable(title, content) {
  addDropdownIcon(title);
  title.setAttribute('aria-expanded', 'false');
  title.classList.add('m-expandable-title');
  wrapChildren(title, 'span');

  content.classList.add('m-expandable-list');
}

async function initializeAuthLibrary() {
  const placeholders = await fetchPlaceholders();
  const domain = placeholders.auth0domain;
  const clientID = placeholders.clientid;
  const audience = placeholders.audienceuri;
  const responseType = placeholders.responsetype;
  const { scope } = placeholders;

  await loadScriptPromise('/scripts/auth0.min.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
  });
  // eslint-disable-next-line no-undef
  webauth = new auth0.WebAuth({
    domain, clientID, redirectUri: getRedirectUri(), audience, responseType, scope,
  });
}

// authentication related functions
/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.innerHTML = '';
  // fetch nav content
  const resp = await fetch('/nav.plain.html');

  if (resp.ok) {
    // decorate nav DOM
    const nav = createTag('nav');
    nav.innerHTML = await resp.text();

    // hamburger
    const hamburger = createTag('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<span class="icon icon-mobile-menu"></span>';

    const expandHamburger = () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      document.querySelector('main').style.visibility = expanded
        ? ''
        : 'hidden';
      if (!expanded) {
        hamburger.innerHTML = '<span class="icon icon-search-close"></span>';
      } else {
        hamburger.innerHTML = '<span class="icon icon-mobile-menu"></span>';
      }
      decorateIcons(hamburger);
    };

    hamburger.setAttribute('tabindex', '0');
    hamburger.addEventListener('click', expandHamburger);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        expandHamburger();
      }
    });

    nav
      .querySelector(':scope > div')
      .insertBefore(hamburger, nav.querySelector('.nav-menu'));
    nav.setAttribute('aria-expanded', 'false');

    // add event to open search form
    const closeSearch = () => {
      block.querySelector('.search-container').close();
    };
    const showSearchForm = () => {
      const searchContainer = block.querySelector('.search-container');
      searchContainer.showModal();
      searchContainer.addEventListener('click', (event) => {
        // only react to clicks outside the dialog. https://stackoverflow.com/a/70593278/79461
        const dialogDimensions = searchContainer.getBoundingClientRect();
        if (event.clientX < dialogDimensions.left || event.clientX > dialogDimensions.right
          || event.clientY < dialogDimensions.top || event.clientY > dialogDimensions.bottom) {
          searchContainer.close();
        }
      });
      searchContainer.querySelector('.close-button').addEventListener('click', closeSearch);
    };

    const searchIcon = nav.querySelector(':scope .nav-tools .icon-search');
    searchIcon.addEventListener('click', showSearchForm);
    searchIcon.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        showSearchForm();
      }
    });

    // handle login
    const loginLinkWrapper = nav.querySelector(':scope .nav-tools div:nth-of-type(2)');
    loginLinkWrapper.classList.add('login-wrapper', 'menu-expandable');
    if (localStorage.getItem('accessToken')) {
      handleAuthenticated(loginLinkWrapper);
    } else {
      loginLinkWrapper.setAttribute('aria-expanded', 'false');
      loginLinkWrapper.setAttribute('role', 'link');
      loginLinkWrapper.setAttribute('aria-label', 'click on link to login');

      if (window.location.hash.includes('access_token') || window.location.hash.includes('error')) {
        // noinspection ES6MissingAwait
        handleAuthenticationTokens(loginLinkWrapper);
      }
      loginLinkWrapper.addEventListener('click', login);
      if (getMetadata('authrequired')) {
        // noinspection ES6MissingAwait
        login();
      }
    }

    // link section
    const navMenuUl = createTag('ul');
    const menus = [...nav.querySelectorAll('.nav-menu > div')];

    // additional links
    const additionalLinks = nav.querySelector(':scope .nav-tools div:nth-of-type(3)');
    additionalLinks.classList.add('additional-links');
    additionalLinks.querySelector('a').classList.add('button', 'secondary');

    // search form
    const searchli = createTag('li', { class: 'mobile-search' });
    searchli.append(createSearchForm('mobile'));
    navMenuUl.append(searchli);

    for (let i = 0; i < menus.length; i += 2) {
      const li = createTag('li');
      const menuTitle = menus[i];
      const expandable = isExpandable(menuTitle);
      if (!expandable) i -= 1;

      const menuDropdownList = menus[i + 1];
      menuTitle.classList.add('menu-nav-category');

      li.append(menuTitle);
      if (expandable && menuDropdownList) {
        li.classList.add('menu-expandable');
        menuDropdownList.classList.add('menu-nav-dropdown');
        addDropdownIcon(menuTitle);

        // Add class name for each column in dropdown
        ['m-col-1', 'm-col-2'].forEach((category, j) => {
          const node = menuDropdownList.querySelector(`:scope > div:nth-child(${j + 1})`);
          node?.classList.add(category, 'column');
          if (node?.children.length === 0) {
            node?.classList.add('empty');
          }
          li.append(menuDropdownList);
          // Add second-level expansion even listener
          li.querySelectorAll('p + ul').forEach((subDropdown) => {
            const subDropdownTitle = subDropdown.previousElementSibling;
            makeExpandable(subDropdownTitle, subDropdown);
          });
        });
      }
      navMenuUl.append(li);
    }

    nav.querySelector('.nav-menu').append(navMenuUl);

    decorateLinkedPictures(nav);
    block.append(createSearchForm());
    block.append(nav);
    decorateIcons(block);
    // Handle different event listeners for mobile/desktop on window resize
    const removeAllEventListeners = () => {
      elementsWithEventListener.forEach((el) => {
        el.replaceWith(el.cloneNode(true));
      });
      elementsWithEventListener = [];
    };

    mql.onchange = () => {
      nav.setAttribute('aria-expanded', 'false');
      document.querySelector('main').style.visibility = '';
      removeAllEventListeners();
      collapseAllSubmenus(block);
      reAttachEventListeners();
      closeSearch();
    };

    reAttachEventListeners();
  }
}
