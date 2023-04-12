import { createTag, loadScript } from '../../scripts/scripts.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

const embedMarketoForm = (formId, divId) => {
  // PDF Viewer for doc pages
  if (formId && divId) {
    const mktoScriptTag = loadScript('//go.zemax.com/js/forms2/js/forms2.min.js');
    mktoScriptTag.onload = () => {
      window.MktoForms2.loadForm('//go.zemax.com', `${formId}`, divId);
    };
  }
};

export default async function decorate(block) {
  const blockConfig = readBlockConfig(block);
  const formId = blockConfig['form-id'];
  const divId = blockConfig['div-id'];

  if (formId && divId) {
    const formDiv = createTag('form', { id: `mktoForm_${divId}` });
    block.textContent = '';
    block.append(formDiv);

    window.setTimeout(() => embedMarketoForm(formId, divId), 2000);
  }
}
