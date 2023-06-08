export default function getAssignUserToLicenseTable(checkboxClass) {
  const assignUserToLicenseTable = [
    {
      label: '',
      value: [],
      html: 'input',
      htmlAttributes: {
        class: `${checkboxClass}`,
        type: 'checkbox',
        'data-license-id': '{{new_licensesid}}',
      },
    },
    {
      label: 'License #',
      value: ['{{new_licenseid}}'],
    },
    {
      label: 'Support Expiry',
      value: ['{{new_supportexpires}}'],
    },
    {
      label: 'Product',
      value: ['{{_new_product_value@OData.Community.Display.V1.FormattedValue}}'],
    },
    {
      label: 'License Administrator',
      value: ['{{_new_registereduser_value@OData.Community.Display.V1.FormattedValue}}'],
    },
    {
      label: 'Duration Type',
      value: ['{{new_durationtype@OData.Community.Display.V1.FormattedValue}}'],
    },
    {
      label: 'User Count',
      value: ['{{new_usercount@OData.Community.Display.V1.FormattedValue}}'],
    },
    {
      label: 'End User Count',
      value: ['{{new_endusercount@OData.Community.Display.V1.FormattedValue}}'],
    },
  ];

  return assignUserToLicenseTable;
}
