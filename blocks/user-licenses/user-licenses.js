import { getLocaleConfig } from '../../scripts/zemax-config.js';
import {
  createTag, createGenericTable, hideModal, showModal,
} from '../../scripts/scripts.js';
import execute from '../../scripts/zemax-api.js';

function showUserActionModal(event) {
  const newProductUserId = event.target.getAttribute('data-new-productuserid');
  const licenseId = event.target.getAttribute('data-license-id');
  const nextActionClass = event.target.getAttribute('data-next-action-class');
  showModal(event);
  const userActionButton = document.querySelector(`.${nextActionClass}`);
  userActionButton.setAttribute('data-new-productuserid', newProductUserId);
  userActionButton.setAttribute('data-license-id', licenseId);
}

function createUser(event) {
  hideModal(event);
  alert('Implement create user');
}

function showAddUserTable(event) {
  const licenseId = event.target.getAttribute('data-license-id');
  const addUserActionButton = document.querySelector('.add-user-action-button');
  addUserActionButton.setAttribute('data-license-id', licenseId);
  showModal(event);
}

async function changeUserForALicense(event) {
  const contactId = event.target.getAttribute('contactid');
  const newProductUserId = event.target.getAttribute('data-new-productuserid');
  const data = await execute('dynamics_change_enduser_license', `&contact_id=${contactId}&new_productuserid=${newProductUserId}`, 'PATCH');
  if (data !== undefined && data !== null && data.status === 204) {
    // TODO show success toast message
    hideModal(event);
    // eslint-disable-next-line no-use-before-define
    displayLicenseDetails(event);
  } else {
    console.log('error ', data);
  }
}

function updateAddUserId(event) {
  const addUserActionButton = document.querySelector('.add-user-action-button');
  addUserActionButton.setAttribute('contactId', event.target.getAttribute('id'));
}

function updateChangeUserId(event) {
  const addUserActionButton = document.querySelector('.change-user-action-button');
  addUserActionButton.setAttribute('contactId', event.target.getAttribute('id'));
}

async function addUserToALicense(event) {
  const contactId = event.target.getAttribute('contactid');
  const licenseId = event.target.getAttribute('data-license-id');
  const data = await execute('dynamics_add_end_user', `&contactId=${contactId}&licenseid=${licenseId}`, 'POST');

  if (data !== undefined && data !== null && data.status === 204) {
    // TODO show success toast message
    hideModal(event);
    // eslint-disable-next-line no-use-before-define
    displayLicenseDetails(event);
  } else {
    console.log('error ', data);
  }
}

async function createColleaguesTable(checkboxClass) {
  const data = await execute('dynamics_get_colleagues_view', '', 'GET');
  const headingsMapping = [
    {
      label: '',
      value: [],
      html: 'input',
      htmlAttributes: {
        class: `${checkboxClass}`,
        type: 'checkbox',
        id: '{{contactid}}',
      },
    },
    {
      label: 'Full Name',
      value: ['{{firstname}}', ' ', '{{lastname}}'],
    },
    {
      label: 'Job Title',
      value: ['{{jobtitle}}'],
    },
    {
      label: 'Email',
      value: ['{{emailaddress1}}'],
    },
    {
      label: 'Business Phone',
      value: ['{{telephone1}}'],
    },
  ];
  return createGenericTable(headingsMapping, data.colleagues);
}

async function addColleaguesToUserActionModal(
  modalSelectorClass,
  modalCheckBoxClass,
  eventListenerMethoda,
) {
  const modalBodyDivs = document.querySelectorAll('.modal-body');
  let modalContentDiv = null;
  modalBodyDivs.forEach((modalBodyDiv) => {
    const containerDiv = modalBodyDiv.querySelector(`.${modalSelectorClass}`);
    if (containerDiv !== null && containerDiv !== undefined) {
      modalContentDiv = containerDiv;
    }
  });

  // clear previous modal content
  modalContentDiv.innerHTML = '';
  modalContentDiv.appendChild(await createColleaguesTable(modalCheckBoxClass));
  const userCheckboxes = document.querySelectorAll(`.${modalCheckBoxClass}`);
  userCheckboxes.forEach((userCheckbox) => {
    userCheckbox.addEventListener('click', eventListenerMethoda);
  });
}

