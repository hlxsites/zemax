import { getLocaleConfig } from '../../scripts/zemax-config.js';
import { createTag } from '../../scripts/scripts.js';
import { div, p } from '../../scripts/dom-helpers.js';
import execute from '../../scripts/zemax-api.js';

export default async function decorate(block) {
  const userInfoLoadingIcon = div({ class: 'user-info loading-icon' }, '');
  block.append(userInfoLoadingIcon);
  const mainDiv = document.querySelector('main');
  mainDiv.classList.add('profile-page');
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const fullName = localStorage.getItem('fullname');
  const userEmail = localStorage.getItem('email');

  if (userId && accessToken) {
    const data = await execute('insided_get_user_link', '', 'GET', '.user-info.loading-icon');

    const pName = p({ class: 'users-fullname' }, fullName);
    block.append(pName);

    const pEmail = p({ class: 'users-email' }, userEmail);
    block.append(pEmail);

    // Link URL for user's community profile
    const userLink = (data.link === '' || data.link === undefined) ? 'https://community.zemax.com/ssoproxy/login?ssoType=openidconnect&returnUrl=' : data.link;

    const anchor = createTag('a', { class: 'button primary', href: userLink, target: '_blank' }, getLocaleConfig('en_us', 'userInfo').forumProfileActivityButtonText);
    block.append(anchor);
  }
}
