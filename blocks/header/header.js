import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { createTag } from '../../scripts/scripts.js';

function isExapndable(ele) {
  let result = false; 
  const adjacentElement = ele.nextElementSibling;  
  if(adjacentElement && (
    adjacentElement.querySelector('ul') || 
    adjacentElement.querySelector('p') )){
    result=true;
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

function addEventListenersMobile() {
  clearAllTabIndex();

  const toggleMenu = (item) => {
    const expanded = item.getAttribute('aria-expanded') === 'true';
    collapseAllSubmenus(item.closest('li'));
    item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  };

  document.querySelectorAll('.menu-expandable, .m-expandable-title').forEach((title) => {
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

  elementsWithEventListener.push(document.querySelector('form .search-button'));
  document.querySelector('form .search-button').addEventListener('click', (e) => {
    const form = e.target.closest('form');
    if (!form.hasAttribute('aria-expanded')) {
      e.preventDefault();
      e.stopPropagation();
      form.setAttribute('aria-expanded', 'true');
    }
  });

  elementsWithEventListener.push(document.querySelector('form .close-button'));
  document.querySelector('form .close-button').addEventListener('click', (e) => {
    const form = e.target.closest('form');
    if (form.hasAttribute('aria-expanded')) {
      e.preventDefault();
      e.stopPropagation();
      form.removeAttribute('aria-expanded');
    }
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
    linkElement.setAttribute('aria-label', `Expand the submenu for ${linkElement.querySelector('a').innerText}`);

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

  const searchButton = document.querySelector('.nav-tools form');
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
  hamburger.innerHTML = '<span class="icon icon-mobile-menu"></span>';

  const expandHamburger = () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    document.body.style.overflowY = expanded ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.querySelector('main').style.visibility = expanded ? '' : 'hidden';
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


  nav.querySelector(':scope > div').insertBefore(hamburger, nav.querySelector('.nav-menu'));
  nav.setAttribute('aria-expanded', 'false');

  // link section
  const navMenuUl = createTag('ul');
  const menus = [...nav.querySelectorAll('.nav-menu > div')];
  
  for (let i = 0; i < menus.length ;i=i+2) {
    const li = createTag('li');
    const menuTitle = menus[i];
    const expandable = isExapndable(menuTitle);
    if(!expandable) i = i-1;

    const menuDropdownList = menus[i + 1];
    menuTitle.classList.add('menu-nav-category');
  
   li.append(menuTitle);
   if(expandable && menuDropdownList){
    li.classList.add('menu-expandable');
    menuDropdownList.classList.add('menu-nav-dropdown');
    addDropdownIcon(menuTitle);
    li.append(menuDropdownList);
   }
     navMenuUl.append(li);
  }
  nav.querySelector('.nav-menu').innerHTML = navMenuUl.outerHTML;

  decorateIcons(nav);
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
    };

    reAttachEventListeners();
  }
}
