import { domEl } from '../../scripts/dom-helpers.js';

export function getAddUserDialog() {
  const addUserDialog = domEl('dialog', { class: 'add-user-modal-container', 'aria-expanded': false, id: 'addUserModal' });
  addUserDialog.innerHTML = `
   <div class="modal-container add-user-modal" id="addUserModal">
      <div class="modal-content add-user-modal-content">
         <div class="modal-header">
            <h3>Add End User to License</h3>
            <button class="modal-close"></button>
         </div>
         <div class="modal-body">
            <div class="add-user-container table-container">
               
            </div>
         </div>
         <div class="modal-footer">
            <button class="action secondary create-user-action-button" data-modal-id="addUserModal" data-view-access="manage">Create User</button>
            <button class="action add-user-action-button" data-modal-id="addUserModal" data-view-access="manage">Add User</button>
            <button class="action add-user-cancel-button" data-modal-id="addUserModal">Close</button>
         </div>
      </div>
   </div>
      `;
  return addUserDialog;
}

export function getDeleteUserDialog() {
  const deleteUserDialog = domEl('dialog', { class: 'delete-user-modal-container', 'aria-expanded': false, id: 'deleteUserModal' });
  deleteUserDialog.innerHTML = `
  <div class="modal-container delete-user-modal">
    <div class="modal-content delete-user-modal-content">
      <div class="modal-header">
        <h3>Confirmation Required</h3>
      </div>
      <div class="modal-body">
        <div class="delete-user-container">
            <p>Please confirm this action to remove end user</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="action important delete-user-action-button" data-modal-id="deleteUserModal" data-view-access="manage">Yes, remove End User</button>
        <button class="action secondary delete-user-cancel-button" data-modal-id="deleteUserModal">Cancel</button>
      </div>
    </div>
  </div>
`;
  return deleteUserDialog;
}

export function getChangeUserDialog() {
  const changeUserDialog = domEl('dialog', { class: 'change-user-modal-container', 'aria-expanded': false, id: 'changeUserModal' });
  changeUserDialog.innerHTML = `
  <div class="modal-container change-user-modal">
   <div class="modal-content change-user-modal-content">
      <div class="modal-header">
         <h3>Choose a User</h3>
      </div>
      <div class="modal-body">
         <div class="change-user-container table-container">

         </div>
      </div>
      <div class="modal-footer">
        <button class="action secondary create-user-action-button" data-modal-id="changeUserModal" data-access-view="manage">Create User</button>
        <button class="action change-user-action-button" data-modal-id="changeUserModal" data-access-view="manage">Change User</button>
        <button class="action change-user-cancel-button" data-modal-id="changeUserModal">Close</button>
      </div>
   </div>
  </div>
`;
  return changeUserDialog;
}