async function removeUserFromLicense(event) {
  const newproductuserid = event.target.getAttribute('data-new-productuserid');
  const data = await execute('dynamics_remove_enduser_from_license', `&new_productuserid=${newproductuserid}`, 'DELETE');
  // TODO handle response and add toast message

  if (data !== undefined && data !== null && data.status === 204) {
    // TODO show success toast message
    hideModal(event);
    // eslint-disable-next-line no-use-before-define
    displayLicenseDetails(event);
  } else {
    console.log('error ', data);
  }
}

async function updateLicenseNickname() {
  const { value } = document.querySelector('.nickname');
  if (value !== '' && value !== undefined) {
    const data = await execute('dynamics_set_license_nickname', `&id=97d53652-122f-e611-80ea-005056831cd4&nickname=${value}`, 'PATCH');
    console.log('Updated license nickname ', data);
  } else {
    // TODO handle response and add toast message
    alert('Provide nickname value before saving');
  }
}

function hideOtherUserLicenseInformation() {
  const sections = document.querySelectorAll('.section');

  sections.forEach((section) => {
    if (section.classList.contains('user-licenses-container')) {
      const tabsContent = section.querySelector('.tabs');
      if (tabsContent !== undefined && tabsContent !== null) {
        section.querySelector('.tabs').remove();
      }
      const licenseComponent = section.querySelector('.user-licenses.block');
      licenseComponent.querySelector('h3').parentElement.parentElement.remove();

      let backToProfileButton = licenseComponent.querySelector('#backToAccountButton');
      if (backToProfileButton === undefined || backToProfileButton === null) {
        backToProfileButton = createTag('a', { href: '/pages/profile', class: 'button primary', id: 'backToAccountButton' }, 'Back to Account');
        licenseComponent.insertBefore(backToProfileButton, licenseComponent.firstChild);
      }
    } else {
      section.remove();
    }
  });
}

async function displayLicenseDetails(event) {
  hideOtherUserLicenseInformation();
  const licenseId = event.target.getAttribute('data-license-id');
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');

  if (userId == null || userId === undefined || accessToken == null || accessToken === undefined) {
    window.location.assign(`${window.location.origin}`);
  } else {
    const data = await execute('dynamics_get_end_users_for_license', `&license_id=${licenseId}`, 'GET');
    // DOM creation
    const manageLicenseH2 = createTag('h2', '', `Manage License #${data.licenseid}`);
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
        licenseDetailsRow = createTag('div', { class: 'license-details-row layout-33-33-33' }, '');
      }
    });

    const nickNameSetValue = (data.license_detail[0].zemax_nickname === undefined ? '' : data.license_detail[0].zemax_nickname);
    const nickNameTextField = createTag('input', { class: 'nickname', value: nickNameSetValue }, '');
    licenseDetailsRow.appendChild(nickNameTextField);
    const saveNicknameButton = createTag('button', { class: 'save-nickname action', type: 'button' }, 'Save');
    saveNicknameButton.addEventListener('click', updateLicenseNickname);
    licenseDetailsRow.appendChild(saveNicknameButton);
    licenseDetailsDataDiv.appendChild(licenseDetailsRow);

    const endUsersDetailsDiv = document.querySelector('.end-users-details');
    endUsersDetailsDiv.innerHTML = '';
    const licenseUsers = data.users;
    const endUsersH2 = createTag('h2', '', 'End Users');
    endUsersDetailsDiv.appendChild(endUsersH2);
    const addUserButton = createTag('button', {
      class: 'add-user-to-license action', type: 'button', 'data-modal-id': 'addUserModal', 'data-license-id': licenseId,
    }, 'Add End User');

    await addColleaguesToUserActionModal('add-user-container', 'add-user-checkbox', updateAddUserId);

    // TODO add condition
    endUsersDetailsDiv.appendChild(addUserButton);
    addUserButton.addEventListener('click', showAddUserTable);

    if (licenseUsers !== undefined && licenseUsers.length > 0) {
      const tableHeadings = [
        {
          label: 'Name',
          value: ['{{contact1.fullname}}'],
          html: 'td',
          htmlAttributes: {
            class: 'user-name',
          },
        },
        {
          label: 'Email',
          value: ['{{contact1.emailaddress1}}'],
        },
        {
          label: 'Job Title',
          value: ['{{contact1.jobtitle}}'],
        },
        {
          label: 'Phone',
          value: ['{{contact1.telephone1}}'],
        },
        {
          label: '',
          value: ['{{contact1.fullname}}'],
          html: 'button',
          htmlTagLabel: 'Remove User',
          htmlAttributes: {
            class: 'license-user-remove-user action important',
            type: 'button',
            'data-modal-id': 'deleteUserModal',
            'data-new-productuserid': '{{new_productuserid}}',
            'data-license-id': `${licenseId}`,
            'data-next-action-class': 'delete-user-action-button',
          },
        },
        {
          label: '',
          value: ['{{contact1.fullname}}'],
          html: 'button',
          htmlTagLabel: 'Change End User',
          htmlAttributes: {
            class: 'license-user-change-user action',
            type: 'button',
            'data-modal-id': 'changeUserModal',
            'data-new-productuserid': '{{new_productuserid}}',
            'data-license-id': `${licenseId}`,
            'data-next-action-class': 'change-user-action-button',
          },
        },
      ];
      const tableElement = createGenericTable(tableHeadings, licenseUsers);
      endUsersDetailsDiv.appendChild(tableElement);

      const removeButtons = tableElement.querySelectorAll('.license-user-remove-user');
      removeButtons.forEach((removeButton) => {
        removeButton.addEventListener('click', showUserActionModal);
      });

      const changeUserLicenseButtons = tableElement.querySelectorAll('.license-user-change-user ');
      changeUserLicenseButtons.forEach((changeUserLicenseButton) => {
        changeUserLicenseButton.addEventListener('click', showUserActionModal);
      });
    } else {
      endUsersDetailsDiv.appendChild(createTag('p', { class: 'no-end-user-license' }, 'This license does not currently have an end user. To add and end user, please click the Add End User button.'));
    }
  }
}

