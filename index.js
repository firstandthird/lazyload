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
let elements = Array.from(document.querySelectorAll('video[data-lazy], iframe[data-lazy], script[data-lazy]'));
const images = Array.from(document.querySelectorAll('img[data-lazy]'));

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

const initObserver = () => {
  if ('IntersectionObserver' in window) {
    lazyObserver = new IntersectionObserver(onIntersect, lazyloadOptions.getOptions());

    if (elements) {
      elements.forEach(element => lazyObserver.observe(element));
    }
  }
};

const onResize = () => {
  if (lazyObserver) {
    lazyObserver.disconnect();
  }

  lazyloadOptions.rootMargin = `0px 0px ${window.innerHeight / 2}px 0px`;

  lazyObserver = initObserver();
};

if (lazyloadOptions.nativeLazyloadEnabled) {
  images.forEach(image => {
    image.loading = 'lazy';
    setSource(image);
  });
} else {
  elements = elements.concat(images);
}

initObserver();

if (lazyObserver) {
  resizeListener = window.addEventListener('resize', onResize);
}

const loadAllNow = () => {
  if (lazyObserver) {
    lazyObserver.disconnect();
  }

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

export { lazyloadOptions, loadAllNow };
