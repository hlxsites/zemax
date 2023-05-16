import { getEnvironmentConfig, getLocaleConfig } from '../../scripts/zemax-config.js';
import { createTag } from '../../scripts/scripts.js';

async function removeUserFromLicense(event) {
  const licenseId = event.target.getAttribute('data-licensseid');
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const newproductuserid = event.target.getAttribute('data-new-productuserid');
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  // TODO add confirmation modal
  await fetch(`${DYNAMIC_365_DOMAIN}dynamics_remove_enduser_from_license?auth0_id=${userId}&new_productuserid=${newproductuserid}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `bearer ${accessToken}`,
    },
  })
    .then(async (response) => {
      const data = await response.json();
      console.log('user deleted', data);
    });
}
async function updateLicenseNickname() {
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;
  const { value } = document.querySelector('.nickname');

  if (value !== '' && value !== undefined) {
    await fetch(`${DYNAMIC_365_DOMAIN}dynamics_set_license_nickname?auth0_id=${userId}&id=97d53652-122f-e611-80ea-005056831cd4&nickname=${value}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    }).then(async (response) => {
      console.log('update', response);
    });
  }
}
async function displayLicenseDetails(event) {
  const licenseId = event.target.getAttribute('data-licensseid');
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  if (userId == null || userId === undefined || accessToken == null || accessToken === undefined) {
    window.location.assign(`${window.location.origin}`);
  } else {
    await fetch(`${DYNAMIC_365_DOMAIN}dynamics_get_end_users_for_license?auth0_id=${userId}&license_id=${licenseId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        // DOM creation
        const manageLicenseH2 = createTag('h2', { class: 'license-details-h2' }, `Manage License #${data.licenseid}`);
        const licenseDetailsDiv = document.querySelector('.license-details');
        licenseDetailsDiv.innerHTML = '';
        licenseDetailsDiv.appendChild(manageLicenseH2);
        const licenseDetailsDataDiv = createTag('div', { class: 'license-details-data' }, '');
        licenseDetailsDiv.appendChild(licenseDetailsDataDiv);
        const headings = ['License Administrator|_new_registereduser_value@OData.Community.Display.V1.FormattedValue', 'Account|_new_account_value@OData.Community.Display.V1.FormattedValue', 'Renewal Date|new_supportexpires@OData.Community.Display.V1.FormattedValue', 'Key Serial Number|new_licenseid', 'Product|_new_product_value@OData.Community.Display.V1.FormattedValue', 'License Type|zemax_seattype@OData.Community.Display.V1.FormattedValue', 'ZPA Support|new_premiumsupport@OData.Community.Display.V1.FormattedValue', 'Seat Count|new_usercount@OData.Community.Display.V1.FormattedValue', 'End User Count|new_endusercount@OData.Community.Display.V1.FormattedValue'];

        let licenseDetailsRow = createTag('div', { class: 'license-details-row layout-33-33-33' }, '');
        headings.forEach((heading, index) => {
          const elementDetailCellDiv = createTag('div', { class: 'element-detail-cell' });
          const elementDetailCellHeading = createTag('h3', { class: 'element-detail-cell-heading' }, heading.split('|')[0]);
          const elementDetailCellDataPara = createTag('p', { class: 'element-detail-cell-data' }, data.license_detail[0][heading.split('|')[1]]);
          elementDetailCellDiv.appendChild(elementDetailCellHeading);
          elementDetailCellDiv.appendChild(elementDetailCellDataPara);
          licenseDetailsRow.appendChild(elementDetailCellDiv);

          if (index % 3 === 2) {
            licenseDetailsDataDiv.appendChild(licenseDetailsRow);
            licenseDetailsRow = createTag('div', { class: 'license-details-row' }, '');
          }
        });

        const nickNameTextField = createTag('input', { class: 'nickname', value: data.license_detail[0].zemax_nickname }, '');
        licenseDetailsRow.appendChild(nickNameTextField);
        const saveNicknameButton = createTag('button', { class: 'save-nickname action', type: 'button' }, 'Save');
        saveNicknameButton.addEventListener('click', updateLicenseNickname);
        licenseDetailsRow.appendChild(saveNicknameButton);
        licenseDetailsDataDiv.appendChild(licenseDetailsRow);

        const licenseUsers = data.users;

        if (licenseUsers !== undefined && licenseUsers.length > 0) {
          const tableHeadings = ['Name|contact1.fullname', 'Email|contact1.emailaddress1', 'Job Title|contact1.jobtitle', 'Phone|contact1.telephone1'];
          const tableElement = document.createElement('table');

          const thead = document.createElement('thead');
          const tr = document.createElement('tr');
          tableHeadings.forEach((heading) => {
            const tableHeadingElement = createTag('th', { class: 'license-user-data-heading' }, heading.split('|')[0]);
            tr.appendChild(tableHeadingElement);
          });

          thead.appendChild(tr);
          tableElement.appendChild(thead);
          const tbody = document.createElement('tbody');
          licenseUsers.forEach((user) => {
            const trValue = document.createElement('tr');
            tableHeadings.forEach((heading) => {
              const tableHeadingValue = createTag('td', { class: 'license-user-data-cell' }, user[heading.split('|')[1]]);
              trValue.appendChild(tableHeadingValue);
            });
            const buttonRemoveUser = createTag('button', { class: 'license-user-remove-user action important', type: 'button', 'data-new-productuserid': user.new_productuserid }, 'Remove User');
            const tableHeadingValue = createTag('td', { class: 'license-user-data-cell' }, buttonRemoveUser);
            buttonRemoveUser.addEventListener('click', removeUserFromLicense);

            trValue.appendChild(tableHeadingValue);

            const buttonChangeEndUser = createTag('button', { class: 'license-user-change-user action', type: 'button' }, 'Change End User');
            const tableHeadingChangeUserValue = createTag('td', { class: 'license-user-data-cell' }, buttonChangeEndUser);

            trValue.appendChild(tableHeadingChangeUserValue);

            tbody.appendChild(trValue);
          });
          tableElement.appendChild(tbody);
          licenseDetailsDiv.appendChild(tableElement);
        } else {
          licenseDetailsDiv.appendChild(createTag('p', { class: 'no-end-user-license' }, 'This license does not currently have an end user. To add and end user, please click the Add End User button.'));
        }
      });
  }
}

