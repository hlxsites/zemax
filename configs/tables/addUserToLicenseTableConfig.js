/**
 * @type {Array.<TableField>}
 */
export default function getAddUserToLicenseTable(checkboxClass) {
  const addUserToLicenseTable = [
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
        id: '{{contactid}}',
      },
    },
    {
      label: 'Full Name',
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
      value: ['{{firstname}}', ' ', '{{lastname}}'],
    },
    {
      label: 'Job Title',
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
      value: ['{{jobtitle}}'],
    },
    {
      label: 'Email',
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
      value: ['{{emailaddress1}}'],
    },
    {
      label: 'Business Phone',
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
      value: ['{{telephone1}}'],
    },
  ];

  return addUserToLicenseTable;
}
