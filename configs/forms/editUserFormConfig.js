const editUserFormConfiguration = {
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
  submitClass: 'edit-user-action-button form-action-button',
  submitDataModalId: 'editUserModal',
  formId: 'editUserEditForm',
};

export default editUserFormConfiguration;
