import execute from '../../scripts/zemax-api.js';
import { hideModal } from '../../scripts/scripts.js';

function processResponse(event, data, renderViewMethod, hideActionModal) {
  if (data?.status === 204) {
    // TODO show success toast message
    if (hideActionModal) {
      hideModal(event);
    }
    // Re render view after the data is updated
    if (renderViewMethod) {
      renderViewMethod(event);
    }
  } else {
    console.log('error ', data);
  }
}

export async function addColleague(event, callback) {
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

  processResponse(event, data, callback, true);
}

export async function updateUserInfo(event, callback) {
  event.preventDefault();
  const jobtitle = event.target.parentNode.querySelector('#job-title').value;
  const telephone = event.target.parentNode.querySelector('#phone').value;
  const contactid = event.target.getAttribute('data-contactid');
  const data = await execute('dynamics_edit_colleague', `&jobtitle=${jobtitle}&telephone1=${telephone}&contactid=${contactid}`, 'PATCH');

  processResponse(event, data, callback, true);
}

export async function resetUserPassword(event) {
  const contactid = event.target.getAttribute('data-contactid');
  // TODO check method type
  const data = await execute('dynamics_resetpassword_contactid', `&contactid=${contactid}`, 'POST');

  processResponse(event, data, false, false);
}

export async function activateUser(event, callback) {
  const contactid = event.target.getAttribute('data-contactid');
  const data = await execute('dynamics_activate_userid', `&contact_id=${contactid}`, 'PATCH');

  processResponse(event, data, callback, false);
}

export async function deactivateUser(event, callback) {
  const contactid = event.target.getAttribute('data-contactid');
  const data = await execute('dynamics_deactivate_userid', `&contact_id=${contactid}`, 'PATCH');

  processResponse(event, data, callback, false);
}

export async function updateLicenseNickname() {
  const { value } = document.querySelector('.nickname');
  if (value) {
    const data = await execute('dynamics_set_license_nickname', `&id=97d53652-122f-e611-80ea-005056831cd4&nickname=${value}`, 'PATCH');
    console.log('Updated license nickname ', data);
  } else {
    // TODO handle response and add toast message
    alert('Provide nickname value before saving');
  }
}

export async function changeUserForALicense(event, callback) {
  const contactId = event.target.getAttribute('contactid');
  const newProductUserId = event.target.getAttribute('data-new-productuserid');
  const data = await execute('dynamics_change_enduser_license', `&contact_id=${contactId}&new_productuserid=${newProductUserId}`, 'PATCH');

  processResponse(event, data, callback, true);
}

export async function addUserToALicense(event, callback) {
  const contactId = event.target.getAttribute('contactid');
  const licenseId = event.target.getAttribute('data-license-id');
  const data = await execute('dynamics_add_end_user', `&contactId=${contactId}&licenseid=${licenseId}`, 'POST');

  processResponse(event, data, callback, true);
}

export async function removeUserFromLicense(event, callback) {
  const newproductuserid = event.target.getAttribute('data-new-productuserid');
  const data = await execute('dynamics_remove_enduser_from_license', `&new_productuserid=${newproductuserid}`, 'DELETE');

  // TODO handle response and add toast message
  processResponse(event, data, callback, true);
}
