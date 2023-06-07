import { domEl } from '../../scripts/dom-helpers.js';

export default function getAssignLicenseDialog() {
  const assignLicenseDialog = domEl('dialog', { class: 'assign-user-license-modal-container', 'aria-expanded': false, id: 'assignUserLicense' });
  assignLicenseDialog.innerHTML = `
  <div class="modal-container assign-user-license-modal">
   <div class="modal-content assign-user-license-modal-content">
      <div class="modal-header">
         <h3>Assign License</h3>
         <button class="modal-close" data-modal-id="assignUserLicense"></button>
      </div>
      <div class="modal-body">
         <div class="assign-user-license-container table-container">

         </div>
      </div>
      <div class="modal-footer">
         <button class="action assign-user-license-action-button" data-modal-id="assignUserLicense">Assign License</button>
         <button class="action assign-user-license-close-button" data-modal-id="assignUserLicense">Close</button>
      </div>
   </div>
</div>
`;
  return assignLicenseDialog;
}
