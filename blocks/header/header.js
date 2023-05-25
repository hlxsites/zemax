import { decorateIcons, fetchPlaceholders } from '../../scripts/lib-franklin.js';
import { createTag, decorateLinkedPictures, loadScript } from '../../scripts/scripts.js';
import { domEl } from '../../scripts/dom-helpers.js';

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

function isExapndable(element) {
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
  const dropdownButton = document.createElement('button');
  const dropdownArrow = document.createElement('span');
  dropdownArrow.classList.add('icon', 'icon-dropdown');
  dropdownButton.append(dropdownArrow);
  dropdownButton.classList.add('dropdown-button');
  element.append(dropdownButton);
}

function addSearchForm(breakpoint) {
  if (breakpoint === 'mobile') {
    return createTag('div', { class: 'mobile-search-container', 'aria-expanded': false }, `
      <div class='search-form'>
        <form action='/search' method='get'>
          <button class='search-button'><span class='icon icon-search'></span></button>
          <input type='text' name='q' class='search-input' />
          <input type='hidden' name='options[prefix]' value='last' aria-hidden='true' />
        </form>
      </div>
      <div class='search-close'>
        <button type='button' class='close-button'><span class='icon icon-search-close'></span></button>
      </div>`);
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

  const toggleMenu = (item) => {
    const expanded = item.getAttribute('aria-expanded') === 'true';
    collapseAllSubmenus(item.closest('li'));
    item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  };

  document
    .querySelectorAll('.menu-expandable, .m-expandable-title')
    .forEach((title) => {
      elementsWithEventListener.push(title);
      title.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(title);
      });
    });

  document.querySelectorAll('.nav-menu .icon-dropdown').forEach((dropdown) => {
    elementsWithEventListener.push(dropdown);
    dropdown.setAttribute('aria-label', 'Open section');
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(dropdown.closest('.menu-expandable, .m-expandable-title'));
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
      `Expand the submenu for ${linkElement.querySelector('div').innerText}`,
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
  if (mql.matches) {
    addEventListenersDesktop();
  } else {
    addEventListenersMobile();
  }
}

// authentication related functions
function initializeAuth(domain, clientID, audience, responseType, scope) {
  // eslint-disable-next-line no-undef
  return new auth0.WebAuth({
    domain: `${domain}`,
    clientID: `${clientID}`,
    redirectUri: `${window.location.origin}`,
    audience: `${audience}`,
    responseType: `${responseType}`,
    scope: `${scope}`,
  });
}

// login call
function login() {
  webauth.authorize();
}

// logout call
function logout() {
  localStorage.clear();
  if (webauth === undefined) {
    window.location.assign(`${window.location.origin}`);
  } else {
    webauth.logout({
      returnTo: `${window.location.origin}`,
      clientID: 'Q5pG8LI2Ej3IMrT3LOr4jv0HPJ4kjIeJ',
    });
  }
}

// utility to attach logout listeners
function attachLogoutListener(ele) {
  ele.removeEventListener('click', login);
  ele.addEventListener('mouseenter', () => {
    ele.setAttribute('aria-expanded', 'true');
  });
  ele.addEventListener('mouseleave', () => {
    ele.setAttribute('aria-expanded', 'false');
  });
  const logoutLink = ele.querySelector('ul > li:nth-of-type(2)');
  logoutLink.addEventListener('click', logout);
}

// manage user info in local storage and attach events
function handleAuthentication(ele) {
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
      const logintxt = ele.querySelector('p');
      const displayname = `${userData.name.slice(0, userData.name.indexOf(' ') + 2)}.`;
      logintxt.innerText = displayname;
      localStorage.setItem('displayname', displayname);
      localStorage.setItem('auth0_id', userData.sub);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('fullname', userData.name);
      attachLogoutListener(ele);
    } else if (err) {
      // eslint-disable-next-line no-console
      console.log(`Unable to authenticate with error ${err}`);
    }
  });
}

// if user already authenticated
function handleAuthenticated(ele) {
  const logintxt = ele.querySelector('p');
  logintxt.innerText = localStorage.getItem('displayname');
  attachLogoutListener(ele);
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.innerHTML = '';
  // fetch nav content
  const resp = await fetch('/nav.plain.html');

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = createTag('nav');
    nav.innerHTML = html;

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
      if (!expanded) hamburger.innerHTML = '<span class="icon icon-search-close"></span>';
      else hamburger.innerHTML = '<span class="icon icon-mobile-menu"></span>';
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

    // adding login functionality
    const authtoken = localStorage.getItem('accessToken');
    const loginLink = nav.querySelector(':scope .nav-tools div:nth-of-type(2)');
    loginLink.classList.add('login-wrapper');
    const authScriptTag = loadScript('/scripts/auth0.min.js', {
      type: 'text/javascript',
      charset: 'UTF-8',
    });
    const placeholders = await fetchPlaceholders();
    const domain = placeholders.auth0domain;
    const clientID = placeholders.clientid;
    const audienceURI = placeholders.audienceuri;
    const responseType = placeholders.responsetype;
    const scopes = placeholders.scope;
    if (!authtoken) {
      loginLink.setAttribute('aria-expanded', 'false');
      authScriptTag.onload = () => {
        webauth = initializeAuth(domain, clientID, audienceURI, responseType, scopes);
        loginLink.addEventListener('click', login);
        handleAuthentication(loginLink);
      };
    } else {
      authScriptTag.onload = () => {
        webauth = initializeAuth(domain, clientID, audienceURI, responseType, scopes);
      };
      handleAuthenticated(loginLink);
    }
    // link section
    const navMenuUl = createTag('ul');
    const menus = [...nav.querySelectorAll('.nav-menu > div')];

    // search form
    const searchli = createTag('li', { class: 'mobile-search' });
    searchli.append(addSearchForm('mobile'));
    navMenuUl.append(searchli);

    for (let i = 0; i < menus.length; i += 2) {
      const li = createTag('li');
      const menuTitle = menus[i];
      const expandable = isExapndable(menuTitle);
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
            addDropdownIcon(subDropdownTitle);
            subDropdownTitle.setAttribute('aria-expanded', 'false');
            subDropdownTitle.classList.add('m-expandable-title');
            wrapChildren(subDropdownTitle, 'span');
            subDropdown.classList.add('m-expandable-list');
            // addDropdownIcon(subDropdownTitle);
          });
        });
      }
      navMenuUl.append(li);
    }

    nav.querySelector('.nav-menu').innerHTML = navMenuUl.outerHTML;

    decorateLinkedPictures(nav);
    block.append(addSearchForm());
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
