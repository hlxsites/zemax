import { getLocaleConfig } from '../../scripts/zemax-config.js';
import { a, button } from '../../scripts/dom-helpers.js';
import {
  createModal, createTag, createGenericTable, hideModal, showModal,
} from '../../scripts/scripts.js';
import execute from '../../scripts/zemax-api.js';
import getLicenseDetailsUsersTable from '../../configs/tables/licenseDetailsUsersTableConfig.js';
import getAddUserToLicenseTableConfig from '../../configs/tables/addUserToLicenseTableConfig.js';
import activatedDeactivatedColleaguesTable from '../../configs/tables/activatedDeactivatedColleaguesTableConfig.js';

function createForm(config) {
  const form = createTag('form', { id: config.formId }, '');

  config.fields.forEach((field) => {
    const label = createTag('label', { for: field.id }, field.label);
    const input = createTag('input', { type: 'text', id: field.id }, '');

    if (field.value) {
      input.setAttribute('value', field.value);
    }

    if (field.readOnly) {
      input.setAttribute('readonly', '');
    }

    if (field.disabled) {
      input.setAttribute('disabled', '');
    }

    form.appendChild(label);
    form.appendChild(input);
  });

  const submitButton = createTag('input', {
    type: 'submit', id: config.submitId, class: config.submitClass, value: config.submitText, 'data-modal-id': config.submitDataModalId,
  });
  form.appendChild(submitButton);

  return form;
}

async function addColleague(event) {
  event.preventDefault();
  const formNode = event.target.parentNode;
  const firstName = formNode.querySelector('#first-name').value;
  const lastName = formNode.querySelector('#last-name').value;
  const email = formNode.querySelector('#email').value;
  const jobTitle = formNode.querySelector('#job-title').value;
  const phone = formNode.querySelector('#phone').value;
  const personalPhone = formNode.querySelector('#personal-phone').value;
  const parentcustomerid = localStorage.getItem('parentcustomerid');
  const data = await execute('dynamics_add_colleague', `&firstname=${firstName}&lastname=${lastName}&emailaddress1=${email}&jobtitle=${jobTitle}&telephone1=${phone}&mobilephone=${personalPhone}&parentcustomerid_account=${parentcustomerid}`, 'POST');
  if (data?.status === 204) {
    // TODO show success toast message
    hideModal(event);
    // Re render after the data is updated
    createUser(event);
    // shoe(event);
  } else {
    console.log('error ', data);
  }
  // &firstname=Shehjad&lastname=test&emailaddress1=shehad07%40gmail.com&jobtitle=ss&telephone1=3126135908&mobilephone=3126135908&parentcustomerid_account=a5148401-c82e-e911-a96a-000d3a37870e
}
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

async function updateUserInfo(event) {
  event.preventDefault();
  const jobtitle = event.target.parentNode.querySelector('#job-title').value;
  const telephone = event.target.parentNode.querySelector('#phone').value;
  const contactid = event.target.getAttribute('data-contactid');
  const data = await execute('dynamics_edit_colleague', `&jobtitle=${jobtitle}&telephone1=${telephone}&contactid=${contactid}`, 'PATCH');
  if (data?.status === 204) {
    // TODO show success toast message
    hideModal(event);
    // Re render after the data is updated
    createUser(event);
  } else {
    console.log('error ', data);
  }
}

