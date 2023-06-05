const manageColleaguesEndUserLicensesTable = [{
  label: 'License #',
  value: ['{{new_licenseid}}'],
  html: 'td',
  htmlAttributes: {
    class: 'label-bold',
  },
},
{
  label: 'Status',
  value: ['{{new_supportexpires}}'],
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
  label: 'Nickname',
  value: ['{{new_supportexpires}}'],
},
{
  label: 'Lincense Type',
  value: ['{{zemax_seattype@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'New User Count',
  value: ['{{new_usercount}}'],
},
{
  label: 'End User Count',
  value: ['{{new_endusercount}}'],
},

];

export default manageColleaguesEndUserLicensesTable;
