/**
 * @type {Array.<TableField>}
 */
export default function getLicenseDetailsUsersTable(licenseId) {
  const licenseDetailsUsersTable = [
    {
      label: 'Name',
      headingAttributes: {
        role: 'columnheader',
        tabindex: '0',
      },
      headingInnerTag: {
        tagName: 'span',
        htmlAttributes: {
          id: 'sortIndicator0',
          class: 'sort-indicator',
        },
      },
      value: ['{{contact1.fullname}}'],
      html: 'td',
      htmlAttributes: {
        class: 'label-bold',
      },
    },
    {
      label: 'Email',
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
      value: ['{{contact1.emailaddress1}}'],
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
      value: ['{{contact1.jobtitle}}'],
    },
    {
      label: 'Phone',
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
      value: ['{{contact1.telephone1}}'],
    },
    {
      label: '',
      headingAttributes: {
        'data-action-type': 'button-action',
      },
      value: ['Remove User'],
      html: 'button',
      htmlAttributes: {
        class: 'license-user-remove-user action important',
        type: 'button',
        'data-modal-id': 'deleteUserModal',
        'data-new-productuserid': '{{new_productuserid}}',
        'data-license-id': `${licenseId}`,
        'data-view-access': 'manage',
        'data-next-action-class': 'delete-user-action-button',
      },
    },
    {
      label: '',
      headingAttributes: {
        'data-action-type': 'button-action',
      },
      value: ['Change End User'],
      html: 'button',
      htmlAttributes: {
        class: 'license-user-change-user action',
        type: 'button',
        'data-modal-id': 'changeUserModal',
        'data-new-productuserid': '{{new_productuserid}}',
        'data-license-id': `${licenseId}`,
        'data-view-access': 'manage',
        'data-next-action-class': 'change-user-action-button',
      },
    },
  ];

  return licenseDetailsUsersTable;
}
