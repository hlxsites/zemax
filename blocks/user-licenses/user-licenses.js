import { getLocaleConfig } from '../../scripts/zemax-config.js';
import {
  a, button, div, h2, h3, p, domEl,
} from '../../scripts/dom-helpers.js';
import {
  createModal, createTag, createGenericDataTable, hideModal,
  showModal, createForm, createTabLi, createTabContentDiv,
  addTabFeature, findReplaceJSON, closeModal,
} from '../../scripts/scripts.js';
import execute from '../../scripts/zemax-api.js';
import {
  addColleague, updateUserInfo, resetUserPassword,
  activateUser, deactivateUser, updateLicenseNickname,
  changeUserForALicense, addUserToALicense, removeUserFromLicense,
  assignLicenseToUser, updateColleagueInfo,
} from './user-actions.js';

// Load configurations
import activatedDeactivatedColleaguesTable from '../../configs/tables/activatedDeactivatedColleaguesTableConfig.js';
import addColleagueFormConfiguration from '../../configs/forms/addColleagueFormConfig.js';
import editUserFormConfiguration from '../../configs/forms/editUserFormConfig.js';
import getLicenseDetailsUsersTable from '../../configs/tables/licenseDetailsUsersTableConfig.js';
import getAddUserToLicenseTableConfig from '../../configs/tables/addUserToLicenseTableConfig.js';
import manageColleaguesAdminUserLicensesTable from '../../configs/tables/manageColleagueAdminUserLincensesTableConfig.js';
import manageColleaguesEndUserLicensesTable from '../../configs/tables/manageColleagueEndUserLincensesTableConfig.js';
import getAssignUserToLicenseTable from '../../configs/tables/assignUserToLicenseTableConfig.js';
import userLicensesTable from '../../configs/tables/userLicensesTableConfig.js';
import { getAddUserDialog, getDeleteUserDialog, getChangeUserDialog } from '../../configs/modals/displayLicenseViewModalConfig.js';
import { getEditUserDialog, getResetUserPasswordDialog } from '../../configs/modals/createUserViewModalConfig.js';

function showUserActionModal(event) {
  const newProductUserId = event.target.getAttribute('data-new-productuserid');
  const licenseId = event.target.getAttribute('data-license-id');
  const nextActionClass = event.target.getAttribute('data-next-action-class');
  showModal(event);
  const userActionButton = document.querySelector(`.${nextActionClass}`);
  userActionButton.setAttribute('data-new-productuserid', newProductUserId);
  userActionButton.setAttribute('data-license-id', licenseId);
}

async function showResetUserPasswordModal(event) {
  const contactid = event.target.getAttribute('data-contactid');
  const nextActionClass = event.target.getAttribute('data-next-action-class');
  showModal(event);
  const userActionButton = document.querySelector(`.${nextActionClass}`);
  userActionButton.setAttribute('data-contactid', contactid);
}

async function showAddColleagueModal(event) {
  showModal(event);
  const addColleagueSubmitButton = document.querySelector('#addColleagueSubmitButton');
  if (addColleagueSubmitButton) {
    addColleagueSubmitButton.addEventListener('click', (eventNew) => {
      addColleague(eventNew, createUserView);
    });
  }
}

async function showEditUserModal(event) {
  const actionButton = event.target;
  const contactid = actionButton.getAttribute('data-contactid');
  const firstname = actionButton.getAttribute('data-user-firstname');
  const lastname = actionButton.getAttribute('data-user-lastname');
  const jobTitle = actionButton.getAttribute('data-user-jobtitle');
  const email = actionButton.getAttribute('data-user-email');
  const phone = actionButton.getAttribute('data-user-phone');
  const userEditForm = document.querySelector('#editUserEditForm');
  userEditForm.querySelector('#first-name').setAttribute('value', firstname);
  userEditForm.querySelector('#last-name').setAttribute('value', lastname);
  userEditForm.querySelector('#job-title').setAttribute('value', jobTitle);
  userEditForm.querySelector('#email').setAttribute('value', email);
  userEditForm.querySelector('#phone').setAttribute('value', phone);
  const submitButton = userEditForm.querySelector('#userEditSubmitButton');
  submitButton.setAttribute('data-contactid', contactid);
  submitButton.addEventListener('click', (eventNew) => {
    updateUserInfo(eventNew, createUserView);
  });
  showModal(event);
}

