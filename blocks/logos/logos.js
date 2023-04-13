class CarouselSlider {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.wrap = this.element.querySelector('.slider-wrap');
    this.originalElements = Array.from(this.element.querySelectorAll('.slider-element'));
    this.slideCounter = 0;
    this.inTransition = false;
    this.elementsPerSlide = this.options.elementsPerSlide;
    this.breakpoint = false;
    this.viewportWidth = window.innerWidth;
    this.sliderSet = false;
  }

  init() {
    const breakpoint = this.getBreakpoint();

    if (breakpoint) {
      this.elementsPerSlide = this.options.breakpoints[breakpoint].elementsPerSlide;
      this.breakpoint = breakpoint;
      window.addEventListener('resize', CarouselSlider.debounce(this.handleResize.bind(this)));
    }
    if (this.originalElements.length > this.elementsPerSlide) {
      this.setSlider();
    }
  }

  static debounce(func) {
    let timer;
    return (event) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 200, event);
    };
  }

  setSlider() {
    if (this.sliderSet) {
      return;
    }
    this.setStyles();
    this.setElements();
    this.reorderSlides();
    this.setControls();
    this.addEventListeners();
    this.sliderSet = true;
  }

  resetSlider() {
    if (!this.sliderSet) {
      return;
    }
    this.slideCounter = 0;
    this.element.style.setProperty('--slide-transform', '0');
    this.setElements();
    this.reorderSlides();
  }

  destroySlider() {
    if (!this.sliderSet) {
      return;
    }
    this.removeStyles();
    this.setElements();
    this.removeEventListeners();
    this.prevButton.remove();
    this.nextButton.remove();
    this.sliderSet = false;
  }

  getBreakpoint() {
    let newBreakpoint = false;

    if (this.options.breakpoints) {
      Object.keys(this.options.breakpoints).forEach((key) => {
        if (window.matchMedia(`(min-width: ${key}px)`).matches) {
          newBreakpoint = key;
        }
      });
    }
    return newBreakpoint;
  }

  handleResize() {
    const breakpoint = this.getBreakpoint();
    const viewportWidth = window.innerWidth;
    const breakpointChange = breakpoint !== this.breakpoint;

    if (viewportWidth === this.viewportWidth) {
      return;
    }

    this.viewportWidth = viewportWidth;
    this.elementsPerSlide = this.options.breakpoints[breakpoint].elementsPerSlide;
    if (breakpointChange && this.originalElements.length > this.elementsPerSlide) {
      this.setSlider();
      this.resetSlider();
      this.breakpoint = breakpoint;
    } else if (breakpointChange && this.originalElements.length <= this.elementsPerSlide) {
      this.destroySlider();
      this.breakpoint = breakpoint;
    } else if (this.options.breakpoints[breakpoint].responsiveWidth === 'fluid') {
      this.resizeElements();
    }
  }

  setStyles() {
    this.element.style.setProperty('--slide-transform', '0');
    this.element.style.setProperty('--transition', `transform ${this.options.transitionTime}`);
    this.wrap.style.setProperty('transform', 'translateX(var(--slide-transform))');
    this.wrap.style.setProperty('transition', 'var(--transition)');
  }

  removeStyles() {
    this.element.style.removeProperty('--slide-transform');
    this.element.style.removeProperty('--transition');
    this.wrap.style.removeProperty('transform');
    this.wrap.style.removeProperty('transition');
  }

  setControls() {
    this.element.setAttribute('tabindex', '0');
    this.prevButton = document.createElement('button');
    this.nextButton = document.createElement('button');
    this.prevButton.classList.add('slider-button', 'slider-button-prev');
    this.nextButton.classList.add('slider-button', 'slider-button-next');
    this.element.prepend(this.prevButton);
    this.element.append(this.nextButton);
  }

  resizeElements() {
    const width = this.element.offsetWidth;
    const elementWidth = width / this.elementsPerSlide;
    const elements = this.wrap.childNodes;

    elements.forEach((element) => {
      element.style.width = `${elementWidth}px`;
    });
    this.wrap.style.width = `${elementWidth * (elements.length)}px`;
    this.element.style.setProperty('--slide-transform', `-${elementWidth * this.elementsPerSlide}px`);
    this.slideCounter = 1;
  }

  setElements() {
    const width = this.element.offsetWidth === 0 ? 800 : this.element.offsetWidth;
    const elementWidth = width / this.elementsPerSlide;
    const elementsLength = this.originalElements.length;
    const sliderNeeded = this.originalElements.length > this.elementsPerSlide;
    let clonesNumber = 0;
    let i = 0;
    let indexToAppend;
    let elementToAppend;

    this.wrap.innerHTML = '';
    if (this.elementsPerSlide * 3 > elementsLength && sliderNeeded) {
      while (this.elementsPerSlide * 3 >= (elementsLength + clonesNumber)) {
        clonesNumber += elementsLength;
      }
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < elementsLength + clonesNumber; i++) {
      indexToAppend = i % elementsLength;
      elementToAppend = this.originalElements[indexToAppend].cloneNode(true);
      elementToAppend.style.width = `${elementWidth}px`;
      this.wrap.append(elementToAppend);
    }
    this.slidesNumber = Math.floor((elementsLength + clonesNumber) / this.elementsPerSlide);
    this.wrap.style.width = `${elementWidth * (elementsLength + clonesNumber)}px`;
  }

  addEventListeners() {
    this.wrap.addEventListener('transitionend', this.reorderSlides.bind(this));
    this.prevButton.addEventListener('click', this.move.bind(this, 'left'));
    this.nextButton.addEventListener('click', this.move.bind(this, 'right'));
    this.element.addEventListener('keydown', this.keyboardNavigation.bind(this));
  }

  removeEventListeners() {
    this.wrap.removeEventListener('transitionend', this.reorderSlides.bind(this));
    this.prevButton.removeEventListener('click', this.move.bind(this, 'left'));
    this.nextButton.removeEventListener('click', this.move.bind(this, 'right'));
    this.element.removeEventListener('keydown', this.keyboardNavigation.bind(this));
  }

  getTransformValue() {
    return Number(this.element.style.getPropertyValue('--slide-transform').replace('px', ''));
  }

  moveLeft(transformValue) {
    this.element.style.setProperty(
      '--slide-transform',
      `${transformValue + this.wrap.children[this.slideCounter].scrollWidth * this.elementsPerSlide}px`,
    );
    // eslint-disable-next-line no-plusplus
    this.slideCounter--;
  }

  moveRight(transformValue) {
    this.element.style.setProperty(
      '--slide-transform',
      `${transformValue - this.wrap.children[this.slideCounter].scrollWidth * this.elementsPerSlide}px`,
    );
    // eslint-disable-next-line no-plusplus
    this.slideCounter++;
  }

  move(direction) {
    if (this.inTransition) {
      return;
    }

    const transformValue = this.getTransformValue();
    this.element.style.setProperty('--transition', `transform ${this.options.transitionTime}`);
    this.inTransition = true;

    if (direction === 'left') {
      this.moveLeft(transformValue);
    } else if (direction === 'right') {
      this.moveRight(transformValue);
    }
  }

  reorderSlides() {
    const transformValue = this.getTransformValue();
    let i = 0;

    this.element.style.setProperty('--transition', 'none');
    if (this.slideCounter === this.slidesNumber - 1) {
      // eslint-disable-next-line no-plusplus
      for (i; i < this.elementsPerSlide; i++) {
        this.wrap.appendChild(this.wrap.firstElementChild);
      }
      this.moveLeft(transformValue);
    } else if (this.slideCounter === 0) {
      // eslint-disable-next-line no-plusplus
      for (i; i < this.elementsPerSlide; i++) {
        this.wrap.prepend(this.wrap.lastElementChild);
      }
      this.moveRight(transformValue);
    }
    this.inTransition = false;
  }

  keyboardNavigation(e) {
    switch (e.key) {
      case 'ArrowLeft':
        this.move('left');
        break;
      case 'ArrowRight':
        this.move('right');
        break;
      default:
        break;
    }
  }
}

export default function decorate(block) {
  const elements = Array.from(block.children);
  const wrap = document.createElement('div');
  const section = block.closest('.section');
  block.classList.add('logos');
  wrap.classList.add('slider-wrap');

  elements.forEach((element) => {
    element.classList.add('slider-element');
    wrap.append(element);
  });
  block.innerHTML = '';
  block.append(wrap);

  const slider = new CarouselSlider(block, {
    elementsPerSlide: 1,
    transitionTime: '1s',
    breakpoints: {
      0: {
        elementsPerSlide: 2,
        responsiveWidth: 'fluid',
      },
      480: {
        elementsPerSlide: 2,
        responsiveWidth: 'static',
      },
      640: {
        elementsPerSlide: 4,
        responsiveWidth: 'static',
      },
      1200: {
        elementsPerSlide: 4,
        responsiveWidth: 'static',
      },
    },
  });
  slider.init();
}
