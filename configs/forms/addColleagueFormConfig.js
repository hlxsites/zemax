const addColleagueFormConfiguration = {
  fields: [
    { id: 'firstname', name: 'firstname', label: 'First Name' },
    { id: 'lastname', name: 'lastname', label: 'Last Name' },
    { id: 'jobtitle', name: 'jobtitle', label: 'Job Title' },
    { id: 'emailaddress1', name: 'emailaddress1', label: 'Email' },
    { id: 'telephone1', name: 'telephone1', label: 'Business Phone' },
    { id: 'mobilephone', name: 'mobilephone', label: 'Mobile Phone' },
  ],
  submitText: 'Add Colleague',
  submitId: 'addColleagueSubmitButton',
  submitClass: 'add-colleague-action-button form-action-button',
  submitDataModalId: 'addColleagueModal',
  formId: 'addColleagueEditForm',
};

export default addColleagueFormConfiguration;