async function updateAssignLicenseButton(event) {
  const contactId = event.target.getAttribute('data-contact-id');
  const licenseId = event.target.getAttribute('data-license-id');
  const assignLicenseButton = document.querySelector('.action.assign-user-license-action-button');
  assignLicenseButton.setAttribute('data-contact-id', contactId);
  assignLicenseButton.setAttribute('data-license-id', licenseId);
  assignLicenseButton.addEventListener('click', (eventNew) => {
    assignLicenseToUser(eventNew, manageUserView);
  });
}

async function showAssignUserLicense(event) {
  showModal(event);

  const contactId = event.target.getAttribute('data-contact-id');
  const assignUserCheckboxes = document.querySelectorAll('.assign-license-user');
  assignUserCheckboxes.forEach((assignUserCheckbox) => {
    assignUserCheckbox.setAttribute('data-contact-id', contactId);
    assignUserCheckbox.addEventListener('click', updateAssignLicenseButton);
  });
}

async function activateDeactivateUser(event) {
  if (event.target.getAttribute('data-current-state') === 'Active') {
    deactivateUser(event, manageUserView);
  } else {
    activateUser(event, manageUserView);
  }
}

async function manageUserView(event) {
  clearProfileLandingView();
  window.scrollTo(0, 0);

  let contactid = event.target.getAttribute('data-contactid');
  if (!contactid) {
    contactid = event.target.getAttribute('data-contact-id');
  }
  // Create dom for user edit
  const mainDiv = document.querySelector('main');
  const manageUserViewWrapperDiv = createTag('div', { class: 'manage-user-view-wrapper' }, '');
  const manageUserViewDiv = createTag('div', { class: ' section user-licenses-container manage-user-view', id: 'manageUserView' }, manageUserViewWrapperDiv);
  mainDiv.insertBefore(manageUserViewDiv, mainDiv.firstChild);

  const backToColleagueButton = createTag('button', { class: 'button primary', id: 'backToColleaguesButton' }, 'Back to Colleagues');
  manageUserViewWrapperDiv.append(backToColleagueButton);
  backToColleagueButton.addEventListener('click', createUserView);
  manageUserViewWrapperDiv.append(h2('Colleague Details'));

  const allColleaguesData = await execute('dynamics_get_colleagues_manage', '', 'GET');
  const { colleagues } = allColleaguesData;

  const currentColleague = colleagues.filter((colleague) => (colleague.contactid === contactid));

  const buttonText = currentColleague[0].statecode === 0 ? 'Deactivate Colleague' : 'Activate Colleague';
  const currentState = currentColleague[0].statecode === 0 ? 'Active' : 'Inactive';
  const buttonClass = currentColleague[0].statecode === 0 ? 'important' : 'activate';

  const activateDeactivateButton = createTag('button', {
    'data-contactid': contactid,
    'data-action-id': 'activateDeactivateUser',
    'data-current-state': currentState,
    class: `action ${buttonClass}`,
  }, buttonText);
  manageUserViewWrapperDiv.append(activateDeactivateButton);
  activateDeactivateButton.addEventListener('click', activateDeactivateUser);

  const colleagueDetailsConfig = [
    {
      label: 'Full Name',
      value: ['{{firstname}}', ' ', '{{lastname}}'],
    },
    {
      label: 'Job Title',
      value: ['{{jobtitle}}'],
      html: 'input',
      'data-action-id': 'updateColleagueInfo',
      inputClass: 'colleague-job-title',
    },
    {
      label: 'Email',
      value: ['{{emailaddress1}}'],
    },
    {
      label: 'Business Phone',
      value: ['{{telephone1}}'],
      html: 'input',
      'data-action-id': 'updateColleagueInfo',
      inputClass: 'colleague-bussiness-phone',

    },
  ];

  const colleagueDetailsDataDiv = createTag('div', { class: 'colleague-details-data' }, '');
  let colleagueDetailsRow = createTag('div', { class: 'colleague-details-row layout-50-50' }, '');
  colleagueDetailsConfig.forEach((heading, index) => {
    const clonedHeading = JSON.parse(JSON.stringify(heading));
    findReplaceJSON(clonedHeading, currentColleague[0]);
    const elementDetailCellDiv = createTag('div', { class: 'element-detail-cell' });
    const elementDetailCellHeading = createTag('h3', { class: 'element-detail-cell-heading' }, clonedHeading.label);
    elementDetailCellDiv.appendChild(elementDetailCellHeading);
    if (clonedHeading.html === 'input') {
      elementDetailCellDiv.appendChild(createTag('input', { class: clonedHeading.inputClass, value: clonedHeading.value.join('') }, ''));
      elementDetailCellDiv.appendChild(createTag('button', { class: 'action update-user-info', 'data-contact-id': contactid, 'data-action-id': clonedHeading['data-action-id'] }, 'Save'));
    } else {
      const elementDetailCellDataPara = createTag('p', { class: 'element-detail-cell-data' }, clonedHeading.value.join(''));
      elementDetailCellDiv.appendChild(elementDetailCellDataPara);
    }

    colleagueDetailsRow.appendChild(elementDetailCellDiv);

    if (index % 2 === 1) {
      colleagueDetailsDataDiv.appendChild(colleagueDetailsRow);
      colleagueDetailsRow = createTag('div', { class: 'colleague-details-row layout-50-50' }, '');
    }
  });

  manageUserViewWrapperDiv.append(colleagueDetailsDataDiv);
  const saveButtons = colleagueDetailsDataDiv.querySelectorAll('[data-action-id="updateColleagueInfo"]');
  saveButtons.forEach((saveButton) => {
    saveButton.addEventListener('click', updateColleagueInfo);
  });
  // License details
  manageUserViewWrapperDiv.append(h2('License Details'));
  manageUserViewWrapperDiv.append(h3('Licenses (Colleague is the License Administrator)'));
  const adminUserLicensedata = await execute('dynamics_get_licenses_by_contactid', `&contactid=${contactid}`, 'GET');
  if (adminUserLicensedata && adminUserLicensedata.length > 0) {
    const tableElement = createGenericDataTable(manageColleaguesAdminUserLicensesTable,
      adminUserLicensedata);
    const tableContainer = createTag('div', { class: 'table-container' }, tableElement);
    manageUserViewWrapperDiv.append(tableContainer);
  } else {
    manageUserViewWrapperDiv.append(p('There are no records to display.'));
  }

  const assignLicenseButton = button({ 'data-modal-id': 'assignUserLicense', class: 'primary action', 'data-contact-id': contactid }, 'Assign License');
  manageUserViewWrapperDiv.append(assignLicenseButton);
  const assignLicenseUserData = await execute('dynamics_get_licenses_for_assign', `&contactid=${contactid}`, 'GET');

  const assignUserLicenseButton = createTag('button', { class: 'action assign-user-license-action-button', 'data-modal-id': 'assignUserLicense' }, 'Assign License');
  const assignUserLicenseModalCloseButton = createTag('button', { class: 'action', 'data-modal-id': 'assignUserLicense' }, 'Close');
  const buttonsConfig = [
    {
      userAction: 'click',
      button: assignUserLicenseButton,
    }, {
      userAction: 'click',
      button: assignUserLicenseModalCloseButton,
      listenerMethod: hideModal,
    },
  ];

  const allModalContentContainerDiv = document.querySelector('.all-modal-content-container');
  const assignTableElement = createGenericDataTable(getAssignUserToLicenseTable('assign-license-user'), assignLicenseUserData);
  const assignTableContainer = createTag('div', { class: 'table-container' }, assignTableElement);
  const modalAssignUserLicenseDiv = createModal('Assign License', assignTableContainer, 'assign-user-license-modal-content', 'assign-user-license-container table-container', 'assignUserLicense', 'assign-user-license-modal', buttonsConfig);
  allModalContentContainerDiv.append(modalAssignUserLicenseDiv);

  assignLicenseButton.addEventListener('click', showAssignUserLicense);
  manageUserViewWrapperDiv.append(h3('Licenses (Colleague is End User)'));
  const endUserLicensesData = await execute('dynamics_get_enduser_licenses_by_accountid', `&contactid=${contactid}`, 'GET');
  if (endUserLicensesData && endUserLicensesData.length > 0) {
    const manageColleaguesEndUsertableElement = createGenericDataTable(
      manageColleaguesEndUserLicensesTable,
      endUserLicensesData);
    const tableContainer = createTag('div', { class: 'table-container' }, manageColleaguesEndUsertableElement);
    manageUserViewWrapperDiv.append(tableContainer);
  } else {
    manageUserViewWrapperDiv.append(p('There are no records to display.'));
  }
}

