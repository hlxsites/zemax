const manageColleaguesEndUserLicensesTable = [{
  label: 'License #',
  value: ['{{new_licenses1.new_licenseid}}'],
  html: 'td',
  htmlAttributes: {
    class: 'label-bold',
  },
},
{
  label: 'Status',
  value: ['{{new_licenses1.new_supportexpires@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'Support Expiry',
  value: ['{{new_licenses1.new_supportexpires@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'Product',
  value: ['{{new_licenses1.new_product@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'Registered User',
  value: ['{{new_licenses1.new_registereduser@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'Lincense Type',
  value: ['{{new_licenses1.zemax_seattype@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'Seat Count',
  value: ['{{new_licenses1.new_usercount@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'End User Count',
  value: ['{{new_licenses1.new_endusercount@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'Date added',
  value: ['{{createdon@OData.Community.Display.V1.FormattedValue}}'],
},

];

export default manageColleaguesEndUserLicensesTable;
