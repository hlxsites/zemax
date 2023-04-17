export default function decorate(block) {
  const faqRows = [...block.children];

  block.classList.add('faq-accordion');
  faqRows.forEach((row) => {
    const faqQuestion = [...row.children][0];
    faqQuestion.classList.add('faq-question');
    faqQuestion.addEventListener('click', (e) => {
      const openfaq = block.querySelector('.faq-question.active');
      openfaq.classList.remove('active');
      openfaq.nextElementSibling.classList.remove('active');
      openfaq.nextElementSibling.style.removeProperty('max-height');
      e.currentTarget.classList.toggle('active');
      e.currentTarget.nextElementSibling.classList.toggle('active');
      const faqAnswer = e.currentTarget.nextElementSibling;
      if (faqAnswer.style.maxHeight) {
        faqAnswer.style.removeProperty('max-height');
      } else {
        faqAnswer.style.maxHeight = `${faqAnswer.scrollHeight}px`;
      }
    });

    const faqAnswer = [...row.children][1];
    faqAnswer.classList.add('faq-answer');
  });

  const fq = block.querySelector('.faq-question');
  const fa = block.querySelector('.faq-answer');
  fq.classList.toggle('active');
  fa.classList.toggle('active');
  fa.style.maxHeight = 'unset';
}
