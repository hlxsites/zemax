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
