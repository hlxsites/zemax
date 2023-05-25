import { getEnvironmentConfig, getLocaleConfig } from '../../scripts/zemax-config.js';
import { createTag } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const fullName = localStorage.getItem('fullname');
  const userEmail = localStorage.getItem('email');
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  // TODO move to template logic
  if (userId == null || userId === undefined || accessToken == null || accessToken === undefined) {
    window.location.assign(`${window.location.origin}`);
  } else {
    fetch(`${DYNAMIC_365_DOMAIN}insided_get_user_link?auth0_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    }).then(async (response) => {
      const data = await response.json();

      // Paragraph tag for user's full name
      const pName = createTag('p', { class: 'users-fullname' }, fullName);
      block.append(pName);

      // Paragraph tag for user's email
      const pEmail = createTag('p', { class: 'users-email' }, userEmail);
      block.append(pEmail);

      // Link URL for user's community profile
      const userLink = (data.link === '' || data.link === undefined) ? 'https://community.zemax.com/ssoproxy/setUsernameForm' : data.link;

      // Use placeholder
      const anchor = createTag('a', { class: 'button primary', href: userLink, target: '_blank' }, getLocaleConfig('en_us', 'userInfo').forumProfileActivityButtonText);
      block.append(anchor);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Something went wrong.', err);
    });
  }
}