async function createUserView(event) {
  closeModal(event);
  clearProfileLandingView();
  window.scrollTo(0, 0);
  let viewAccess = event.target.getAttribute('data-view-access');
  if (!viewAccess) {
    viewAccess = 'manage';
  }
  const mainDiv = document.querySelector('main');
  const createUserViewWrapperDiv = createTag('div', { class: 'create-user-view-wrapper' }, '');
  const createUserViewDiv = createTag('div', { class: ' section user-licenses-container create-user-view', id: 'createUserView' }, createUserViewWrapperDiv);

  mainDiv.insertBefore(createUserViewDiv, mainDiv.firstChild);
  const tabDiv = createTag('div', { class: 'tabs' });
  const tabListUl = createTag('ul', { class: 'tabs-nav', role: 'tablist' });
  const colleaguesTabsMapping = ['Active Colleagues', 'Deactivated Colleagues'];

  const data = await execute('dynamics_get_colleagues_manage', '', 'GET');

  // Render tab headings
  if (viewAccess === 'manage') {
    colleaguesTabsMapping.forEach((heading, index) => {
      if (index === 0) {
        tabListUl.append(createTabLi('active', `tab${index + 1}`, 'false', heading));
      } else {
        tabListUl.append(createTabLi('', `tab${index + 1}`, 'true', heading));
      }
    });

    tabDiv.appendChild(tabListUl);
  }

  const allColleagues = data.colleagues;

  const activeColleagues = allColleagues.filter((colleague) => colleague.statecode === 0);
  const inactiveColleagues = data.colleagues.filter((colleague) => colleague.statecode === 1);

  // Render tab content
  const activatedUsersHeading = activatedDeactivatedColleaguesTable.slice();
  activatedUsersHeading.splice(8, 1);

  const deactivatedUsersHeading = activatedDeactivatedColleaguesTable.slice();
  deactivatedUsersHeading.splice(7, 1);

  if (viewAccess === 'manage') {
    colleaguesTabsMapping.forEach((heading, index) => {
      if (index === 0) {
        const tableContainer = createTag('div', { class: 'table-container' }, createGenericDataTable(activatedUsersHeading, activeColleagues));
        tabDiv.append(
          createTabContentDiv(`tab${index + 1}`, `tab${index + 1}`, false, tableContainer.outerHTML),
        );
      } else if (viewAccess === 'manage') {
        const tableContainer = createTag('div', { class: 'table-container' }, createGenericDataTable(deactivatedUsersHeading, inactiveColleagues));
        tabDiv.append(
          createTabContentDiv(`tab${index + 1}`, `tab${index + 1}`, true, tableContainer.outerHTML),
        );
      }
    });
  } else {
    activatedUsersHeading.splice(5, 4);
    tabDiv.append(createTag('div', { class: 'table-container' }, createGenericDataTable(activatedUsersHeading, activeColleagues)));
  }

  const shouldRenderAddColleagueButton = viewAccess === 'manage';

  const backToProfileLink = a(
    {
      class: 'button primary',
      id: 'backToAccountButton',
      href: '/pages/profile',
    },
    'Back to Account',
  );

  const addColleagueButton = button(
    {
      class: 'add-colleague button primary',
      id: 'addColleagueButton',
      'data-modal-id': 'addColleagueModal',
    },
    'Add Colleague',
  );

  createUserViewWrapperDiv.appendChild(
    div({ class: 'view-buttons' },
      backToProfileLink,
      shouldRenderAddColleagueButton ? addColleagueButton : '',
    ),
  );

  createUserViewWrapperDiv.appendChild(
    a(
      {
        href: 'https://support.zemax.com/hc/articles/1500008380761',
        class: 'visit-knowledgebase secondary',
        target: '_blank',
        rel: 'noreferrer',
      },
      'Visit the Knowledgebase',
    ),
  );
  createUserViewWrapperDiv.appendChild(tabDiv);

  // Add event for add Colleague
  createUserViewWrapperDiv.querySelector('.add-colleague.primary').addEventListener('click', showAddColleagueModal);

  const addColleagueModalContent = createForm(addColleagueFormConfiguration);
  const addColleagueButtonsConfig = [];

  const addColleagueModalDiv = createModal('Add Colleague', addColleagueModalContent, 'add-colleague-modal-content', 'add-colleague-container', 'addColleagueModal', 'add-colleague-modal', addColleagueButtonsConfig);
  // createUserViewWrapperDiv.appendChild(addColleagueModalDiv);

  // Reset password modal
  const resetUserPasswordDialog = getResetUserPasswordDialog();
  const allModalDiv = document.querySelector('.all-modal-content-container');
  allModalDiv.appendChild(resetUserPasswordDialog);
  const resetUserPasswordModalButton = resetUserPasswordDialog.querySelector('.action.reset-user-password-action-button');
  resetUserPasswordModalButton.addEventListener('click', resetUserPassword);
  const resetUserPasswordModalCloseButton = resetUserPasswordDialog.querySelector('.action.reset-user-password-close-button');
  resetUserPasswordModalCloseButton.addEventListener('click', closeModal);
  // END

  const resetButtons = document.querySelectorAll('.license-user-reset-password.action');
  resetButtons.forEach((resetButton) => {
    resetButton.addEventListener('click', showResetUserPasswordModal);
  });

  // Edit user modal
  const editUserDialog = getEditUserDialog();
  allModalDiv.appendChild(editUserDialog);

  const editUserButtons = document.querySelectorAll('.license-user-edit-user.action');
  editUserButtons.forEach((editUserButton) => {
    editUserButton.addEventListener('click', showEditUserModal);
  });
  // END

  const deactivateUserButtons = document.querySelectorAll('.license-user-deactivate-user.action');
  deactivateUserButtons.forEach((deactivateUserButton) => {
    deactivateUserButton.addEventListener('click', (eventNew) => {
      deactivateUser(eventNew, createUserView);
    });
  });

  const activateUserButtons = document.querySelectorAll('.license-user-activate-user.action');
  activateUserButtons.forEach((activateUserButton) => {
    activateUserButton.addEventListener('click', (eventNew) => {
      activateUser(eventNew, createUserView);
    });
  });

  const manageUserButtons = document.querySelectorAll('.license-user-manage-user.action');
  manageUserButtons.forEach((manageUserButton) => {
    manageUserButton.addEventListener('click', manageUserView);
  });

  addTabFeature();
}