async function addManageLicenseFeature(block) {
  const licenseDetailsDiv = createTag('div', { class: 'license-details' }, '');
  const endUsersDetailsDiv = createTag('div', { class: 'end-users-details' }, '');
  block.append(licenseDetailsDiv);
  block.append(endUsersDetailsDiv);

  // Add User Modal
  const modalHeaderDiv = createTag('div', { class: 'modal-header' }, '');
  const modalTitleH3 = createTag('h3', '', 'Add End User to License');
  const modalCloseButtonIcon = createTag('button', { class: 'modal-close' }, '');
  modalHeaderDiv.appendChild(modalTitleH3);
  modalHeaderDiv.appendChild(modalCloseButtonIcon);

  const modalAddUserContentDiv = createTag('div', { class: 'modal-content add-user-modal-content' }, modalHeaderDiv);

  const modalBodyDiv = createTag('div', { class: 'modal-body' }, createTag('div', { class: 'add-user-container table-container' }, ''));

  modalAddUserContentDiv.appendChild(modalBodyDiv);
  const modalFooterDiv = createTag('div', { class: 'modal-footer' }, '');
  const createUserButton = createTag('button', { class: 'action secondary create-user-action-button', 'data-modal-id': 'addUserModal' }, 'Create User');
  const addUserButton = createTag('button', { class: 'action add-user-action-button', 'data-modal-id': 'addUserModal' }, 'Add User');
  const addUserModalCloseButton = createTag('button', { class: 'action', 'data-modal-id': 'addUserModal' }, 'Close');

  modalFooterDiv.appendChild(createUserButton);
  modalFooterDiv.appendChild(addUserButton);
  modalFooterDiv.appendChild(addUserModalCloseButton);

  createUserButton.addEventListener('click', createUser);
  addUserModalCloseButton.addEventListener('click', hideModal);
  addUserButton.addEventListener('click', addUserToALicense);

  modalAddUserContentDiv.appendChild(modalFooterDiv);
  const modalAddUserDiv = createTag('div', { class: 'modal-container add-user-modal', id: 'addUserModal' }, modalAddUserContentDiv);
  block.append(modalAddUserDiv);

  // Delete User Modal
  const modalDeleteHeaderDiv = createTag('div', { class: 'modal-header' }, '');
  const modalDeleteTitleH3 = createTag('h3', '', 'Confirmation Required');
  const modalDeleteCloseButtonIcon = createTag('button', { class: 'modal-close' }, '');
  modalDeleteHeaderDiv.appendChild(modalDeleteTitleH3);
  modalDeleteHeaderDiv.appendChild(modalDeleteCloseButtonIcon);

  const modalDeleteUserContentDiv = createTag('div', { class: 'modal-content delete-user-modal-content' }, modalDeleteHeaderDiv);
  const modalDeleteDescription = createTag('p', '', 'Please confirm this action to remove end user');
  const modalDeleteBodyDiv = createTag('div', { class: 'modal-body' }, createTag('div', { class: 'delete-user-container' }, modalDeleteDescription));
  modalDeleteUserContentDiv.appendChild(modalDeleteBodyDiv);

  const modalDeleteFooterDiv = createTag('div', { class: 'modal-footer' }, '');

  const deleteUserButton = createTag('button', { class: 'action important delete-user-action-button', 'data-modal-id': 'deleteUserModal' }, 'Yes, remove End User');
  const deleteUserModalCloseButton = createTag('button', { class: 'action secondary', 'data-modal-id': 'deleteUserModal' }, 'Cancel');

  modalDeleteFooterDiv.appendChild(deleteUserButton);
  modalDeleteFooterDiv.appendChild(deleteUserModalCloseButton);

  deleteUserButton.addEventListener('click', removeUserFromLicense);
  deleteUserModalCloseButton.addEventListener('click', hideModal);

  modalDeleteUserContentDiv.appendChild(modalDeleteFooterDiv);

  const modalDeleteUserModalDiv = createTag('div', { class: 'modal-container delete-user-modal', id: 'deleteUserModal' }, modalDeleteUserContentDiv);
  block.append(modalDeleteUserModalDiv);

  // Change User Modal
  const modalChangeUserHeaderDiv = createTag('div', { class: 'modal-header' }, '');
  const modalChangeUserTitleH3 = createTag('h3', '', 'Choose a User');
  const modalChangeUserCloseButtonIcon = createTag('button', { class: 'modal-close' }, '');
  modalChangeUserHeaderDiv.appendChild(modalChangeUserTitleH3);
  modalChangeUserHeaderDiv.appendChild(modalChangeUserCloseButtonIcon);

  const modalChangeUserContentDiv = createTag('div', { class: 'modal-content change-user-modal-content' }, modalChangeUserHeaderDiv);

  const modalChangeUserBodyDiv = createTag('div', { class: 'modal-body' }, createTag('div', { class: 'change-user-container table-container' }, ''));

  modalChangeUserContentDiv.appendChild(modalChangeUserBodyDiv);
  const modalChangeUserFooterDiv = createTag('div', { class: 'modal-footer' }, '');
  const createUserButtonChangeUser = createTag('button', { class: 'action secondary create-user-action-button', 'data-modal-id': 'changeUserModal' }, 'Create User');
  const changeUserButton = createTag('button', { class: 'action change-user-action-button', 'data-modal-id': 'changeUserModal' }, 'Change User');
  const changeUserModalCloseButton = createTag('button', { class: 'action', 'data-modal-id': 'changeUserModal' }, 'Close');

  modalChangeUserFooterDiv.appendChild(createUserButtonChangeUser);
  modalChangeUserFooterDiv.appendChild(changeUserButton);
  modalChangeUserFooterDiv.appendChild(changeUserModalCloseButton);

  createUserButtonChangeUser.addEventListener('click', createUser);
  changeUserButton.addEventListener('click', changeUserForALicense);
  changeUserModalCloseButton.addEventListener('click', hideModal);

  modalChangeUserContentDiv.appendChild(modalChangeUserFooterDiv);
  const modalChangeUserDiv = createTag('div', { class: 'modal-container change-user-modal', id: 'changeUserModal' }, modalChangeUserContentDiv);
  block.append(modalChangeUserDiv);

  await addColleaguesToUserActionModal('change-user-container', 'change-user-checkbox', updateChangeUserId);

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
    const manageOrViewButton = createTag('button', { class: 'manage-view-license action', type: 'button', 'data-license-id': row.new_licensesid }, 'Manage');
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
  const data = await execute('dynamics_get_licenses_by_auth0id', '', 'GET');

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
}
