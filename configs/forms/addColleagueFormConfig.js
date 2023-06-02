const addColleagueFormConfiguration = {
  fields: [
    { id: 'first-name', label: 'First Name' },
    { id: 'last-name', label: 'Last Name' },
    { id: 'job-title', label: 'Job Title' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Business Phone' },
    { id: 'personal-phone', label: 'Mobile Phone' },
  ],
  submitText: 'Add Colleague',
  submitId: 'addColleagueSubmitButton',
  submitClass: 'add-colleague-action-button form-action-button',
  submitDataModalId: 'addColleagueModal',
  formId: 'addColleagueEditForm',
};

export default addColleagueFormConfiguration;
