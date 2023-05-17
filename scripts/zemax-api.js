import { getEnvironmentConfig } from './zemax-config.js';

export default function execute(actionName, urlParams, methodType) {
  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;
  return new Promise((resolve, reject) => {
    fetch(`${DYNAMIC_365_DOMAIN}${actionName}?auth0_id=${userId}${urlParams}`, {
      method: methodType,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Process the data if needed
        resolve(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      });
  });
}
