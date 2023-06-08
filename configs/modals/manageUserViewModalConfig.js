import { domEl } from '../../scripts/dom-helpers.js';

export default function getAssignLicenseDialog() {
  const assignLicenseDialog = domEl('dialog', { class: 'assign-user-license-modal-container', 'aria-expanded': false, id: 'assignUserLicense' });
  assignLicenseDialog.innerHTML = `
  <div class="modal-container assign-user-license-modal">
   <div class="modal-content assign-user-license-modal-content">
      <div class="modal-header">
         <h3>Assign License</h3>
         <button class="modal-close">
           <svg data-modal-id="assignUserLicense" viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M11.414 10l6.293-6.293a1 1 0 1 0-1.414-1.414L10 8.586 3.707 2.293a1 1 0 0 0-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 1 0 1.414 1.414L10 11.414l6.293 6.293A.998.998 0 0 0 18 17a.999.999 0 0 0-.293-.707L11.414 10z"></path></svg>
         </button>
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