function updateAddUserId(event) {
  const addUserActionButton = document.querySelector('.add-user-action-button');
  addUserActionButton.setAttribute('contactId', event.target.getAttribute('id'));
}

function updateChangeUserId(event) {
  const addUserActionButton = document.querySelector('.change-user-action-button');
  addUserActionButton.setAttribute('contactId', event.target.getAttribute('id'));
}

function showAddUserTable(event) {
  const licenseId = event.target.getAttribute('data-license-id');
  const addUserActionButton = document.querySelector('.add-user-action-button');
  addUserActionButton.setAttribute('data-license-id', licenseId);
  showModal(event);
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
    if (containerDiv) {
      modalContentDiv = containerDiv;
    }
  });

  // clear previous modal content
  modalContentDiv.innerHTML = '';
  modalContentDiv.appendChild(await createAddUserToLicenseTable(modalCheckBoxClass));
  const userCheckboxes = document.querySelectorAll(`.${modalCheckBoxClass}`);
  userCheckboxes.forEach((userCheckbox) => {
    userCheckbox.addEventListener('click', eventListenerMethoda);
  });
}

async function createAddUserToLicenseTable(checkboxClass) {
  const data = await execute('dynamics_get_colleagues_view', '', 'GET');
  const colleaguesData = await data.colleagues;
  return createGenericDataTable(getAddUserToLicenseTableConfig(checkboxClass), colleaguesData);
}

