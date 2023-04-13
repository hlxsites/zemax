/**
 * logos Block
 *
 * This block adds logos behavior to a block. The default block markup will be
 * augmented and additional markup will be added to render the final presentation.
 *
 * Features:
 * - smooth scrolling
 * - mouse drag between slides
 * - next and previous button
 * - accessibility
 *
 * @example logos markup
 * <div class="logos">
 *   <div class="logos-nav logos-nav-prev"></div>
 *   <div class="logos-slide-container">
 *     <div class="logos-slide">
 *       <div>content</div>
 *     </div>
 *     ...
 *   </div>
 *   <div class="logos-nav logos-nav-next"></div>
 * </div>
 */

const SLIDE_ID_PREFIX = 'logos-slide';
const SLIDE_CONTROL_ID_PREFIX = 'logos-slide-control';

let curSlide = 0;
let maxSlide = 0;
let slideShow = 4;

/**
 * Scroll a single slide into view.
 *
 * @param logos The logos
 * @param slideIndex {number} The slide index
 */
function scrollToSlide(logos, slideIndex, smooth = true) {
  const logosSlider = logos.querySelector('.logos-slide-container');
  const leftPos = (logosSlider.clientWidth / slideShow) * slideIndex;
  if (smooth) {
    logosSlider.scrollTo({ left: leftPos, behavior: 'smooth' });
  } else {
    logosSlider.scrollTo({ left: leftPos, behavior: 'instant' });
  }
  // sync slide
  [...logosSlider.children].forEach((slide, index) => {
    if (index === slideIndex) {
      slide.removeAttribute('tabindex');
      slide.setAttribute('aria-hidden', 'false');
    } else {
      slide.setAttribute('tabindex', '-1');
      slide.setAttribute('aria-hidden', 'true');
    }
  });
  curSlide = slideIndex;
}

/**
 * Build a navigation button for controlling the direction of logos slides.
 *
 * @param dir A string of either 'prev or 'next'
 * @return {HTMLDivElement} The resulting nav element
 */
function buildNav(dir) {
  const btn = document.createElement('div');
  btn.classList.add('logos-nav', `logos-nav-${dir}`);
  btn.addEventListener('click', (e) => {
    let nextSlide = 0;
    let smooth = true;
    if (dir === 'prev') {
      if (curSlide <= 0) {
        nextSlide = maxSlide - slideShow + 1;
        smooth = false;
      } else {
        nextSlide = curSlide - slideShow;
      }
      if (nextSlide < 0) {
        nextSlide = 0;
      }
    } else {
      nextSlide = curSlide + slideShow;
      if (nextSlide > maxSlide) {
        nextSlide = 0;
        smooth = false;
      }
    }
    const logos = e.target.closest('.logos');
    scrollToSlide(logos, nextSlide, smooth);
  });
  return btn;
}

/**
 * Decorate a base slide element.
 *
 * @param slide A base block slide element
 * @param index The slide's position
 * @return {HTMLUListElement} A decorated logos slide element
 */
function buildSlide(slide, index) {
  slide.setAttribute('id', `${SLIDE_ID_PREFIX}${index}`);
  slide.setAttribute('data-slide-index', index);
  slide.classList.add('logos-slide');
  // accessibility
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  slide.setAttribute('aria-describedby', `${SLIDE_CONTROL_ID_PREFIX}${index}`);
  if (index !== 0) {
    slide.setAttribute('tabindex', '-1');
  }
  return slide;
}

/**
 * Based on the direction of a scroll snap the scroll position based on the
 * offset width of the scrollable element. The snap threshold is determined
 * by the direction of the scroll to ensure that snap direction is natural.
 *
 * @param el the scrollable element
 * @param dir the direction of the scroll
 */
function snapScroll(el, dir = 1) {
  if (!el) {
    return;
  }
  let threshold = el.offsetWidth * 0.5;
  if (dir >= 0) {
    threshold -= (threshold * 0.5);
  } else {
    threshold += (threshold * 0.5);
  }
  const block = Math.floor(el.scrollLeft / el.offsetWidth);
  const pos = el.scrollLeft - (el.offsetWidth * block);
  const snapToBlock = pos <= threshold ? block : block + 1;
  const logos = el.closest('.logos');
  scrollToSlide(logos, snapToBlock);
}

/**
 * add mouse event handler to make logos draggable
 * @param logos the logos element
 */
function makeLogosDraggable(logos) {
  // make logos draggable
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let prevScroll = 0;

  logos.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - logos.offsetLeft;
    startScroll = logos.scrollLeft;
    prevScroll = startScroll;
  });

  logos.addEventListener('mouseleave', () => {
    if (isDown) {
      snapScroll(logos, logos.scrollLeft > startScroll ? 1 : -1);
    }
    isDown = false;
  });

  logos.addEventListener('mouseup', () => {
    if (isDown) {
      snapScroll(logos, logos.scrollLeft > startScroll ? 1 : -1);
    }
    isDown = false;
  });

  logos.addEventListener('mousemove', (e) => {
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const x = e.pageX - logos.offsetLeft;
    const walk = x - startX;
    logos.scrollLeft = prevScroll - walk;
  });
}

/**
 * Decorate and transform a logos block.
 *
 * @param block HTML block from Franklin
 */
export default function decorate(block) {
  const logos = document.createElement('div');
  logos.classList.add('logos-slide-container');

  makeLogosDraggable(logos);

  // build logos slides
  const slides = [...block.children];
  maxSlide = slides.length - 1;
  slides.forEach((slide, index) => {
    logos.appendChild(buildSlide(slide, index));
  });

  // add decorated logos to block
  block.append(logos);

  // add nav buttons and dots to block
  if (slides.length > 1) {
    const prevBtn = buildNav('prev');
    block.prepend(prevBtn);
    const nextBtn = buildNav('next');
    block.append(nextBtn);
  }

  window.addEventListener('resize', () => {
    const totalWidth = window.innerWidth;
    if (totalWidth >= 724) {
      slideShow = 4;
    } else if (totalWidth >= 553) {
      slideShow = 3;
    } else if (totalWidth >= 382) {
      slideShow = 2;
    } else {
      slideShow = 1;
    }
  });
}
