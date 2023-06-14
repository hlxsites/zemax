const userLicensesTable = [
  {
    label: '',
    headingAttributes: {
      'data-action-type': 'button-action',
    },
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
    headingAttributes: {
      role: 'columnheader',
      tabindex: '1',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator1',
        class: 'sort-indicator',
      },
    },
    value: ['{{new_supportexpires}}'],
    html: 'span',
    htmlAttributes: {
      class: '',
    },
    processValueMethod: calculateStatus,
  },
  {
    label: 'Support Expiry',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '2',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator2',
        class: 'sort-indicator',
        'data-value-type': 'date',
      },
    },
    value: ['{{new_supportexpires}}'],
    processValueMethod: calculateSupportExpiry,
  },
  {
    label: 'License #',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '3',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator3',
        class: 'sort-indicator',
      },
    },
    value: ['{{new_licenseid}}'],
    html: 'a',
    htmlAttributes: {
      href: '#',
    },
  },
  {
    label: 'Nickname',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '4',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator4',
        class: 'sort-indicator',
      },
    },
    value: ['{{zemax_nickname}}'],
  },
  {
    label: 'Product',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '5',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator5',
        class: 'sort-indicator',
      },
    },
    value: ['{{_new_product_value@OData.Community.Display.V1.FormattedValue}}'],
  },
  {
    label: 'License Type',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '6',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator6',
        class: 'sort-indicator',
      },
    },
    value: ['{{zemax_seattype@OData.Community.Display.V1.FormattedValue}}'],
  },
  {
    label: 'Seat Count',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '7',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator7',
        class: 'sort-indicator',
        'data-value-type': 'integer',
      },
    },
    value: ['{{new_usercount}}'],
  },
  {
    label: 'End User Count',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '8',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator8',
        class: 'sort-indicator',
        'data-value-type': 'integer',
      },
    },
    value: ['{{new_endusercount}}'],
  },
  {
    label: 'Administrator',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '9',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator9',
        class: 'sort-indicator',
      },
    },
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
  expiryDate.setDate(expiryDate.getDate());
  clonedHeading.value.length = 0;
  clonedHeading.value.push(expiryDate.toLocaleDateString('en-US', options));

  return clonedHeading;
}

export default userLicensesTable;