function clearProfileLandingView() {
  const mainDiv = document.querySelector('main');
  const sections = mainDiv.querySelectorAll('.section');

  sections.forEach((section) => {
    if (!section.classList.contains('profile-software-download')) {
      section.remove();
    }
  });
}

async function displayLicenseDetailsView(event) {
  clearProfileLandingView();
  window.scrollTo(0, 0);
  const viewAccess = await event.target.getAttribute('data-view-access');
  const licenseId = event.target.getAttribute('data-license-id');
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const mainDiv = document.querySelector('main');
  if (userId && accessToken) {
    const data = await execute('dynamics_get_end_users_for_license', `&license_id=${licenseId}`, 'GET');
    // DOM creation
    const licenseDetailsViewWrapperDiv = createTag('div', { class: 'license-details-view-wrapper' }, '');
    const licenseDetailsViewDiv = createTag('div', { class: 'section user-licenses-container license-details-view', 'data-view-id': 'licenseDetailsView' }, licenseDetailsViewWrapperDiv);

    const licenseDetailsDiv = createTag('div', { class: 'license-details' }, '');
    const endUsersDetailsDiv = createTag('div', { class: 'end-users-details' }, '');
    licenseDetailsViewWrapperDiv.append(createTag('a', { class: 'button primary', id: 'backToAccountButton', href: '/pages/profile' }, 'Back to Account'));
    licenseDetailsViewWrapperDiv.append(licenseDetailsDiv);
    licenseDetailsViewWrapperDiv.append(endUsersDetailsDiv);
    licenseDetailsViewWrapperDiv.append(createTag('a', {
      class: 'more-info secondary',
      href: 'https://support.zemax.com/hc/en-us/sections/1500001481261',
      'aria-label': 'More information about license management',
      target: '_blank',
      rel: 'noreferrer',
    }, 'More information about license management'));

    mainDiv.insertBefore(licenseDetailsViewDiv, mainDiv.firstChild);

    const manageLicenseH2 = createTag('h2', '', `Manage License #${data.licenseid}`);
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
    const nickNameSetValue = data.license_detail[0].zemax_nickname ?? '';

    if (viewAccess === 'manage') {
      const nickNameTextField = createTag('input', { class: 'nickname', value: nickNameSetValue }, '');
      licenseDetailsRow.appendChild(nickNameTextField);
      const saveNicknameButton = createTag('button', { class: 'save-nickname action', type: 'button' }, 'Save');
      saveNicknameButton.addEventListener('click', updateLicenseNickname);
      licenseDetailsRow.appendChild(saveNicknameButton);
    } else {
      const elementDetailCellDiv = createTag('div', { class: 'element-detail-cell' });
      const elementDetailCellHeading = createTag('h3', { class: 'element-detail-cell-heading' }, 'Nickname');
      const elementDetailCellDataPara = createTag('p', { class: 'element-detail-cell-data' }, nickNameSetValue);
      elementDetailCellDiv.appendChild(elementDetailCellHeading);
      elementDetailCellDiv.appendChild(elementDetailCellDataPara);
      licenseDetailsRow.appendChild(elementDetailCellDiv);
    }
    licenseDetailsDataDiv.appendChild(licenseDetailsRow);

    endUsersDetailsDiv.innerHTML = '';
    const licenseUsers = data.users;
    const endUsersH2 = createTag('h2', '', 'End Users');
    endUsersDetailsDiv.appendChild(endUsersH2);

    await addColleaguesToUserActionModal('add-user-container', 'add-user-checkbox', updateAddUserId);

    if (viewAccess === 'manage') {
      const addUserButton = createTag('button', {
        class: 'add-user-to-license action',
        type: 'button',
        'data-modal-id': 'addUserModal',
        'data-license-id': licenseId,
        'data-view-access': 'manage',
      }, 'Add End User');
      endUsersDetailsDiv.appendChild(addUserButton);
      addUserButton.addEventListener('click', showAddUserTable);
    }

    if (licenseUsers && licenseUsers.length > 0) {
      const licenseDetailsUsersTable = getLicenseDetailsUsersTable(licenseId);
      if (viewAccess === 'view') {
        licenseDetailsUsersTable.splice(4, 2);
      }
      const tableElement = createGenericDataTable(licenseDetailsUsersTable, licenseUsers);
      const tableContainer = createTag('div', { class: 'table-container' }, tableElement);
      endUsersDetailsDiv.appendChild(tableContainer);

      const removeButtons = tableElement.querySelectorAll('.license-user-remove-user');
      removeButtons.forEach((removeButton) => {
        removeButton.addEventListener('click', showUserActionModal);
      });

      const changeUserLicenseButtons = tableElement.querySelectorAll('.license-user-change-user');
      changeUserLicenseButtons.forEach((changeUserLicenseButton) => {
        changeUserLicenseButton.addEventListener('click', showUserActionModal);
      });
    } else {
      endUsersDetailsDiv.appendChild(createTag('p', { class: 'no-end-user-license' }, 'This license does not currently have an end user. To add and end user, please click the Add End User button.'));
    }
  } else {
    window.location.assign(`${window.location.origin}`);
  }
}

