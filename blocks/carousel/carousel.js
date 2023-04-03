/**
 * Carousel Block
 *
 * This block adds carousel behavior to a block. The default block markup will be
 * augmented and additional markup will be added to render the final presentation.
 *
 * Features:
 * - smooth scrolling
 * - mouse drag between slides
 * - next and previous button
 * - accessibility
 *
 * @example Carousel markup
 * <div class="carousel">
 *   <div class="carousel-nav carousel-nav-prev"></div>
 *   <div class="carousel-slide-container">
 *     <div class="carousel-slide">
 *       <div>content</div>
 *     </div>
 *     ...
 *   </div>
 *   <div class="carousel-nav carousel-nav-next"></div>
 * </div>
 */

const SLIDE_ID_PREFIX = 'carousel-slide';
const SLIDE_CONTROL_ID_PREFIX = 'carousel-slide-control';

let curSlide = 0;
let maxSlide = 0;

/**
 * Scroll a single slide into view.
 *
 * @param carousel The carousel
 * @param slideIndex {number} The slide index
 */
function scrollToSlide(carousel, slideIndex = 0) {
  const carouselSlider = carousel.querySelector('.carousel-slide-container');
  carouselSlider.scrollTo({ left: carouselSlider.offsetWidth * slideIndex, behavior: 'smooth' });
  // sync slide
  [...carouselSlider.children].forEach((slide, index) => {
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
 * Build a navigation button for controlling the direction of carousel slides.
 *
 * @param dir A string of either 'prev or 'next'
 * @return {HTMLDivElement} The resulting nav element
 */
function buildNav(dir) {
  const btn = document.createElement('div');
  btn.classList.add('carousel-nav', `carousel-nav-${dir}`);
  btn.addEventListener('click', (e) => {
    let nextSlide = 0;
    if (dir === 'prev') {
      nextSlide = curSlide === 0 ? maxSlide : curSlide - 1;
    } else {
      nextSlide = curSlide === maxSlide ? 0 : curSlide + 1;
    }
    const carousel = e.target.closest('.carousel');
    scrollToSlide(carousel, nextSlide);
  });
  return btn;
}

/**
 * Decorate a base slide element.
 *
 * @param slide A base block slide element
 * @param index The slide's position
 * @return {HTMLUListElement} A decorated carousel slide element
 */
function buildSlide(slide, index) {
  slide.setAttribute('id', `${SLIDE_ID_PREFIX}${index}`);
  slide.setAttribute('data-slide-index', index);
  slide.classList.add('carousel-slide');
  slide.style.transform = `translateX(${index * 20}%)`;
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
  const carousel = el.closest('.carousel');
  scrollToSlide(carousel, snapToBlock);
}

/**
 * add mouse event handler to make carousel draggable
 * @param carousel the carousel element
 */
function makeCarouselDraggable(carousel) {
  // make carousel draggable
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let prevScroll = 0;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    startScroll = carousel.scrollLeft;
    prevScroll = startScroll;
  });

  carousel.addEventListener('mouseleave', () => {
    if (isDown) {
      snapScroll(carousel, carousel.scrollLeft > startScroll ? 1 : -1);
    }
    isDown = false;
  });

  carousel.addEventListener('mouseup', () => {
    if (isDown) {
      snapScroll(carousel, carousel.scrollLeft > startScroll ? 1 : -1);
    }
    isDown = false;
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = x - startX;
    carousel.scrollLeft = prevScroll - walk;
  });
}

/**
 * Decorate and transform a carousel block.
 *
 * @param block HTML block from Franklin
 */
export default function decorate(block) {
  const carousel = document.createElement('div');
  carousel.classList.add('carousel-slide-container');

  makeCarouselDraggable(carousel);

  // build carousel slides
  const slides = [...block.children];
  maxSlide = slides.length - 1;
  slides.forEach((slide, index) => {
    carousel.appendChild(buildSlide(slide, index));
  });

  // add decorated carousel to block
  block.append(carousel);

  // add nav buttons and dots to block
  if (slides.length > 1) {
    const prevBtn = buildNav('prev');
    block.prepend(prevBtn);
    const nextBtn = buildNav('next');
    block.append(nextBtn);
  }
}
