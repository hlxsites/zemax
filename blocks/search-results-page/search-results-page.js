/* eslint-disable no-console */
import { h1, span } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const response = await fetch('https://zemaxportalfunctions.azurewebsites.net/api/insided_search?pageSize=3&page=1&q=optic',
    { headers: { authsdi: 'iddqd' } });

  if (response.ok) {
    const json = await response.json();
    console.log(json);
    addResults(json.result, block);
  } else {
    console.error('Error fetching data:', response.status, response.statusText);
  }
}

function addResults(result, block) {
  result.forEach((item) => {
    block.append(h1(item.title));
    // block.append(span(item....));
  });
}
