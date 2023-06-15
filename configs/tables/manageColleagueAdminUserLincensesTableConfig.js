/**
 * @type {Array.<TableField>}
 */
const manageColleaguesEndUserLicensesTable = [{
  label: 'License #',
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
  value: ['{{new_licenseid}}'],
  html: 'td',
  htmlAttributes: {
    class: 'label-bold',
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
  value: ['{{new_supportexpires}}'],
},
{
  label: 'Lincense Type',
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
  value: ['{{zemax_seattype@OData.Community.Display.V1.FormattedValue}}'],
},
{
  label: 'New User Count',
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
  value: ['{{new_usercount}}'],
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
  value: ['{{new_endusercount}}'],
},

];

export default manageColleaguesEndUserLicensesTable;
