// eslint-disable-next-line import/no-unresolved
import { getEnvironmentConfig } from './zemax-config.js';
import { showLoadingIcon, hideLoadingIcon, loadScriptPromise } from './scripts.js';
import { fetchPlaceholders } from './lib-franklin.js';

function getRedirectUri() {
  return `${window.location.origin}/pages/profile`;
}

export default async function execute(actionName, urlConfig, methodType, loadingIconClassSelector) {
  try {
    const placeholders = await fetchPlaceholders();
    const domain = placeholders.auth0domain;
    const clientID = placeholders.clientid;

    await loadScriptPromise('/scripts/auth0-spa-js.production.js', {
      type: 'text/javascript',
      charset: 'UTF-8',
    });
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-undef
    const auth0Client = await auth0.createAuth0Client({
      // eslint-disable-next-line object-shorthand
      domain: domain,
      clientId: clientID,
      authorizationParams: {
        redirect_uri: getRedirectUri(),
      },
    });

    console.log(auth0Client);
    console.log(await auth0Client.isAuthenticated());
    console.log(await auth0Client.getUser());
    const accessToken1 = await auth0Client.getTokenSilently();

    console.log(accessToken1);
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
