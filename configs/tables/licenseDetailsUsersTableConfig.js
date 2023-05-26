export default function getLicenseDetailsUsersTable(licenseId) {
  const licenseDetailsUsersTable = [
    {
      label: 'Name',
      value: ['{{contact1.fullname}}'],
      html: 'td',
      htmlAttributes: {
        class: 'label-bold',
      },
    },
    {
      label: 'Email',
      value: ['{{contact1.emailaddress1}}'],
    },
    {
      label: 'Job Title',
      value: ['{{contact1.jobtitle}}'],
    },
    {
      label: 'Phone',
      value: ['{{contact1.telephone1}}'],
    },
    {
      label: '',
      value: ['{{contact1.fullname}}'],
      html: 'button',
      htmlTagLabel: 'Remove User',
      htmlAttributes: {
        class: 'license-user-remove-user action important',
        type: 'button',
        'data-modal-id': 'deleteUserModal',
        'data-new-productuserid': '{{new_productuserid}}',
        'data-license-id': `${licenseId}`,
        'data-next-action-class': 'delete-user-action-button',
      },
    },
    {
      label: '',
      value: ['{{contact1.fullname}}'],
      html: 'button',
      htmlTagLabel: 'Change End User',
      htmlAttributes: {
        class: 'license-user-change-user action',
        type: 'button',
        'data-modal-id': 'changeUserModal',
        'data-new-productuserid': '{{new_productuserid}}',
        'data-license-id': `${licenseId}`,
        'data-next-action-class': 'change-user-action-button',
      },
    },
  ];

  return licenseDetailsUsersTable;
}
