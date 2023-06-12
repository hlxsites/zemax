import { getEnvironmentConfig } from './zemax-config.js';
import { showLoadingIcon, hideLoadingIcon } from './scripts.js';

export default async function execute(actionName, urlConfig, methodType, loadingIconClassSelector) {
  try {
    if (loadingIconClassSelector) {
      showLoadingIcon(loadingIconClassSelector);
    }
    let urlParams = urlConfig ? new URLSearchParams(urlConfig).toString() : '';
    if (urlParams) {
      urlParams = `&${urlParams}`;
    }
    const userId = localStorage.getItem('auth0_id');
    const accessToken = localStorage.getItem('accessToken');
    const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;
    const response = await fetch(`${DYNAMIC_365_DOMAIN}${actionName}?auth0_id=${userId}${urlParams}`, {
      method: methodType,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      if (loadingIconClassSelector) {
        hideLoadingIcon(loadingIconClassSelector);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (loadingIconClassSelector) {
      hideLoadingIcon(loadingIconClassSelector);
    }
    return data;
  } catch (error) {
    if (loadingIconClassSelector) {
      hideLoadingIcon(loadingIconClassSelector);
    }
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    throw error;
  }
}
