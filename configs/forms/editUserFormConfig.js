const editUserFormConfiguration = {
  fields: [
    {
      id: 'first-name', name: 'first-name', label: 'First Name', value: '', readOnly: true, disabled: true,
    },
    {
      id: 'last-name', name: 'last-name', label: 'Last Name', value: '', readOnly: true, disabled: true,
    },
    { id: 'job-title', name: 'job-title', label: 'Job Title' },
    {
      id: 'email', name: 'email', label: 'Email', value: '', readOnly: true, disabled: true,
    },
    { id: 'phone', name: 'phone', label: 'Business Phone' },
  ],
  submitText: 'Submit',
  submitId: 'userEditSubmitButton',
  submitClass: 'edit-user-action-button form-action-button',
  submitDataModalId: 'editUserModal',
  formId: 'editUserEditForm',
};

export default editUserFormConfiguration;