async function showAddColleagueModal(event) {
  showModal(event);
  const addColleagueSubmitButton = document.querySelector('#addColleagueSubmitButton');
  if (addColleagueSubmitButton) {
    addColleagueSubmitButton.addEventListener('click', addColleague);
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
  submitButton.addEventListener('click', updateUserInfo);
  showModal(event);
}

async function resetUserPassword(event) {
  const contactid = event.target.getAttribute('data-contactid');
  // TODO check method type
  const data = await execute('dynamics_resetpassword_contactid', `&contactid=${contactid}`, 'POST');
  if (data?.status === 204) {
    // TODO show success toast message
    hideModal(event);
  } else {
    console.log('error ', data);
  }
}

async function activateUser(event) {
  const contactid = event.target.getAttribute('data-contactid');
  // TODO check method type
  const data = await execute('dynamics_activate_userid', `&contact_id=${contactid}`, 'PATCH');
  if (data?.status === 204) {
    // TODO show success toast message
    // Re render after the data is updated
    createUser(event);
  } else {
    console.log('error ', data);
  }
}

async function deactivateUser(event) {
  const contactid = event.target.getAttribute('data-contactid');
  // TODO check method type
  const data = await execute('dynamics_deactivate_userid', `&contact_id=${contactid}`, 'PATCH');
  if (data?.status === 204) {
    // TODO show success toast message
    // Re render after the data is updated
    createUser(event);
  } else {
    console.log('error ', data);
  }
}

async function createUser(event) {
  hideModal(event);
  hideOtherUserLicenseInformation();
  const licenseDetailsDiv = document.querySelector('.license-details');
  const endUserDetailsDiv = document.querySelector('.end-users-details');
  const licenseBlock = document.querySelector('.user-licenses.block');
  if (licenseDetailsDiv) {
    licenseDetailsDiv.remove();
  }
  if (endUserDetailsDiv) {
    endUserDetailsDiv.remove();
  }

  const tabDiv = createTag('div', { class: 'tabs' });
  const tabListUl = createTag('ul', { class: 'tabs-nav', role: 'tablist' });
  const colleaguesTabsMapping = ['Active Colleagues', 'Deactivated Colleagues'];

  const data = await execute('dynamics_get_colleagues_manage', '', 'GET');

  // Render tab headings
  colleaguesTabsMapping.forEach((heading, index) => {
    if (index === 0) {
      tabListUl.append(createTabLi('active', `tab${index + 1}`, 'false', heading));
    } else {
      tabListUl.append(createTabLi('', `tab${index + 1}`, 'true', heading));
    }
  });

  tabDiv.appendChild(tabListUl);

  const allColleagues = data.colleagues;

  const activeColleagues = allColleagues.filter((colleague) => colleague.statecode === 0);
  const inactiveColleagues = data.colleagues.filter((colleague) => colleague.statecode === 1);

  // Render tab content
  const activatedUsersHeading = activatedDeactivatedColleaguesTable.slice();
  activatedUsersHeading.splice(8, 1);

  const deactivatedUsersHeading = activatedDeactivatedColleaguesTable.slice();
  deactivatedUsersHeading.splice(7, 1);

  // TODO createGenericTable rename to createGenericTable
  colleaguesTabsMapping.forEach((heading, index) => {
    if (index === 0) {
      const tableContainer = createTag('div', { class: 'table-container' }, createGenericTable(activatedUsersHeading, activeColleagues));
      tabDiv.append(
        createContentDiv(`tab${index + 1}`, `tab${index + 1}`, false, tableContainer.outerHTML),
      );
    } else {
      const tableContainer = createTag('div', { class: 'table-container' }, createGenericTable(deactivatedUsersHeading, inactiveColleagues));
      tabDiv.append(
        createContentDiv(`tab${index + 1}`, `tab${index + 1}`, true, tableContainer.outerHTML),
      );
    }
  });

  licenseBlock.appendChild(
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

  licenseBlock.appendChild(
    button(
      {
        class: 'add-colleague button primary',
        id: 'addColleagueButton',
        'data-modal-id': 'addColleagueModal',
      },
      'Add Colleague',
    ),
  );
  licenseBlock.appendChild(tabDiv);

  // Add event for add Colleague
  licenseBlock.querySelector('.add-colleague.primary').addEventListener('click', showAddColleagueModal);

  // Add colleague modal
  const configAddColleague = {
    fields: [
      { id: 'first-name', label: 'First Name' },
      { id: 'last-name', label: 'Last Name' },
      { id: 'job-title', label: 'Job Title' },
      { id: 'email', label: 'Email' },
      { id: 'phone', label: 'Business Phone' },
      { id: 'personal-phone', label: 'Mobile Phone' },
    ],
    submitText: 'Add Colleague',
    submitId: 'addColleagueSubmitButton',
    submitClass: 'add-colleague-action-button primary button',
    submitDataModalId: 'addColleagueModal',
    formId: 'addColleagueEditForm',
  };

  const addColleagueModalContent = createForm(configAddColleague);
  const addColleagueButtonsConfig = [];

  const addColleagueModalDiv = createModal('Add Colleague', addColleagueModalContent, 'add-colleague-modal-content', 'add-colleague-container', 'addColleagueModal', 'add-colleague-modal', addColleagueButtonsConfig);
  licenseBlock.appendChild(addColleagueModalDiv);

  // Reset password modal
  const modalResetUserPasswordDescription = createTag('p', '', 'Please confirm this action to generate the password reset email');
  const resetUserPasswordModalCloseButton = createTag('button', { class: 'action secondary', 'data-modal-id': 'resetUserPasswordModal' }, 'Cancel');
  const resetUserPasswordModalButton = createTag('button', { class: 'action important reset-user-password-action-button', 'data-modal-id': 'resetUserPasswordModal' }, 'Send Password Reset Email');

  const resetUserPasswordButtonsConfig = [
    {
      userAction: 'click',
      button: resetUserPasswordModalCloseButton,
      listenerMethod: hideModal,
    }, {
      userAction: 'click',
      button: resetUserPasswordModalButton,
      listenerMethod: resetUserPassword,
    },
  ];

  const modalResetUserPasswordModalDiv = createModal('Confirmation Required', modalResetUserPasswordDescription, 'reset-user-password-modal-content', 'reset-user-password-container', 'resetUserPasswordModal', 'reset-user-password-modal', resetUserPasswordButtonsConfig);
  licenseBlock.appendChild(modalResetUserPasswordModalDiv);

  const resetButtons = document.querySelectorAll('.license-user-reset-password.action');
  resetButtons.forEach((resetButton) => {
    resetButton.addEventListener('click', showResetUserPasswordModal);
  });

  // Edit user modal
  const config = {
    fields: [
      {
        id: 'first-name', label: 'First Name', value: '', readOnly: true, disabled: true,
      },
      {
        id: 'last-name', label: 'Last Name', value: '', readOnly: true, disabled: true,
      },
      { id: 'job-title', label: 'Job Title' },
      {
        id: 'email', label: 'Email', value: '', readOnly: true, disabled: true,
      },
      { id: 'phone', label: 'Business Phone' },
    ],
    submitText: 'Submit',
    submitId: 'userEditSubmitButton',
    submitClass: 'edit-user-action-button',
    submitDataModalId: 'editUserModal',
    formId: 'editUserEditForm',
  };

  const editUserModalContent = createForm(config);
  const editUserButtonsConfig = [];

  const editUserModalDiv = createModal('Edit Colleague', editUserModalContent, 'edit-user-modal-content', 'edit-user-container', 'editUserModal', 'edit-user-modal', editUserButtonsConfig);
  licenseBlock.appendChild(editUserModalDiv);

  const editUserButtons = document.querySelectorAll('.license-user-edit-user.action');
  editUserButtons.forEach((editUserButton) => {
    editUserButton.addEventListener('click', showEditUserModal);
  });

  const deactivateUserButtons = document.querySelectorAll('.license-user-deactivate-user.action');
  deactivateUserButtons.forEach((deactivateUserButton) => {
    deactivateUserButton.addEventListener('click', deactivateUser);
  });

  const activateUserButtons = document.querySelectorAll('.license-user-activate-user.action');
  activateUserButtons.forEach((activateUserButton) => {
    activateUserButton.addEventListener('click', activateUser);
  });

  addTabFeature();
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
  if (data?.status === 204) {
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

  if (data?.status === 204) {
    // TODO show success toast message
    hideModal(event);
    // eslint-disable-next-line no-use-before-define
    displayLicenseDetails(event);
  } else {
    console.log('error ', data);
  }
}

async function createAddUserToLicenseTable(checkboxClass) {
  const data = await execute('dynamics_get_colleagues_view', '', 'GET');
  const colleaguesData = await data.colleagues;
  return createGenericTable(getAddUserToLicenseTableConfig(checkboxClass), colleaguesData);
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

async function removeUserFromLicense(event) {
  const newproductuserid = event.target.getAttribute('data-new-productuserid');
  const data = await execute('dynamics_remove_enduser_from_license', `&new_productuserid=${newproductuserid}`, 'DELETE');
  // TODO handle response and add toast message

  if (data?.status === 204) {
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
  if (value) {
    const data = await execute('dynamics_set_license_nickname', `&id=97d53652-122f-e611-80ea-005056831cd4&nickname=${value}`, 'PATCH');
    console.log('Updated license nickname ', data);
  } else {
    // TODO handle response and add toast message
    alert('Provide nickname value before saving');
  }
}

function hideOtherUserLicenseInformation() {
  const sections = document.querySelectorAll('.section');
  const moreInformationLink = document.querySelector('.more-info-access.secondary');

  // Remove more information link
  if (moreInformationLink) {
    moreInformationLink.remove();
  }

  sections.forEach((section) => {
    if (section.classList.contains('user-licenses-container')) {
      const tabsContent = section.querySelector('.tabs');
      if (tabsContent) {
        section.querySelector('.tabs').remove();
      }
      const licenseComponent = section.querySelector('.user-licenses.block');
      licenseComponent.querySelector('h3').parentElement.parentElement.remove();

      let backToProfileButton = licenseComponent.querySelector('#backToAccountButton');
      if (!backToProfileButton) {
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
  if (userId && accessToken) {
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

    const nickNameSetValue = data.license_detail[0].zemax_nickname ?? '';
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

    if (licenseUsers && licenseUsers.length > 0) {
      const licenseDetailsUsersTable = getLicenseDetailsUsersTable(licenseId);
      const tableElement = createGenericTable(licenseDetailsUsersTable, licenseUsers);
      const tableContainer = createTag('div', { class: 'table-container' }, tableElement);
      endUsersDetailsDiv.appendChild(tableContainer);

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
  } else {
    window.location.assign(`${window.location.origin}`);
  }
}

async function addManageLicenseFeature(block) {
  const licenseDetailsDiv = createTag('div', { class: 'license-details' }, '');
  const endUsersDetailsDiv = createTag('div', { class: 'end-users-details' }, '');
  block.append(licenseDetailsDiv);
  block.append(endUsersDetailsDiv);

  // Add User Modal
  const createUserButton = createTag('button', { class: 'action secondary create-user-action-button', 'data-modal-id': 'addUserModal' }, 'Create User');
  const addUserButton = createTag('button', { class: 'action add-user-action-button', 'data-modal-id': 'addUserModal' }, 'Add User');
  const addUserModalCloseButton = createTag('button', { class: 'action', 'data-modal-id': 'addUserModal' }, 'Close');
  const buttonsConfig = [
    {
      userAction: 'click',
      button: createUserButton,
      listenerMethod: createUser,
    }, {
      userAction: 'click',
      button: addUserButton,
      listenerMethod: addUserToALicense,
    }, {
      userAction: 'click',
      button: addUserModalCloseButton,
      listenerMethod: hideModal,
    },
  ];

  const modalAddUserDiv = createModal('Add End User to License', '', 'add-user-modal-content', 'add-user-container table-container', 'addUserModal', 'add-user-modal', buttonsConfig);
  block.append(modalAddUserDiv);

  // Delete User Modal
  const modalDeleteDescription = createTag('p', '', 'Please confirm this action to remove end user');
  const deleteUserButton = createTag('button', { class: 'action important delete-user-action-button', 'data-modal-id': 'deleteUserModal' }, 'Yes, remove End User');
  const deleteUserModalCloseButton = createTag('button', { class: 'action secondary', 'data-modal-id': 'deleteUserModal' }, 'Cancel');

  const deleteButtonsConfig = [
    {
      userAction: 'click',
      button: deleteUserButton,
      listenerMethod: removeUserFromLicense,
    }, {
      userAction: 'click',
      button: deleteUserModalCloseButton,
      listenerMethod: hideModal,
    },
  ];

  const modalDeleteUserModalDiv = createModal('Confirmation Required', modalDeleteDescription, 'delete-user-modal-content', 'delete-user-container table-container', 'deleteUserModal', 'delete-user-modal', deleteButtonsConfig);
  block.append(modalDeleteUserModalDiv);

  // Change User Modal
  const createUserButtonChangeUser = createTag('button', { class: 'action secondary create-user-action-button', 'data-modal-id': 'changeUserModal' }, 'Create User');
  const changeUserButton = createTag('button', { class: 'action change-user-action-button', 'data-modal-id': 'changeUserModal' }, 'Change User');
  const changeUserModalCloseButton = createTag('button', { class: 'action', 'data-modal-id': 'changeUserModal' }, 'Close');

  const createUserButtonsConfig = [
    {
      userAction: 'click',
      button: createUserButtonChangeUser,
      listenerMethod: createUser,
    }, {
      userAction: 'click',
      button: changeUserButton,
      listenerMethod: changeUserForALicense,
    }, {
      userAction: 'click',
      button: changeUserModalCloseButton,
      listenerMethod: hideModal,
    },
  ];

  const modalChangeUserDiv = createModal('Choose a User', '', 'change-user-modal-content', 'change-user-container table-container', 'changeUserModal', 'change-user-modal', createUserButtonsConfig);
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
  const tableContainer = createTag('div', { class: 'table-container' }, '');
  const tableElement = document.createElement('table');

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const { tableHeadings } = getLocaleConfig('en_us', 'userLicenses');

  tableHeadings.forEach((tableHeading) => {
    const tableHeadingElement = document.createElement('th');
    const tableButton = document.createElement('button');
    tableButton.innerHTML = tableHeading;
    tableHeadingElement.appendChild(tableButton);
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
        td.innerText = headingValue ?? '';
      }
      trBody.appendChild(td);
    });

    tbody.appendChild(trBody);
  });

  tableElement.appendChild(tbody);
  tableContainer.appendChild(tableElement);
  return tableContainer;
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
  // noinspection ES6MissingAwait
  loadData(block);
}

async function loadData(block) {
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
  block.appendChild(
    a(
      {
        href: 'https://support.zemax.com/hc/en-us/sections/1500001481261',
        class: 'more-info-access secondary',
        target: '_blank',
        rel: 'noreferrer',
      },
      'More information about license management',
    ),
  );
}
