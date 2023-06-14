const userTicketsTable = [
  {
    label: 'Case Number',
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
    value: ['{{id}}'],
    html: 'a',
    htmlAttributes: {
      href: 'https://zemax.zendesk.com/agent/tickets/',
    },
    processValueMethod: updateTicketUrl,
  },
  {
    label: 'Case Title',
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
    value: ['{{raw_subject}}'],
  },
  {
    label: 'Status',
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
    value: ['{{status}}'],
    processValueMethod: changeToUpper,
    htmlAttributes: {
      class: 'label-bold',
    },
  },
  {
    label: 'Created',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '3',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator3',
        class: 'sort-indicator',
        'data-value-type': 'date',
      },
    },
    value: ['{{created_at}}'],
    processValueMethod: formatDateProfilePage,
  },
  {
    label: 'Last Updated',
    headingAttributes: {
      role: 'columnheader',
      tabindex: '4',
    },
    headingInnerTag: {
      tagName: 'span',
      htmlAttributes: {
        id: 'sortIndicator4',
        class: 'sort-indicator',
        'data-value-type': 'date',
      },
    },
    value: ['{{updated_at}}'],
    processValueMethod: formatDateProfilePage,
  },
];

export default userTicketsTable;

function formatDateProfilePage(clonedHeading) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateCreated = new Date(clonedHeading.value);
  clonedHeading.value.length = 0;
  clonedHeading.value.push(dateCreated.toLocaleDateString('en-US', options));

  return clonedHeading;
}

function changeToUpper(clonedHeading) {
  const { value } = clonedHeading;
  const ticketStatus = value[0];
  clonedHeading.value.length = 0;
  clonedHeading.value.push(ticketStatus.charAt(0).toUpperCase() + ticketStatus.slice(1));
  return clonedHeading;
}

function updateTicketUrl(clonedHeading) {
  const { value } = clonedHeading;
  clonedHeading.htmlAttributes.href = `${clonedHeading.htmlAttributes.href}${value}`;
  return clonedHeading;
}
