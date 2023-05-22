import { getEnvironmentConfig } from './zemax-config.js';

export default async function execute(actionName, urlParams, methodType) {
  try {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
