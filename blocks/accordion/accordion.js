export default function decorate(block) {
  const faqRows = [...block.children];

  block.classList.add('faq-accordion');
  faqRows.forEach((row) => {
    const faqQuestion = [...row.children][0];
    faqQuestion.classList.add('faq-question');
    faqQuestion.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('active');
      e.currentTarget.nextElementSibling.classList.toggle('active');
    });

    const faqAnswer = [...row.children][1];
    faqAnswer.classList.add('faq-answer');
  });
}
