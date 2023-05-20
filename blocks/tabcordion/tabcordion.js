import { createTag } from '../../scripts/scripts.js';

function changeTabs(e) {
  const { target } = e;
  const parent = target.parentNode;
  const grandparent = parent.parentNode.nextElementSibling;

  // hide all tag panel
  grandparent.querySelectorAll('[role="tabpanel"]').forEach((p) => p.setAttribute('hidden', true));
  // remove cloned tab panel for mobile
  grandparent.parentNode.querySelectorAll('.tablist-container .tabpanel').forEach((p) => p.remove());

  const mediaQuery = window.matchMedia('(max-width: 767px)');
  if (mediaQuery.matches) {
    const activeTabIndex = document.querySelector('.tab[aria-selected="true"]')?.getAttribute('tabindex');
    const targetTabIndex = target.getAttribute('tabindex');

    // make selected tab unselected
    parent.querySelectorAll('[aria-selected="true"]').forEach((t) => t.setAttribute('aria-selected', false));

    if (targetTabIndex !== activeTabIndex) {
      // make target tab selected
      target.setAttribute('aria-selected', true);
      // clone target tab content and append to tab list container
      const targetTabContent = grandparent.parentNode.querySelector(`#${target.getAttribute('aria-controls')}`);
      const targetTabContentClone = targetTabContent.cloneNode(true);
      targetTabContentClone.removeAttribute('hidden');
      targetTabContentClone.classList.add('mobile-cloned-tabpanel');
      target.after(targetTabContentClone);
    }
  } else {
    // make selected tab unselected
    parent.querySelectorAll('[aria-selected="true"]').forEach((t) => t.setAttribute('aria-selected', false));
    // make target selected and tabpanel show up
    target.setAttribute('aria-selected', true);
    const targetTabContent = grandparent.parentNode.querySelector(`#${target.getAttribute('aria-controls')}`);
    targetTabContent.removeAttribute('hidden');
  }
}

function openTabDirect(block) {
  const { hash } = window.location;
  const tabindex = hash.substring(1);
  const tab = block.querySelector(`a[tabindex="${tabindex}"]`);
  if (tab) tab.click();
}

function initTabs(e) {
  const tabs = e.querySelectorAll('[role="tab"]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', changeTabs);
  });

  if (window.location.hash !== '') {
    openTabDirect(e);
  }
}

let initCount = 0;
const init = (e) => {
  const rows = e.querySelectorAll(':scope > div');
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
    });

    if (tabPanelItems) {
      tabPanelItems.forEach((item, i) => {
        // tab panel content attributes
        item.setAttribute('id', `tab-panel-${initCount}-${tabNames[i]}`);
        item.setAttribute('role', 'tabpanel');
        item.setAttribute('class', 'tabpanel');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-labelledby', `tab-${initCount}-${tabNames[i]}`);
        if (i > 0) item.setAttribute('hidden', 'true');
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
  const tabContents = block.querySelectorAll('.tabcordion > div:nth-child(even)');

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

  window.matchMedia('(min-width: 768px)').addEventListener('change', (mediaQuery) => {
    if (mediaQuery.matches) {
      initTabs(block);
    }
  });
  window.matchMedia('(max-width: 767px)').addEventListener('change', (mediaQuery) => {
    if (mediaQuery.matches) {
      initTabs(block);
    }
  });
}
