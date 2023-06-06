import { formatDateProfilePage } from '../../scripts/scripts.js';

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
