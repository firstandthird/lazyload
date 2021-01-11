const lazyloadOptions = {
  rootElement: null,
  rootMargin: `0px 0px ${window.innerHeight / 2}px 0px`,
  treshold: 1,
  lazyloadClass: 'loaded',
  nativeLazyloadEnabled: 'loading' in HTMLImageElement.prototype,

  getOptions() {
    return {
      root: this.rootElement,
      rootMargin: this.rootMargin,
      threshold: this.treshold
    };
  }
};

let lazyObserver = null;
let resizeListener = null;
let elements = [];
let images = [];

const setSource = element => {
  const { src, srcset, wait } = element.dataset;

  if (src) {
    element.src = src;
  }

  if (srcset) {
    element.srcset = srcset;
  }

  if (wait) {
    element.onload = () => element.classList.add(lazyloadOptions.lazyloadClass);
  }

  element.removeAttribute('data-lazy');
};

const loadElements = () => {
  elements = Array.from(document.querySelectorAll('video[data-lazy], iframe[data-lazy], script[data-lazy]'));
  images = Array.from(document.querySelectorAll('img[data-lazy]'));

  if (lazyloadOptions.nativeLazyloadEnabled) {
    images.forEach(image => {
      image.loading = 'lazy';
      setSource(image);
    });
  } else {
    elements = elements.concat(images);
  }
};

const onIntersect = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const { target } = entry;

      setSource(target);

      observer.unobserve(target);
    }
  });
};

const destroyObserver = () => {
  if (lazyObserver) {
    lazyObserver.disconnect();
    lazyObserver = null;
  }
};

const initObserver = () => {
  loadElements();

  if ('IntersectionObserver' in window) {
    destroyObserver();

    lazyObserver = new IntersectionObserver(onIntersect, lazyloadOptions.getOptions());

    if (elements) {
      elements.forEach(element => lazyObserver.observe(element));
    }
  }
};

const onResize = () => {
  lazyloadOptions.rootMargin = `0px 0px ${window.innerHeight / 2}px 0px`;

  initObserver();
};

const loadAllNow = () => {
  if (resizeListener) {
    removeEventListener(resizeListener);
  }

  if (lazyloadOptions.nativeLazyloadEnabled) {
    images.forEach(image => {
      image.removeAttribute('loading');
      setSource(image);
    });
  }

  elements.forEach(element => setSource(element));
};

initObserver();

if (lazyObserver) {
  resizeListener = window.addEventListener('resize', onResize);
}

export { lazyloadOptions, loadAllNow };
