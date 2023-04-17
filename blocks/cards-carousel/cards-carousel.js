const SLIDE_ID_PREFIX = 'cards-carousel-slide';
const SLIDE_CONTROL_ID_PREFIX = 'cards-carousel-slide-control';

let curSlide = 0;
let slideShow = 3;

/**
 * Keep active dot in sync with current slide
 * @param carousel The carousel
 * @param activeSlide {number} The active slide
 */
function syncActiveDot(carousel, activeSlide) {
  carousel.querySelectorAll('ul.carousel-dots li').forEach((item, index) => {
    const btn = item.querySelector('button');
    if (index === activeSlide) {
      item.classList.add('carousel-dots-active');
      btn.setAttribute('aria-selected', 'true');
      btn.setAttribute('tabindex', '0');
    } else {
      item.classList.remove('carousel-dots-active');
      btn.removeAttribute('aria-selected');
      btn.setAttribute('tabindex', '-1');
    }
  });
}

/**
 * Scroll a single slide into view.
 *
 * @param carousel The carousel
 * @param slideIndex {number} The slide index
 */
function scrollToSlide(carousel, slideIndex) {
  const carouselSlider = carousel.querySelector('.cards-carousel-slide-container');
  const leftPos = (carouselSlider.clientWidth / slideShow) * slideIndex;
  carouselSlider.scrollTo({ left: leftPos, behavior: 'smooth' });
  syncActiveDot(carousel, slideIndex);
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
 *
 * @param slides An array of slide elements within the carousel
 * @return {HTMLUListElement} The carousel dots element
 */
function buildDots(size) {
  const dots = document.createElement('ul');
  dots.classList.add('carousel-dots');
  dots.setAttribute('role', 'tablist');
  [...Array(size)].forEach((_, index) => {
    const dotItem = document.createElement('li');
    dotItem.setAttribute('role', 'presentation');
    if (index === 0) {
      dotItem.classList.add('carousel-dots-active');
    }
    const dotBtn = document.createElement('button');
    dotBtn.setAttribute('id', `${SLIDE_CONTROL_ID_PREFIX}${index}`);
    dotBtn.setAttribute('type', 'button');
    dotBtn.setAttribute('role', 'tab');
    dotBtn.setAttribute('aria-controls', `${SLIDE_ID_PREFIX}${index}`);
    if (index === 0) {
      dotBtn.setAttribute('aria-selected', 'true');
      dotBtn.setAttribute('tabindex', '0');
    } else {
      dotBtn.setAttribute('tabindex', '-1');
    }
    dotBtn.setAttribute('aria-label', `${index + 1} of ${size}`);

    dotBtn.innerText = `${index + 1}`;
    dotItem.append(dotBtn);
    dotItem.addEventListener('click', (e) => {
      curSlide = index;
      const carousel = e.target.closest('.cards-carousel');
      scrollToSlide(carousel, curSlide);
    });
    dots.append(dotItem);
  });

  return dots;
}

/**
 * Decorate a base slide element.
 *
 * @param slide A base block slide element
 * @param index The slide's position
 * @return {HTMLUListElement} A decorated carousel slide element
 */
function buildSlide(slide, index) {
  [...slide.children].forEach((div) => {
    if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
    else div.className = 'cards-card-body';
  });
  slide.setAttribute('id', `${SLIDE_ID_PREFIX}${index}`);
  slide.setAttribute('data-slide-index', index);
  slide.classList.add('cards-carousel-slide');
  // accessibility
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  slide.setAttribute('aria-describedby', `${SLIDE_CONTROL_ID_PREFIX}${index}`);
  if (index !== 0) {
    slide.setAttribute('tabindex', '-1');
  }
  const href = slide.querySelector('a')?.href;
  if (href) {
    slide.classList.add('card-with-link');
    slide.addEventListener('click', () => {
      document.location.href = href;
    });
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
    threshold -= threshold * 0.5;
  } else {
    threshold += threshold * 0.5;
  }
  const block = Math.floor(el.scrollLeft / el.offsetWidth);
  const pos = el.scrollLeft - el.offsetWidth * block;
  const snapToBlock = pos <= threshold ? block : block + 1;
  const carousel = el.closest('.cards-carousel');
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

function calculateSlideShow() {
  const totalWidth = window.innerWidth;
  if (totalWidth >= 992) {
    slideShow = 3;
  } else if (totalWidth >= 767) {
    slideShow = 2;
  } else {
    slideShow = 1;
  }
}

function addDotsIfNeed(slideLength) {
  const dotsNum = Math.ceil(slideLength / slideShow);
  // remove old dots if there is, add dots if there is need
  document.querySelector('.carousel-dots')?.remove();
  if (dotsNum > 1) {
    document.querySelector('.block.cards-carousel').append(buildDots(dotsNum));
    // while dots added, scroll to first slide
    const carouselSlider = document.querySelector('.cards-carousel-slide-container');
    carouselSlider.scrollTo({ left: 0, behavior: 'smooth' });
  }
}

function responsiveHandler(block, slideLength) {
  // initial add dots if need
  calculateSlideShow();
  addDotsIfNeed(slideLength);
  window.matchMedia('(min-width: 992px)').addEventListener('change', (mediaQuery) => {
    if (mediaQuery.matches) {
      slideShow = 3;
      addDotsIfNeed(slideLength);
    }
  });
  window.matchMedia('(min-width: 767px) and (max-width: 992px)').addEventListener('change', (mediaQuery) => {
    if (mediaQuery.matches) {
      slideShow = 2;
      addDotsIfNeed(slideLength);
    }
  });
  window.matchMedia('(max-width: 767px)').addEventListener('change', (mediaQuery) => {
    if (mediaQuery.matches) {
      slideShow = 1;
      addDotsIfNeed(slideLength);
    }
  });
}

/**
 * Decorate and transform a carousel block.
 *
 * @param block HTML block from Franklin
 */
export default function decorate(block) {
  const carousel = document.createElement('div');
  carousel.classList.add('cards-carousel-slide-container');

  makeCarouselDraggable(carousel);

  // build carousel slides
  const slides = [...block.children];
  slides.forEach((slide, index) => {
    carousel.appendChild(buildSlide(slide, index));
  });

  // add decorated carousel to block
  block.append(carousel);

  responsiveHandler(block, slides.length);
}
