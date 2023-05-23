import { getEnvironmentConfig, getLocaleConfig } from '../../scripts/zemax-config.js';
import { p, a } from '../../scripts/dom-helpers.js';
import { createTag } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const contactid = localStorage.getItem('contactid');
  const userEmail = localStorage.getItem('email');
  const webroles = JSON.parse(localStorage.getItem('webroles'));
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  if (userId == null || userId === undefined || accessToken == null || accessToken === undefined) {
    window.location.assign(`${window.location.origin}`);
  } else {
    await fetch(`${DYNAMIC_365_DOMAIN}zendesk_tickets_by_id?auth0_id=${userId}&user_email=${userEmail}&zemax_zendeskid=${contactid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

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

        if (data.length > 0) {
          const tableElement = document.createElement('table');
          const thead = document.createElement('thead');
          const tr = document.createElement('tr');

          const { tableHeadings } = getLocaleConfig('en_us', 'userTickets');
          tableHeadings.forEach((heading) => {
            const tableHeadingElement = document.createElement('th');
            const button = document.createElement('button');
            button.innerHTML = heading;
            tableHeadingElement.appendChild(button);
            tr.appendChild(tableHeadingElement);
          });

          thead.appendChild(tr);
          tableElement.appendChild(thead);

          const tbody = document.createElement('tbody');

          data.forEach((ticket) => {
            const trBody = document.createElement('tr');
            const tdCaseNumber = document.createElement('td');
            const caseLink = document.createElement('a');
            caseLink.setAttribute('href', ticket.url);
            const caseIdText = document.createTextNode(ticket.id);
            caseLink.appendChild(caseIdText);
            tdCaseNumber.appendChild(caseLink);
            trBody.appendChild(tdCaseNumber);

            const tdCaseTitle = document.createElement('td');
            tdCaseTitle.innerText = ticket.raw_subject;
            trBody.appendChild(tdCaseTitle);

            const tdCaseStatus = document.createElement('td');
            tdCaseStatus.innerText = ticket.status;
            trBody.appendChild(tdCaseStatus);

            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const dateCreatedString = ticket.created_at;
            const dateCreated = new Date(dateCreatedString);

            const formattedDateCreated = dateCreated.toLocaleDateString('en-US', options);
            const tdCaseCreated = document.createElement('td');
            tdCaseCreated.innerText = formattedDateCreated;
            trBody.appendChild(tdCaseCreated);

            const dateUpdatedString = ticket.updated_at;
            const dateUpdated = new Date(dateUpdatedString);
            const formattedDateUpdated = dateUpdated.toLocaleDateString('en-US', options);
            const tdCaseLastUpdated = document.createElement('td');
            tdCaseLastUpdated.innerText = formattedDateUpdated;
            trBody.appendChild(tdCaseLastUpdated);
            tbody.appendChild(trBody);
          });

          tableElement.appendChild(tbody);

          block.append(tableElement);
        } else {
          // TODO placeholder
          block.append(p({ class: 'no-tickets' }, getLocaleConfig('en_us', 'userTickets').noTicketDescription));
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('Something went wrong.', err);
      });
  }
}
