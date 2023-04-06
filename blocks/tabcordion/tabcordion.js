import { createTag } from '../../scripts/scripts.js';

const isElementInContainerView = (targetEl) => {
  const rect = targetEl.getBoundingClientRect();
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const scrollTabIntoView = (e) => {
  const isElInView = isElementInContainerView(e);
  /* c8 ignore next */
  if (!isElInView) e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
};

function changeTabs(e) {
  const { target } = e;
  const parent = target.parentNode;
  const grandparent = parent.parentNode.nextElementSibling;

  parent.querySelectorAll('[aria-selected="true"]').forEach((t) => t.setAttribute('aria-selected', false));
  target.setAttribute('aria-selected', true);
  scrollTabIntoView(target);

  grandparent.querySelectorAll('[role="tabpanel"]').forEach((p) => p.setAttribute('hidden', true));
  grandparent.parentNode.querySelectorAll('.tablist-container .tabpanel').forEach((p) => p.remove());

  const targetTabContent = grandparent.parentNode.querySelector(`#${target.getAttribute('aria-controls')}`);

  const mediaQuery = window.matchMedia('(max-width: 767px)');
  if (mediaQuery.matches) {
    const targetTabContentClone = targetTabContent.cloneNode(true);
    const allTabPanels = grandparent.parentNode.querySelectorAll('[role="tabpanel"]');
    allTabPanels.forEach((p) => p.setAttribute('hidden', true));

    target.after(targetTabContentClone);
    targetTabContentClone.removeAttribute('hidden');
  } else {
    targetTabContent.removeAttribute('hidden');
  }
}

function initTabs(e) {
  const tabs = e.querySelectorAll('[role="tab"]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', changeTabs);
  });
}

let initCount = 0;
const init = (e) => {
  const rows = e.querySelectorAll(':scope > div');

  /* c8 ignore next */
  if (!rows.length) return;

  // Tab List
  const tabList = rows[0];
  const tabContent = rows[1];

  const tabId = `tabs-${initCount}`;
  e.id = tabId;
  tabList.classList.add('tabList');
  tabList.setAttribute('role', 'tablist');
  const tabListItems = tabList.querySelectorAll(':scope a');
  const tabPanelItems = tabContent.querySelectorAll(':scope .tabpanel');

  const tabNames = [];
  if (tabListItems) {
    tabListItems.forEach((item, i) => {
      // item[i] = `tab${i}`;
      tabNames[i] = item.innerText.toLowerCase();

      // tab button attributes
      item.setAttribute('role', 'tab');
      item.setAttribute('id', (i > 0) ? '0' : '-1');
      item.setAttribute('tabindex', `${tabNames[i]}`);
      item.setAttribute('aria-selected', (i === 0) ? 'true' : 'false');
      item.setAttribute('aria-controls', `tab-panel-${initCount}-${tabNames[i]}`);

      // const tabListContent = createTag('div', tabContentAttributes);
      // console.log(tabListContent);
      // tabListContent.setAttribute('aria-labelledby', `tab-${initCount}-${tabNames[i]}`);
      // if (i > 0) tabListContent.setAttribute('hidden', 'true');
    });

    if (tabPanelItems) {
      tabPanelItems.forEach((item, i) => {
        // tab panel content attributes
        item.setAttribute('id', `tab-panel-${initCount}-${tabNames[i]}`);
        item.setAttribute('role', 'tabpanel');
        item.setAttribute('class', 'tabpanel');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-labelledby', `tab-${initCount}-${tabNames[i]}`);
      });
    }

    const tabContents = [];

    // Tab Sections
    const allTabPanels = Array.from(document.querySelectorAll('.tabcontent-container .tabpanel'));
    allTabPanels.forEach((x) => {
      tabContents.push(x);
    });
    initTabs(e);
    initCount += 1;
  }
};

export default function decorate(block) {
  const tabTitles = block.querySelectorAll('.tabcordion > div:nth-child(odd)');
  const tabContents = block.querySelectorAll('.tabcordion > div:nth-child(even) > div');

  // DOM structure for tab buttons
  const tabList = createTag('div', { class: 'tabList' });
  const tabListContainer = createTag('div', { class: 'tablist-container' });

  tabTitles.forEach((tabTitle) => {
    const tab = createTag('a', { class: 'tab' });
    tab.innerText = tabTitle.innerText.trim();
    tabListContainer.append(tab);
  });

  tabList.append(tabListContainer);

  block.innerHTML = '';

  const tabContent = createTag('div', { class: 'tabcontent' });
  const tabContentContainer = createTag('div', { class: 'tabcontent-container' });
  // DOM structure for tab content
  tabContents.forEach((item) => {
    const tabPanel = createTag('div', { class: 'tabpanel' });
    tabPanel.append(item);
    tabContentContainer.append(tabPanel);
  });
  tabContent.append(tabContentContainer);

  block.append(tabList, tabContent);
  init(block);
}
