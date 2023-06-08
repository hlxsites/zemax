import { domEl } from '../../scripts/dom-helpers.js';

export function getEditUserDialog() {
  const editUserDialog = domEl('dialog', { class: 'edit-user-modal-container', 'aria-expanded': false, id: 'editUserModal' });
  editUserDialog.innerHTML = `
  <div class="modal-container edit-user-modal">
    <div class="modal-content edit-user-modal-content">
      <div class="modal-header">
          <h3>Edit Colleague</h3>
          <button class="modal-close">
            <svg data-modal-id="editUserModal" viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M11.414 10l6.293-6.293a1 1 0 1 0-1.414-1.414L10 8.586 3.707 2.293a1 1 0 0 0-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 1 0 1.414 1.414L10 11.414l6.293 6.293A.998.998 0 0 0 18 17a.999.999 0 0 0-.293-.707L11.414 10z"></path></svg>
          </button>
      </div>
      <div class="modal-body">
        <div class="edit-user-container">
          <form id="editUserEditForm">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" readonly="" disabled="" value="">
            <label for="last-name">Last Name</label><input type="text" id="last-name" readonly="" disabled="" value="">
            <label for="job-title">Job Title</label><input type="text" id="job-title" value="">
            <label for="email">Email</label><input type="text" id="email" readonly="" disabled="" value="">
            <label for="phone">Business Phone</label><input type="text" id="phone" value="">
            <input type="submit" id="userEditSubmitButton" class="edit-user-action-button" value="Submit" data-modal-id="editUserModal">
          </form>
        </div>
      </div>
      <div class="modal-footer"></div>
    </div>
  </div>
`;
  return editUserDialog;
}

export function getResetUserPasswordDialog() {
  const resetUserPasswordDialog = domEl('dialog', { class: 'reset-user-password-modal-container', 'aria-expanded': false, id: 'resetUserPasswordModal' });
  resetUserPasswordDialog.innerHTML = `
  <div class="modal-container reset-user-password-modal">
   <div class="modal-content reset-user-password-modal-content">
      <div class="modal-header">
         <h3>Confirmation Required</h3>
         <button class="modal-close">
          <svg data-modal-id="resetUserPasswordModal" viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M11.414 10l6.293-6.293a1 1 0 1 0-1.414-1.414L10 8.586 3.707 2.293a1 1 0 0 0-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 1 0 1.414 1.414L10 11.414l6.293 6.293A.998.998 0 0 0 18 17a.999.999 0 0 0-.293-.707L11.414 10z"></path></svg>
         </button>
      </div>
      <div class="modal-body">
         <div class="reset-user-password-container">
            <p>Please confirm this action to generate the password reset email</p>
         </div>
      </div>
      <div class="modal-footer">
        <button class="action secondary reset-user-password-close-button" data-modal-id="resetUserPasswordModal">Cancel</button>
        <button class="action important reset-user-password-action-button" data-modal-id="resetUserPasswordModal" data-view-access="manage">Send Password Reset Email</button>
      </div>
   </div>
 </div>
`;
  return resetUserPasswordDialog;
}

export function getAddColleagueDialog() {
  const addColleagueDialog = domEl('dialog', { class: 'add-colleague-modal-container', 'aria-expanded': false, id: 'addColleagueModal' });
  addColleagueDialog.innerHTML = `
  <div class="modal-container add-colleague-modal">
   <div class="modal-content add-colleague-modal-content">
      <div class="modal-header">
         <h3>Add Colleague</h3>
         <button class="modal-close">
           <svg data-modal-id="addColleagueModal" viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M11.414 10l6.293-6.293a1 1 0 1 0-1.414-1.414L10 8.586 3.707 2.293a1 1 0 0 0-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 1 0 1.414 1.414L10 11.414l6.293 6.293A.998.998 0 0 0 18 17a.999.999 0 0 0-.293-.707L11.414 10z"></path></svg>
         </button>
      </div>
      <div class="modal-body">
        <div class="add-colleague-container">
          <form id="addColleagueEditForm">
            <label for="firstname">First Name</label>
            <input type="text" id="firstname" name="firstname">
            <label for="lastname">Last Name</label>
            <input type="text" id="lastname" name="lastname">
            <label for="jobtitle">Job Title</label>
            <input type="text" id="jobtitle" name="jobtitle">
            <label for="emailaddress1">Email</label><input type="text" id="emailaddress1" name="emailaddress1">
            <label for="telephone1">Business Phone</label><input type="text" id="telephone1" name="telephone1">
            <label for="mobilephone">Mobile Phone</label><input type="text" id="mobilephone" name="mobilephone">
            <input type="submit" id="addColleagueSubmitButton" class="add-colleague-action-button form-action-button" value="Add Colleague" data-modal-id="addColleagueModal">
          </form>
        </div>
      </div>
      <div class="modal-footer"></div>
   </div>
  </div>
`;
  return addColleagueDialog;
}
