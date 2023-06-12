import execute from '../../scripts/zemax-api.js';
import { closeModal, showSnackbar } from '../../scripts/scripts.js';
import { span } from '../../scripts/dom-helpers.js';

function processResponse(event, data, renderViewMethod, hideActionModal,
  successToastMessage, successResponseCode) {
  let successCode = 204;
  if (successResponseCode) {
    successCode = successResponseCode;
  }
  if (data?.status === successCode) {
    if (hideActionModal) {
      closeModal(event);
    }
    // Re render view after the data is updated
    if (renderViewMethod) {
      renderViewMethod(event);
    }
    if (successToastMessage) {
      showSnackbar(successToastMessage, 'success');
    }
  } else {
    showSnackbar(data.message, 'error');
  }
}

export async function addColleague(event, callback) {
  event.preventDefault();
  const formNode = event.target.parentNode;
  const urlConfig = new FormData(formNode);
  urlConfig.append('parentcustomerid_account', localStorage.getItem('parentcustomerid'));
  const data = await execute('dynamics_add_colleague', urlConfig, 'POST');

  processResponse(event, data, callback, true, 'Colleague was added successfully');
}

export async function updateUserInfo(event, callback) {
  event.preventDefault();
  event.target.classList.add('disabled');
  const jobtitle = event.target.parentNode.querySelector('#job-title').value;
  const telephone1 = event.target.parentNode.querySelector('#phone').value;
  const contactid = event.target.getAttribute('data-contactid');
  const urlConfig = { jobtitle, telephone1, contactid };
  const data = await execute('dynamics_edit_colleague', urlConfig, 'PATCH', '.edit-user.loading-icon');
  event.target.classList.remove('disabled');
  processResponse(event, data, callback, true, 'Information updated');
}

export async function resetUserPassword(event) {
  const contactid = event.target.getAttribute('data-contactid');
  const urlConfig = { contactid };
  const data = await execute('dynamics_resetpassword_contactid', urlConfig, 'POST');

  processResponse(event, data, false, true, 'Reset Email was sent successfully', 200);
}

export async function activateUser(event, callback) {
  const contactid = event.target.getAttribute('data-contactid');
  const urlConfig = { contact_id: contactid };
  const data = await execute('dynamics_activate_userid', urlConfig, 'PATCH');

  processResponse(event, data, callback, false, 'User was activated successfully');
}

export async function deactivateUser(event, callback) {
  const contactid = event.target.getAttribute('data-contactid');
  const urlConfig = { contact_id: contactid };
  const data = await execute('dynamics_deactivate_userid', urlConfig, 'PATCH');

  processResponse(event, data, callback, false, 'User was deactivated successfully');
}

export async function updateLicenseNickname(event) {
  const saveButton = event.target;
  saveButton.classList.add('disabled');
  const id = event.target.getAttribute('data-license-id');
  const { value } = document.querySelector('.nickname');
  const urlConfig = { id, nickname: value };
  if (value) {
    await execute('dynamics_set_license_nickname', urlConfig, 'PATCH', '.save-nickname.loading-icon');
    showSnackbar('Nickname updated successfully', 'success');
  } else {
    showSnackbar('Error while updating nickname', 'error');
  }

  saveButton.classList.remove('disabled');
}

export async function changeUserForALicense(event, callback) {
  event.target.classList.add('disabled');
  const contactId = event.target.getAttribute('contactid');
  const newProductUserId = event.target.getAttribute('data-new-productuserid');
  const urlConfig = { contact_id: contactId, new_productuserid: newProductUserId };
  const data = await execute('dynamics_change_enduser_license', urlConfig, 'PATCH', '.change-user.loading-icon');
  event.target.classList.remove('disabled');

  processResponse(event, data, callback, true, 'User was changed successfully');
}

export async function addUserToALicense(event, callback) {
  event.target.classList.add('disabled');
  const contactId = event.target.getAttribute('contactid');
  const licenseid = event.target.getAttribute('data-license-id');
  const urlConfig = { contactId, licenseid };
  const data = await execute('dynamics_add_end_user', urlConfig, 'POST', '.add-user.loading-icon');
  event.target.classList.remove('disabled');

  processResponse(event, data, callback, true, 'User added successfully');
}

export async function removeUserFromLicense(event, callback) {
  event.target.classList.add('disabled');
  const newproductuserid = event.target.getAttribute('data-new-productuserid');
  const urlConfig = { new_productuserid: newproductuserid };
  const data = await execute('dynamics_remove_enduser_from_license', urlConfig, 'DELETE', '.delete-user.loading-icon');
  event.target.classList.remove('disabled');
  processResponse(event, data, callback, true, 'User was removed from license');
}

export async function assignLicenseToUser(event, callback) {
  const contactId = event.target.getAttribute('data-contact-id');
  const licenseid = event.target.getAttribute('data-license-id');
  const urlConfig = { contactId, licenseid };
  const data = await execute('dynamics_add_end_user', urlConfig, 'POST');

  // TODO handle response and add toast message
  processResponse(event, data, callback, true);
}

export async function updateColleagueInfo(event) {
  const saveButton = event.target;
  saveButton.classList.add('disabled');
  const colleagueDataDiv = document.querySelector('.colleague-details-data');
  const jobtitle = colleagueDataDiv.querySelector('.colleague-job-title').value;
  const telephone1 = colleagueDataDiv.querySelector('.colleague-bussiness-phone').value;
  const contactid = event.target.getAttribute('data-contact-id');
  const urlConfig = { jobtitle, telephone1, contactid };
  const data = await execute('dynamics_edit_colleague', urlConfig, 'PATCH', '.update-colleague-info.loading-icon');

  saveButton.classList.remove('disabled');
  processResponse(event, data, false, false, 'Information updated');
}
