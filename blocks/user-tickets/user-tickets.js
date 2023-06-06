import { getLocaleConfig } from '../../scripts/zemax-config.js';
import { p, a } from '../../scripts/dom-helpers.js';
import { createTag, createGenericDataTable} from '../../scripts/scripts.js';
import execute from '../../scripts/zemax-api.js';
import userTicketsTable from '../../configs/tables/userTicketsTableConfig.js';

export default async function decorate(block) {
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');

  const webRolesData = await execute('dynamics_get_webrole', '', 'GET');
  const userEmail = localStorage.getItem('email');
  const contactid = localStorage.getItem('contactid');
  createButtonAsPerWebroles(webRolesData.webroles, block);

  if (userId && accessToken) {
    renderUserTickets(userEmail, contactid, block);
  }
}

function createButtonAsPerWebroles(webroles, block) {
  let allButtonAccess = false;
  const allButtonWebroles = [
    'Supported Users ZOS',
    'Supported Users ZOV',
    'Customer Self Service Admin',
    'Content Author',
    'Administrators',
    'Super Admin',
    'Educator',
  ];
  webroles.forEach((webrole) => {
    if (allButtonWebroles.includes(webrole.adx_name)) {
      allButtonAccess = true;
    }
  });

  const supportLinkDiv = createTag('div', { class: 'support-links' }, '');
  const { askCommunityButtonText } = getLocaleConfig('en_us', 'userTickets');
  if (allButtonAccess) {
    const { openANewTicketButtonText } = getLocaleConfig('en_us', 'userTickets');
    const { scheduleACallButtonText } = getLocaleConfig('en_us', 'userTickets');
    supportLinkDiv.appendChild(
      a(
        {
          href: 'https://support.zemax.com/hc/requests/new',
          'aria-label': openANewTicketButtonText,
          class: 'open-ticket button primary',
          target: '_blank',
        },
        openANewTicketButtonText,
      ),
    );

    supportLinkDiv.appendChild(
      a(
        {
          href: 'https://support.zemax.com/hc/requests/new?scheduled-calls=true',
          'aria-label': scheduleACallButtonText,
          class: 'schedule-call button primary',
          target: '_blank',
        },
        scheduleACallButtonText,
      ),
    );
  }

  supportLinkDiv.appendChild(
    a(
      {
        href: 'https://community.zemax.com/ssoproxy/login?ssoType=openidconnect',
        'aria-label': askCommunityButtonText,
        class: 'more-info-access button secondary',
        target: '_blank',
      },
      askCommunityButtonText,
    ),
  );

  block.appendChild(supportLinkDiv);
}

async function renderUserTickets(userEmail, contactid, block) {
  const data = await execute('zendesk_tickets_by_id', `&user_email=${userEmail}&zemax_zendeskid=${contactid}`, 'GET');

  if (data.length > 0) {
    const tableContainer = createTag('div', { class: 'table-container' }, '');
    const tableElement = createGenericDataTable(userTicketsTable, data);
    tableContainer.appendChild(tableElement);

    block.append(tableContainer);
  } else {
    block.append(p({ class: 'no-tickets' }, getLocaleConfig('en_us', 'userTickets').noTicketDescription));
  }
}

// Function to listen for the storage event
function storageEventHandler(event) {
  if (event.storageArea === localStorage && (event.key === 'contactid' || event.key === 'email')) {
    renderUserTickets(localStorage.getItem('email'), localStorage.getItem('contactid'), document.querySelector('.user-tickets.block'));
  }
}

window.addEventListener('storage', storageEventHandler);
