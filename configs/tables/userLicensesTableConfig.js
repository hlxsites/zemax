const userLicensesTable = [
  {
    label: '',
    value: ['Manage'],
    html: 'button',
    htmlAttributes: {
      class: 'manage-view-license action',
      type: 'button',
      'data-license-id': '{{new_licensesid}}',
      'data-view-access': 'manage',
    },
  },
  {
    label: 'Status',
    value: ['{{new_supportexpires}}'],
    html: 'span',
    htmlAttributes: {
      class: '',
    },
    processValueMethod: calculateStatus,
  },
  {
    label: 'Support Expiry',
    value: ['{{new_supportexpires}}'],
    processValueMethod: calculateSupportExpiry,
  },
  {
    label: 'License #',
    value: ['{{new_licenseid}}'],
    html: 'a',
    htmlAttributes: {
      href: '#',
    },
  },
  {
    label: 'Nickname',
    value: ['{{zemax_nickname}}'],
  },
  {
    label: 'Product',
    value: ['{{_new_product_value@OData.Community.Display.V1.FormattedValue}}'],
  },
  {
    label: 'License Type',
    value: ['{{zemax_seattype@OData.Community.Display.V1.FormattedValue}}'],
  },
  {
    label: 'Seat Count',
    value: ['{{new_usercount}}'],
  },
  {
    label: 'End User Count',
    value: ['{{new_endusercount}}'],
  },
  {
    label: 'Administrator',
    value: ['{{_new_registereduser_value@OData.Community.Display.V1.FormattedValue}}'],
  },
];

function calculateStatus(clonedHeading) {
  const date = new Date(clonedHeading.value);
  date.setDate(date.getDate() - 1);
  clonedHeading.value.length = 0;
  if (date.getTime() > Date.now()) {
    clonedHeading.value.push('Active');
    clonedHeading.htmlAttributes.class = 'active-license';
  } else {
    clonedHeading.value.push('Expired');
    clonedHeading.htmlAttributes.class = 'expired-license';
  }

  return clonedHeading;
}

function calculateSupportExpiry(clonedHeading) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const expiryDate = new Date(clonedHeading.value);
  expiryDate.setDate(expiryDate.getDate() - 1);
  clonedHeading.value.length = 0;
  clonedHeading.value.push(expiryDate.toLocaleDateString('en-US', options));

  return clonedHeading;
}

export default userLicensesTable;
