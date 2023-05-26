export default function getAddUserToLicenseTable(checkboxClass) {
  const addUserToLicenseTable = [
    {
      label: '',
      value: [],
      html: 'input',
      htmlAttributes: {
        class: `${checkboxClass}`,
        type: 'checkbox',
        id: '{{contactid}}',
      },
    },
    {
      label: 'Full Name',
      value: ['{{firstname}}', ' ', '{{lastname}}'],
    },
    {
      label: 'Job Title',
      value: ['{{jobtitle}}'],
    },
    {
      label: 'Email',
      value: ['{{emailaddress1}}'],
    },
    {
      label: 'Business Phone',
      value: ['{{telephone1}}'],
    },
  ];

  return addUserToLicenseTable;
}