async function addManageLicenseFeature() {
  const allModalContentContainerDiv = document.querySelector('.all-modal-content-container');

  // START Add User Modal
  const addUserDialog = getAddUserDialog();

  allModalContentContainerDiv.append(addUserDialog);
  const createUserButtonAddUser = addUserDialog.querySelector('.action.create-user-action-button');
  const addUserButton = addUserDialog.querySelector('.action.add-user-action-button');
  const addUserCancelButton = addUserDialog.querySelector('.action.add-user-cancel-button');
  createUserButtonAddUser.addEventListener('click', createUserView);
  addUserButton.addEventListener('click', (eventAddUserToLicense) => {
    addUserToALicense(eventAddUserToLicense, displayLicenseDetailsView);
  });
  addUserCancelButton.addEventListener('click', closeModal);
  createUserButtonAddUser.addEventListener('click', closeModal);
  // END Add User Modal

  // START Delete User Modal
  const deleteUserDialog = getDeleteUserDialog();

  allModalContentContainerDiv.append(deleteUserDialog);
  const deleteUserButton = deleteUserDialog.querySelector('.delete-user-action-button');
  const deleteUserModalCloseButton = deleteUserDialog.querySelector('.delete-user-cancel-button');
  deleteUserButton.addEventListener('click', (eventRemoveUserFromLicense) => {
    removeUserFromLicense(eventRemoveUserFromLicense, displayLicenseDetailsView);
  });
  deleteUserModalCloseButton.addEventListener('click', closeModal);
  allModalContentContainerDiv.append(deleteUserDialog);
  // END Delete User Modal

  // START Change User Modal
  const changeUserDialog = getChangeUserDialog();
  allModalContentContainerDiv.append(changeUserDialog);
  const createUserButtonChangeUser = changeUserDialog.querySelector('.action.create-user-action-button');
  const changeUserButton = allModalContentContainerDiv.querySelector('.action.change-user-action-button');
  const changeUserCancelButton = allModalContentContainerDiv.querySelector('.action.change-user-cancel-button');
  createUserButtonChangeUser.addEventListener('click', createUserView);
  changeUserButton.addEventListener('click', (eventChangeUserForALicense) => {
    changeUserForALicense(eventChangeUserForALicense, displayLicenseDetailsView);
  });
  changeUserCancelButton.addEventListener('click', closeModal);
  // END Change User Modal

  await addColleaguesToUserActionModal('change-user-container', 'change-user-checkbox', updateChangeUserId);

  const manageButtons = document.querySelectorAll('.manage-view-license');
  manageButtons.forEach((manageButton) => {
    manageButton.addEventListener('click', displayLicenseDetailsView);
  });
}

