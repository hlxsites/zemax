/* On the active user tab "deactivate user" button is shown
 * while on inactive user tab "activate user" button is shown
 * To handle this those button config is removed dynamically while consuming this configuration
 */

/**
 * @typedef {Object} TableField
 *
 * @property {string} label - The label of the table heading field.
 * @property {Object} [headingAttributes] - The attributes for the tables heading of the field,
 *  if any.
 * @property {Object} [headingInnerTag] - The inner HTML tag of the heading tag th, if any.
 * @property {string} [headingInnerTag.tagName] - The tag name of inner HTML tag of the heading.
 * @property {Object} [headingInnerTag.htmlAttributes] -
 * The attributes for the inner HTML tag of the heading.
 * @property {Array.<string>} value - The table division value.
 * @property {string} [html] - The HTML tag for the table division value, default is td.
 * @property {Object} [htmlAttributes] - The HTML attributes for table division value tag.
 * @property {Function} processValueMethod - The method used to process the field's value, if any.
 */

/**
 * @type {Array.<TableField>}
 */
const activatedDeactivatedColleaguesTable = [{
  label: 'Firstname',
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
  value: ['{{firstname}}'],
  html: 'td',
  htmlAttributes: {
    class: 'label-bold',
  },
},
{
  label: 'lastname',
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
  value: ['{{lastname}}'],
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
  label: 'Phone',
  value: ['{{telephone1}}'],
},
{
  label: '',
  value: ['Edit User'],
  html: 'button',
  htmlAttributes: {
    class: 'license-user-edit-user action secondary',
    type: 'button',
    'data-modal-id': 'editUserModal',
    'data-contactid': '{{contactid}}',
    'data-next-action-class': 'edit-user-action-button',
    'data-user-firstname': ['{{firstname}}'],
    'data-user-lastname': ['{{lastname}}'],
    'data-user-jobtitle': ['{{jobtitle}}'],
    'data-user-email': ['{{emailaddress1}}'],
    'data-user-phone': ['{{telephone1}}'],
  },
},
{
  label: '',
  value: ['Reset Password'],
  html: 'button',
  htmlAttributes: {
    class: 'license-user-reset-password action secondary',
    type: 'button',
    'data-modal-id': 'resetUserPasswordModal',
    'data-contactid': '{{contactid}}',
    'data-next-action-class': 'reset-user-password-action-button',
  },
},
{
  label: 'User Status',
  value: ['Deactivate User'],
  html: 'button',
  htmlAttributes: {
    class: 'license-user-deactivate-user action important',
    type: 'button',
    'data-contactid': '{{contactid}}',
  },
},
{
  label: 'User Status',
  value: ['Activate User'],
  html: 'button',
  htmlAttributes: {
    class: 'license-user-activate-user action activate',
    type: 'button',
    'data-contactid': '{{contactid}}',
  },
},
{
  label: '',
  value: ['Manage'],
  html: 'button',
  htmlAttributes: {
    class: 'license-user-manage-user action secondary',
    type: 'button',
    'data-new-productuserid': 'test',
    'data-contactid': '{{contactid}}',
    'data-next-action-class': 'manage-user-action-button',
  },
},
];

export default activatedDeactivatedColleaguesTable;
