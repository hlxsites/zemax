import { createTag } from '../../scripts/scripts.js';
import { embedMarketoForm } from '../../scripts/delayed.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const blockConfig = readBlockConfig(block);
  const formId = blockConfig['form-id'];
  const divId = blockConfig['div-id'];

  if (formId && divId) {
    const formDiv = createTag('form', { id: `mktoForm_${divId}` });
    block.textContent = '';
    block.append(formDiv);
    embedMarketoForm(formId, divId);
  }
}