function createTableHeaderMapping(data) {
  const { allLicenseTabHeadingMapping } = getLocaleConfig('en_us', 'userLicenses');
  const tableHeaderMapping = [];

  if (data.my_licenses_admin?.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[0]}|my_licenses_admin`);
  }

  if (data.my_licenses?.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[1]}|my_licenses`);
  }

  if (data.company_licenses?.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[2]}|company_licenses`);
  }

  if (data.academic_licenses?.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[3]}|academic_licenses`);
  }

  if (data.academic_esp_licenses?.length > 0) {
    tableHeaderMapping.push(`${allLicenseTabHeadingMapping[4]}|academic_esp_licenses`);
  }
  return tableHeaderMapping;
}

function createLicencesTable(rows) {
  const tableContainer = createTag('div', { class: 'table-container' }, '');
  const tableElement = createGenericDataTable(userLicensesTable, rows);
  tableContainer.appendChild(tableElement);
  return tableContainer;
}

export default async function decorate(block) {
  // noinspection ES6MissingAwait
  loadData(block);
}

async function loadData(block) {
  const data = await execute('dynamics_get_licenses_by_auth0id', '', 'GET');
  const viewAccessMatrix = calculateViewMatrix(JSON.parse(localStorage.getItem('webroles')));
  const mainDiv = document.querySelector('main');
  // Placeholder for all modal content
  const modalContainerDiv = createTag('div', { class: 'all-modal-content-container' }, '');
  mainDiv.insertBefore(modalContainerDiv, mainDiv.firstChild);
  const viewAllColleagueButton = createTag('button', { class: 'view-all-colleague action primary-license-action-button' }, 'View All Colleague');
  viewAllColleagueButton.addEventListener('click', createUserView);
  block.append(viewAllColleagueButton);
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
        createTabContentDiv(`tab${index + 1}`, `tab${index + 1}`, false, createLicencesTable(data[heading.split('|')[1]]).outerHTML),
      );
    } else {
      tabDiv.append(
        createTabContentDiv(`tab${index + 1}`, `tab${index + 1}`, true, createLicencesTable(data[heading.split('|')[1]]).outerHTML),
      );
    }
  });

  block.append(tabDiv);
  addTabFeature();
  addManageLicenseFeature();
  block.appendChild(
    a(
      {
        href: 'https://support.zemax.com/hc/en-us/sections/1500001481261',
        class: 'more-info secondary',
        target: '_blank',
        rel: 'noreferrer',
      },
      'More information about license management',
    ),
  );
  updateViewButtonPerAccess(viewAccessMatrix);
}

