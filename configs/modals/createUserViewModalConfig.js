import { domEl } from '../../scripts/dom-helpers.js';

export function getEditUserDialog() {
  const editUserDialog = domEl('dialog', { class: 'edit-user-modal-container', 'aria-expanded': false, id: 'editUserModal' });
  editUserDialog.innerHTML = `
  <div class="modal-container edit-user-modal">
    <div class="modal-content edit-user-modal-content">
      <div class="modal-header">
          <h3>Edit Colleague</h3>
          <button class="modal-close"></button>
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
         <button class="modal-close"></button>
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
