import { createTag, loadScript } from '../../scripts/scripts.js';
import { readBlockConfig, fetchPlaceholders } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const blockConfig = readBlockConfig(block);
  const placeholders = await fetchPlaceholders();
  const formId = placeholders.marketoformid;
  const divId = blockConfig['div-id'];

  if (formId && divId) {
    const formDiv = createTag('form', { id: `mktoForm_${divId}` });
    block.textContent = '';
    block.append(formDiv);
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        const mktoScriptTag = loadScript('//go.zemax.com/js/forms2/js/forms2.min.js');
        mktoScriptTag.onload = () => {
          window.MktoForms2.loadForm('//go.zemax.com', `${formId}`, divId);
        };
      }
    });
    observer.observe(block);
  }
}