function calculateViewMatrix(webroles) {
  let viewAccess = 'none';
  if (!webroles) {
    localStorage.setItem('viewAccess', 'view');
    return 'view';
  }

  webroles.forEach((webrole) => {
    if (viewAccess === 'manage') {
      return;
    }
    if (webrole.adx_name === 'Customer Self Service Admin') {
      viewAccess = 'manage';
      return;
    } if (webrole.adx_name === 'Supported Users ZOV') {
      viewAccess = 'view';
    } else if (viewAccess !== 'manage' || viewAccess !== 'view') {
      viewAccess = 'none';
    }
  });
  localStorage.setItem('viewAccess', viewAccess);
  return viewAccess;
}

function updateViewButtonPerAccess(viewAccess) {
  const manageOrViewButtons = document.querySelectorAll('.manage-view-license.action');
  const primaryLicenseActionButton = document.querySelector('.primary-license-action-button');

  manageOrViewButtons.forEach((manageOrViewButton) => {
    if (viewAccess === 'none') {
      manageOrViewButton.remove();
      if (primaryLicenseActionButton) {
        primaryLicenseActionButton.remove();
      }
    } else if (viewAccess === 'view') {
      manageOrViewButton.setAttribute('data-view-access', 'view');
      manageOrViewButton.textContent = 'View';
      if (primaryLicenseActionButton) {
        primaryLicenseActionButton.setAttribute('data-view-access', 'view');
        primaryLicenseActionButton.textContent = 'View All Colleague';
      }
    } else if (viewAccess === 'manage') {
      manageOrViewButton.setAttribute('data-view-access', 'manage');
      manageOrViewButton.textContent = 'Manage';
      if (primaryLicenseActionButton) {
        primaryLicenseActionButton.setAttribute('data-view-access', 'manage');
        primaryLicenseActionButton.textContent = 'Manage All Colleague';
      }
    }
  });
}
// Function to listen for the storage event
function storageEventHandler(event) {
  if (event.storageArea === localStorage && event.key === 'webroles') {
    calculateViewMatrix(localStorage.getItem('webroles'));
  }
  if (event.storageArea === localStorage && event.key === 'viewAccess') {
    updateViewButtonPerAccess(localStorage.getItem('viewAccess'));
  }
}

window.addEventListener('storage', storageEventHandler);
