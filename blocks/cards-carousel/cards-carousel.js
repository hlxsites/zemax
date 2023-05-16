const SLIDE_ID_PREFIX = 'cards-carousel-slide';
const SLIDE_CONTROL_ID_PREFIX = 'cards-carousel-slide-control';

let curSlide = 0;
let maxSlide = 0;
let slideShow = 3;

/**
 * Keep active dot in sync with current slide
 * @param carouselWrapper The carousel
 * @param activeDotIndex {number} The active dot
 */
function syncActiveDot(carouselWrapper, activeDotIndex) {
  carouselWrapper.querySelectorAll('ul.carousel-dots li').forEach((item, index) => {
    const btn = item.querySelector('button');
    if (index === activeDotIndex) {
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
 * @param carouselWrapper The carousel
 * @param slideIndex {number} The slide index
 */
function scrollToSlide(carouselWrapper, slideIndex) {
  const carouselSlider = carouselWrapper.querySelector('.cards-carousel-slide-container');
  const leftPos = (carouselSlider.clientWidth / slideShow) * slideIndex;
  carouselSlider.scrollTo({ left: leftPos, behavior: 'smooth' });
  syncActiveDot(carouselWrapper, slideIndex / slideShow);
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
 * Build dots for controlling the carousel
 * @param {*} dotNum the number of dots to build
 * @returns {HTMLUListElement} The carousel dots element
 */
function buildDots(dotNum) {
  const dots = document.createElement('ul');
  dots.classList.add('carousel-dots');
  dots.setAttribute('role', 'tablist');
  [...Array(dotNum)].forEach((_, dotIndex) => {
    const dotItem = document.createElement('li');
    dotItem.setAttribute('role', 'presentation');
    if (dotIndex === 0) {
      dotItem.classList.add('carousel-dots-active');
    }
    const dotBtn = document.createElement('button');
    dotBtn.setAttribute('id', `${SLIDE_CONTROL_ID_PREFIX}${dotIndex}`);
    dotBtn.setAttribute('type', 'button');
    dotBtn.setAttribute('role', 'tab');
    dotBtn.setAttribute('aria-controls', `${SLIDE_ID_PREFIX}${dotIndex}`);
    if (dotIndex === 0) {
      dotBtn.setAttribute('aria-selected', 'true');
      dotBtn.setAttribute('tabindex', '0');
    } else {
      dotBtn.setAttribute('tabindex', '-1');
    }
    dotBtn.setAttribute('aria-label', `${dotIndex + 1} of ${dotNum}`);

    dotBtn.innerText = `${dotIndex + 1}`;
    dotItem.append(dotBtn);
    dotItem.addEventListener('click', (e) => {
      curSlide = dotIndex * slideShow;
      const carouselWrapper = e.target.closest('.cards-carousel-wrapper');
      scrollToSlide(carouselWrapper, curSlide);
    });
    dots.append(dotItem);
  });

  return dots;
}

/**
 * Build a navigation button for controlling the direction of logos slides.
 *
 * @param dir A string of either 'prev or 'next'
 * @return {HTMLDivElement} The resulting nav element
 */
function buildNav(dir) {
  const nav = document.createElement('div');
  nav.classList.add('carousel-nav', `carousel-nav-${dir}`);
  nav.addEventListener('click', (e) => {
    let nextSlide = 0;
    if (dir === 'prev') {
      if (curSlide <= 0) {
        nextSlide = maxSlide - slideShow + 1;
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
      }
    }
    const carouselWrapper = e.target.closest('.cards-carousel-wrapper');
    scrollToSlide(carouselWrapper, nextSlide);
  });
  return nav;
}

/**
 * Decorate a base slide element.
 *
 * @param slide A base block slide element
 * @param index The slide's position
 * @return {HTMElement} A decorated carousel slide element
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
  const carouselWrapper = el.closest('.cards-carousel-wrapper');
  scrollToSlide(carouselWrapper, snapToBlock);
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

function calculateSlideShow(defaultVariant) {
  const totalWidth = window.innerWidth;
  if (totalWidth >= 992) {
    slideShow = defaultVariant ? 1 : 3;
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
    document.querySelector('.cards-carousel-wrapper').append(buildDots(dotsNum));
    // while dots added, scroll to first slide
    const carouselSlider = document.querySelector('.cards-carousel-slide-container');
    carouselSlider.scrollTo({ left: 0, behavior: 'smooth' });
  }
}

function responsiveHandler(slideLength, defaultVariant) {
  // initial add dots if need
  calculateSlideShow(defaultVariant);
  addDotsIfNeed(slideLength);
  window.matchMedia('(min-width: 992px)').addEventListener('change', (mediaQuery) => {
    if (mediaQuery.matches) {
      slideShow = defaultVariant ? 1 : 3;
      addDotsIfNeed(slideLength);
    }
  });
  window.matchMedia('(min-width: 767px) and (max-width: 992px)').addEventListener('change', (mediaQuery) => {
    if (mediaQuery.matches) {
      slideShow = defaultVariant ? 1 : 2;
      addDotsIfNeed(slideLength);
    }
  });
  window.matchMedia('(min-width: 640px) and (max-width: 767px)').addEventListener('change', (mediaQuery) => {
    if (mediaQuery.matches) {
      slideShow = defaultVariant ? 2 : 1;
      addDotsIfNeed(slideLength);
    }
  });
  window.matchMedia('(max-width: 640px)').addEventListener('change', (mediaQuery) => {
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
  maxSlide = slides.length - 1;
  slides.forEach((slide, index) => {
    carousel.appendChild(buildSlide(slide, index));
  });

  // add decorated carousel to block
  block.append(carousel);

  // add nav buttons if that is a feature variant
  const featureVariant = block.classList.contains('feature');
  if (featureVariant) {
    const prevBtn = buildNav('prev');
    block.prepend(prevBtn);
    const nextBtn = buildNav('next');
    block.append(nextBtn);
  }

  responsiveHandler(slides.length, featureVariant);
}
