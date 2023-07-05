import { getEnvironmentConfig } from './zemax-config.js';
import { showLoadingIcon, hideLoadingIcon } from './scripts.js';

export default async function execute(actionName, urlConfig, methodType, loadingIconClassSelector) {
  try {
    if (loadingIconClassSelector) {
      showLoadingIcon(loadingIconClassSelector);
    }
    let urlParams = urlConfig ? new URLSearchParams(urlConfig).toString() : '';
    if (urlParams) {
      urlParams = `?${urlParams}`;
    }

    const accessToken = localStorage.getItem('accessToken');
    const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;
    const fetchURL = `${DYNAMIC_365_DOMAIN}${actionName}${urlParams}`;
    const response = await fetch(`${fetchURL}`, {
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
