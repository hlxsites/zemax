const userTicketsTable = [
  {
    label: 'Case Number',
    value: ['{{id}}'],
    html: 'a',
    htmlAttributes: {
      href: '{{url}}',
    },
  },
  {
    label: 'Case Title',
    value: ['{{raw_subject}}'],
  },
  {
    label: 'Status',
    value: ['{{status}}'],
    processValueMethod: changeToUpper,
    htmlAttributes: {
      class: 'label-bold',
    },
  },
  {
    label: 'Created',
    value: ['{{created_at}}'],
    processValueMethod: formatDateProfilePage,
  },
  {
    label: 'Last Updated',
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
