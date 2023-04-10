import { decorateIcons } from '../../scripts/lib-franklin.js';
import { createTag } from '../../scripts/scripts.js';

let elementsWithEventListener = [];
const mql = window.matchMedia('only screen and (min-width: 1024px)');

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
  const cssclass = breakpoint === 'mobile' ? 'mobile-search-container' : 'search-container';

  let searchHTML = '<div class=\'search-form\'><form action=\'/search\' method=\'get\'><input type=\'text\' name=\'q\' class=\'search-input\'/><input type=\'hidden\' name=\'options[prefix]\' value=\'last\' aria-hidden=\'true\' /><button class=\'search-button\'><span class=\'icon icon-search\' ></span></button></form> </div><div class=\'search-close\'> <button type=\'button\' class=\'close-button\'> <span  class=\'icon icon-search-close\'></span></button></div>';
  if (breakpoint === 'mobile') {
    searchHTML = '<div class=\'search-form\'><form action=\'/search\' method=\'get\'><button class=\'search-button\'><span class=\'icon icon-search\' ></span></button><input type=\'text\' name=\'q\' class=\'search-input\'/><input type=\'hidden\' name=\'options[prefix]\' value=\'last\' aria-hidden=\'true\' /></form> </div><div class=\'search-close\'> <button type=\'button\' class=\'close-button\'> <span  class=\'icon icon-search-close\'></span></button></div>';
  }
  const searchContainer = createTag('div', { class: cssclass, 'aria-expanded': false }, searchHTML);
  return searchContainer;
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
    hamburger.innerHTML = '<span class=\'icon icon-mobile-menu\'></span>';

    const expandHamburger = () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      document.querySelector('main').style.visibility = expanded
        ? ''
        : 'hidden';
      if (!expanded) hamburger.innerHTML = '<span class=\'icon icon-search-close\'><svg viewBox=\'0 0 40 40\'><path d=\'M23.868 20.015L39.117 4.78c1.11-1.108 1.11-2.77 0-3.877-1.109-1.108-2.773-1.108-3.882 0L19.986 16.137 4.737.904C3.628-.204 1.965-.204.856.904c-1.11 1.108-1.11 2.77 0 3.877l15.249 15.234L.855 35.248c-1.108 1.108-1.108 2.77 0 3.877.555.554 1.248.831 1.942.831s1.386-.277 1.94-.83l15.25-15.234 15.248 15.233c.555.554 1.248.831 1.941.831s1.387-.277 1.941-.83c1.11-1.109 1.11-2.77 0-3.878L23.868 20.015z\' class=\'layer\'></path></svg></span>';
      else hamburger.innerHTML = '<span class=\'icon icon-mobile-menu\'><svg aria-hidden=\'true\' focusable=\'false\'  viewBox=\'0 0 37 40\'><path d=\'M33.5 25h-30c-1.1 0-2-.9-2-2s.9-2 2-2h30c1.1 0 2 .9 2 2s-.9 2-2 2zm0-11.5h-30c-1.1 0-2-.9-2-2s.9-2 2-2h30c1.1 0 2 .9 2 2s-.9 2-2 2zm0 23h-30c-1.1 0-2-.9-2-2s.9-2 2-2h30c1.1 0 2 .9 2 2s-.9 2-2 2z\'></path></svg></span>';
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
      const searchContainer = block.querySelector('.search-container');
      searchContainer.style.display = 'none';
    };
    const showSearchForm = () => {
      const searchContainer = block.querySelector('.search-container');
      if (searchContainer.style.display === 'flex') {
        searchContainer.style.display = 'none';
        searchContainer.setAttribute('aria-expanded', false);
      } else {
        searchContainer.style.display = 'flex';
        searchContainer.setAttribute('aria-expanded', true);
        const closeBtn = searchContainer.querySelector(':scope .search-close .close-button');
        closeBtn.addEventListener('click', closeSearch);
      }
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

    decorateIcons(nav);
    block.append(addSearchForm());
    block.append(nav);

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
