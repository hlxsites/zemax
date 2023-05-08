import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

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
  return slide;
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

function addDotsIfNeed(block, slideLength) {
  const dotsNum = Math.ceil(slideLength / slideShow);

  // remove old dots if there is, add dots if there is need
  document.querySelector('.carousel-dots')?.remove();
  if (dotsNum > 1) {
    const carouselDots = buildDots(dotsNum);
    console.log(carouselDots);
    console.log(block);
    // block.append(carouselDots);
    // while dots added, scroll to first slide
    const carouselSlider = block.querySelector('.cards-carousel-slide-container');
    carouselSlider.scrollTo({ left: 0, behavior: 'smooth' });
  }
}

function responsiveHandler(block, slideLength) {
  // initial add dots if need
  calculateSlideShow();
  addDotsIfNeed(block, slideLength);
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

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);

  // Full card should be clickable
  block.querySelectorAll('.cards > ul > li').forEach((card) => {
    card.addEventListener('click', () => {
      const alink = card.querySelector('a');
      document.location.href = alink.href;
    });
  });

  // Carousel Mode
  if (block.classList.contains('carousel')) {
    const carousel = document.createElement('div');
    carousel.classList.add('cards-carousel-slide-container');

    // build carousel slides
    const slides = block.querySelectorAll('.cards > ul > li');
    slides.forEach((slide, index) => {
      carousel.appendChild(buildSlide(slide, index));
    });

    // add decorated carousel to block
    block.innerHTML = '';
    block.append(carousel);

    responsiveHandler(block, slides.length);
  }
}
