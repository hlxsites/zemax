export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // merge feature columns into one row, as they wrap automatically
  if (block.classList.contains('featured')) {
    const cells = block.querySelectorAll(':scope > div:not(:first-child) > div');
    cells.forEach((cell) => {
      block.firstElementChild.appendChild(cell);
    });
  }
}