function addManageLicenseFeature(block) {
  const dataDiv = createTag('div', { class: 'license-details' }, '');
  block.append(dataDiv);
  const manageButtons = document.querySelectorAll('.manage-view-license');
  manageButtons.forEach((manageButton) => {
    manageButton.addEventListener('click', displayLicenseDetails);
  });
}

function createTableHeaderMapping(data) {
  const { allLicenseTabHeadingMapping } = getLocaleConfig('en_us', 'userLicenses');
  const tableHeaderMapping = [];

  if (data.my_licenses_admin !== undefined && data.my_licenses_admin.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[0]}|my_licenses_admin`);
  }

  if (data.my_licenses !== undefined && data.my_licenses.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[1]}|my_licenses`);
  }

  if (data.company_licenses !== undefined && data.company_licenses.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[2]}|company_licenses`);
  }

  if (data.academic_licenses !== undefined && data.academic_licenses.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[3]}|academic_licenses`);
  }

  if (data.academic_esp_licenses !== undefined && data.academic_esp_licenses.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[4]}|academic_esp_licenses`);
  }
  return tableHeaderMapping;
}

function createTabLi(active, ariaControls, isSelected, tabText) {
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

function createContentDiv(tabId, ariaLabelBy, isHidden, content) {
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

function createLicencesTable(rows) {
  const tableElement = document.createElement('table');

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const { tableHeadings } = getLocaleConfig('en_us', 'userLicenses');

  tableHeadings.forEach((tableHeading) => {
    const tableHeadingElement = document.createElement('th');
    const button = document.createElement('button');
    button.innerHTML = tableHeading;
    tableHeadingElement.appendChild(button);
    tr.appendChild(tableHeadingElement);
  });

  thead.appendChild(tr);
  tableElement.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const trBody = document.createElement('tr');

    // TODO add logic for manage or view
    const tdManageOrView = document.createElement('td');
    const manageOrViewButton = document.createElement('button');
    manageOrViewButton.classList.add('manage-view-license', 'action');
    manageOrViewButton.innerText = 'Manage';
    manageOrViewButton.setAttribute('type', 'button');
    manageOrViewButton.setAttribute('data-licensseid', row.new_licensesid);
    tdManageOrView.appendChild(manageOrViewButton);
    trBody.appendChild(tdManageOrView);

    const date = new Date(row.new_supportexpires);
    // subtract one day from the date
    date.setDate(date.getDate() - 1);

    // format the resulting date into the desired string format
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const supportExpiryDate = date.toLocaleDateString('en-US', options);
    let licenseActive = 'Expired';

    if (date.getTime() > Date.now()) {
      licenseActive = 'Active';
    }

    const headingValueMapping = [
      licenseActive,
      supportExpiryDate,
      row.new_licenseid,
      row.zemax_nickname,
      row['_new_product_value@OData.Community.Display.V1.FormattedValue'],
      row['zemax_seattype@OData.Community.Display.V1.FormattedValue'],
      row.new_usercount,
      row.new_endusercount,
      row['_new_registereduser_value@OData.Community.Display.V1.FormattedValue'],
    ];

    headingValueMapping.forEach((headingValue, index) => {
      const td = document.createElement('td');
      if (index === 0) {
        const spanClass = (headingValue === 'Active') ? 'active-license' : 'expired-license';
        const spanStatus = createTag('span', { class: spanClass }, headingValue);
        td.appendChild(spanStatus);
      } else if (index === 2) {
        const licenseLink = createTag('a', { href: '#' }, headingValue);
        td.appendChild(licenseLink);
      } else {
        td.innerText = headingValue !== undefined ? headingValue : '';
      }
      trBody.appendChild(td);
    });

    tbody.appendChild(trBody);
  });

  tableElement.appendChild(tbody);
  return tableElement;
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

function addTabFeature() {
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

export default async function decorate(block) {
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  if (userId == null || userId === undefined || accessToken == null || accessToken === undefined) {
    window.location.assign(`${window.location.origin}`);
  } else {
    await fetch(`${DYNAMIC_365_DOMAIN}dynamics_get_licenses_by_auth0id?auth0_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        const licenseTableHeadingMapping = createTableHeaderMapping(data);
        const tabDiv = createTag('div', { class: 'tabs' });
        const tabListUl = createTag('ul', { class: 'tabs-nav', role: 'tablist' });

        // Render tab headings
        licenseTableHeadingMapping.forEach((heading, index) => {
          if (index === 0) {
            tabListUl.append(createTabLi('active', `tab${index + 1}`, 'false', heading.split('|')[0]));
          } else {
            tabListUl.append(createTabLi('', `tab${index + 1}`, 'true', heading.split('|')[0]));
          }
        });

        tabDiv.appendChild(tabListUl);
        // Render tab content
        licenseTableHeadingMapping.forEach((heading, index) => {
          if (index === 0) {
            tabDiv.append(
              createContentDiv(`tab${index + 1}`, `tab${index + 1}`, false, createLicencesTable(data[heading.split('|')[1]]).outerHTML),
            );
          } else {
            tabDiv.append(
              createContentDiv(`tab${index + 1}`, `tab${index + 1}`, true, createLicencesTable(data[heading.split('|')[1]]).outerHTML),
            );
          }
        });

        block.append(tabDiv);
        addTabFeature();
        addManageLicenseFeature(block);
      })
      .catch((err) => {
        // There was an error
        console.warn('Something went wrong.', err);
      });
  }
}
