/* On the active user tab "deactivate user" button is shown
 * while on inactive user tab "activate user" button is shown
 * To handle this those button config is removed dynamically while consuming this configuration
 */
const activatedDeactivatedColleaguesTable = [{
  label: 'Firstname',
  value: ['{{firstname}}'],
  html: 'td',
  htmlAttributes: {
    class: 'label-bold',
  },
},
{
  label: 'lastname',
  value: ['{{lastname}}'],
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
  label: 'Phone',
  value: ['{{telephone1}}'],
},
{
  label: '',
  value: [''],
  html: 'button',
  htmlTagLabel: 'Edit User',
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
  value: [''],
  html: 'button',
  htmlTagLabel: 'Reset Password',
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
  value: [''],
  html: 'button',
  htmlTagLabel: 'Deactivate User',
  htmlAttributes: {
    class: 'license-user-deactivate-user action important',
    type: 'button',
    'data-contactid': '{{contactid}}',
  },
},
{
  label: 'User Status',
  value: [''],
  html: 'button',
  htmlTagLabel: 'Activate User',
  htmlAttributes: {
    class: 'license-user-activate-user action activate',
    type: 'button',
    'data-contactid': '{{contactid}}',
  },
},
{
  label: '',
  value: [''],
  html: 'button',
  htmlTagLabel: 'Manage',
  htmlAttributes: {
    class: 'license-user-manage-user action secondary',
    type: 'button',
    'data-new-productuserid': 'test',
    'data-license-id': 'test2',
    'data-next-action-class': 'manage-user-action-button',
  },
},
];

export default activatedDeactivatedColleaguesTable;
