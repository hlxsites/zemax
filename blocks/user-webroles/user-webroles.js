import { getLocaleConfig } from '../../scripts/zemax-config.js';
import {
  li, ul, h3, p, a, div,
} from '../../scripts/dom-helpers.js';
import execute from '../../scripts/zemax-api.js';

export default async function decorate(block) {
  const webrolesLoadingIcon = div({ class: 'user-webroles loading-icon' }, '');
  block.append(webrolesLoadingIcon);
  const { roleHeadingDescription, moreInformationAboutAccessButtonText } = getLocaleConfig('en_us', 'userWebroles');
  const accessToken = localStorage.getItem('accessToken');

  // eslint-disable-next-line max-len
  if (accessToken) {
    const data = await execute('dynamics_get_webrole', '', 'GET', '.user-webroles.loading-icon');

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
  }
}
