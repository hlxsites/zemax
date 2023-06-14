export default function getAssignUserToLicenseTable(checkboxClass) {
  const assignUserToLicenseTable = [
    {
      label: '',
      headingAttributes: {
        'data-action-type': 'button-action',
      },
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
      value: ['{{new_licenseid}}'],
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
        },
      },
      value: ['{{new_supportexpires}}'],
    },
    {
      label: 'Product',
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
      value: ['{{_new_product_value@OData.Community.Display.V1.FormattedValue}}'],
    },
    {
      label: 'License Administrator',
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
      value: ['{{_new_registereduser_value@OData.Community.Display.V1.FormattedValue}}'],
    },
    {
      label: 'Duration Type',
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
      value: ['{{new_durationtype@OData.Community.Display.V1.FormattedValue}}'],
    },
    {
      label: 'User Count',
      headingAttributes: {
        role: 'columnheader',
        tabindex: '6',
      },
      headingInnerTag: {
        tagName: 'span',
        htmlAttributes: {
          id: 'sortIndicator6',
          class: 'sort-indicator',
          'data-value-type': 'integer',
        },
      },
      value: ['{{new_usercount@OData.Community.Display.V1.FormattedValue}}'],
    },
    {
      label: 'End User Count',
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
      value: ['{{new_endusercount@OData.Community.Display.V1.FormattedValue}}'],
    },
  ];

  return assignUserToLicenseTable;
}
