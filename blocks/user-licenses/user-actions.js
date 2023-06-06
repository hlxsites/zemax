import execute from '../../scripts/zemax-api.js';
import { hideModal, showSnackbar } from '../../scripts/scripts.js';

function processResponse(event, data, renderViewMethod, hideActionModal,
  successToastMessage, successResponseCode) {
  let successCode = 204;
  if (successResponseCode) {
    successCode = successResponseCode;
  }
  if (data?.status === successCode) {
    if (hideActionModal) {
      hideModal(event);
    }
    // Re render view after the data is updated
    if (renderViewMethod) {
      renderViewMethod(event);
    }
    if (successToastMessage) {
      showSnackbar(successToastMessage);
    }
  } else {
    showSnackbar(data.message);
  }
}

export async function addColleague(event, callback) {
  event.preventDefault();
  const formNode = event.target.parentNode;
  const formData = new FormData(formNode);
  formData.append('parentcustomerid_account', localStorage.getItem('parentcustomerid'));
  const urlParams = new URLSearchParams(formData).toString();
  const data = await execute('dynamics_add_colleague', `&${urlParams}`, 'POST');

  processResponse(event, data, callback, true, 'Colleague was added successfully');
}

export async function updateUserInfo(event, callback) {
  event.preventDefault();
  const jobtitle = event.target.parentNode.querySelector('#job-title').value;
  const telephone = event.target.parentNode.querySelector('#phone').value;
  const contactid = event.target.getAttribute('data-contactid');
  const data = await execute('dynamics_edit_colleague', `&jobtitle=${jobtitle}&telephone1=${telephone}&contactid=${contactid}`, 'PATCH');

  processResponse(event, data, callback, true, 'Information updated');
}

export async function resetUserPassword(event) {
  const contactid = event.target.getAttribute('data-contactid');
  // TODO check method type
  const data = await execute('dynamics_resetpassword_contactid', `&contactid=${contactid}`, 'POST');

  processResponse(event, data, false, true, 'Reset Email was sent successfully', 200);
}

export async function activateUser(event, callback) {
  const contactid = event.target.getAttribute('data-contactid');
  const data = await execute('dynamics_activate_userid', `&contact_id=${contactid}`, 'PATCH');

  processResponse(event, data, callback, false, 'User was activated successfully');
}

export async function deactivateUser(event, callback) {
  const contactid = event.target.getAttribute('data-contactid');
  const data = await execute('dynamics_deactivate_userid', `&contact_id=${contactid}`, 'PATCH');

  processResponse(event, data, callback, false, 'User was deactivated successfully');
}

export async function updateLicenseNickname() {
  const { value } = document.querySelector('.nickname');
  if (value) {
    await execute('dynamics_set_license_nickname', `&id=97d53652-122f-e611-80ea-005056831cd4&nickname=${value}`, 'PATCH');
    showSnackbar('Nickname updated successfully');
  } else {
    showSnackbar('Error while updating nickname');
  }
}

export async function changeUserForALicense(event, callback) {
  const contactId = event.target.getAttribute('contactid');
  const newProductUserId = event.target.getAttribute('data-new-productuserid');
  const data = await execute('dynamics_change_enduser_license', `&contact_id=${contactId}&new_productuserid=${newProductUserId}`, 'PATCH');

  processResponse(event, data, callback, true, 'User was changed successfully');
}

export async function addUserToALicense(event, callback) {
  const contactId = event.target.getAttribute('contactid');
  const licenseId = event.target.getAttribute('data-license-id');
  const data = await execute('dynamics_add_end_user', `&contactId=${contactId}&licenseid=${licenseId}`, 'POST');

  processResponse(event, data, callback, true, 'User added successfully');
}

export async function removeUserFromLicense(event, callback) {
  const newproductuserid = event.target.getAttribute('data-new-productuserid');
  const data = await execute('dynamics_remove_enduser_from_license', `&new_productuserid=${newproductuserid}`, 'DELETE');

  processResponse(event, data, callback, true, 'User was removed from license');
}

export async function assignLicenseToUser(event, callback) {
  const contactId = event.target.getAttribute('data-contact-id');
  const licenseId = event.target.getAttribute('data-license-id');
  const data = await execute('dynamics_add_end_user', `&contactId=${contactId}&licenseid=${licenseId}`, 'POST');

  // TODO handle response and add toast message
  processResponse(event, data, callback, true);
}

export async function updateColleagueInfo(event) {
  const colleagueDataDiv = document.querySelector('.colleague-details-data');
  const jobTitle = colleagueDataDiv.querySelector('.colleague-job-title').value;
  const telephone = colleagueDataDiv.querySelector('.colleague-bussiness-phone').value;
  const contactId = event.target.getAttribute('data-contact-id');
  const data = await execute('dynamics_edit_colleague', `&jobtitle=${jobTitle}&telephone1=${telephone}&contactid=${contactId}`, 'PATCH');

  processResponse(event, data, false, false, 'Information updated');
}
