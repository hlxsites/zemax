import { getEnvironmentConfig, getLocaleConfig } from '../../scripts/zemax-config.js';
import {
  li, ul, h3, p, a,
} from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const { roleHeadingDescription, moreInformationAboutAccessButtonText } = getLocaleConfig('en_us', 'userWebroles');
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  // eslint-disable-next-line max-len
  if (userId && accessToken) {
    fetch(`${DYNAMIC_365_DOMAIN}dynamics_get_webrole?auth0_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        const { webroles } = data;

        // TODO handle cases where there is no response on webroles
        if (!localStorage.getItem('contactid')) {
          localStorage.setItem('contactid', data.zemax_zendeskid);
        }

        if (!localStorage.getItem('parentcustomerid')) {
          // eslint-disable-next-line no-underscore-dangle
          localStorage.setItem('parentcustomerid', data.userdetails._parentcustomerid_value);
        }
        if (webroles !== undefined) {
          localStorage.setItem('webroles', JSON.stringify(webroles));
        }

        block.appendChild(
          ul(
            { class: 'webroles-container' },
            ...webroles.map((webrole) => li(
              { class: 'webrole' },
              h3(roleHeadingDescription[webrole.adx_name]
                ? roleHeadingDescription[webrole.adx_name].heading : webrole.adx_name),
              p({ class: 'webrole-description' }, roleHeadingDescription[webrole.adx_name] ? roleHeadingDescription[webrole.adx_name].description : ''),
            )),
          ),
        );

        block.appendChild(
          a(
            {
              href: 'https://support.zemax.com/hc/en-us/sections/1500001481281',
              'aria-label': moreInformationAboutAccessButtonText,
              class: 'more-info secondary',
              target: '_blank',
              rel: 'noreferrer',
            },
            moreInformationAboutAccessButtonText,
          ),
        );
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('Something went wrong.', err);
      });
  }
}
