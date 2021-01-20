const lazyloadOptions = {
  forceIntersectionObserver: false,
  forceNativeLazyload: false,
  nativeLazyloadEnabled: true,

  getObserverOptions: () => ({
    root: null,
    rootMargin: `0px 0px ${window.innerHeight / 2}px 0px`,
    threshold: 1
  })
};

let observer = null;
let observerCount = 0;
const getElements = () => Array.prototype.slice.call(document.querySelectorAll('[data-lazy]'));

const setSource = element => {
  const { src, srcset } = element.dataset;

  if (src) {
    element.src = src;
  }

  if (srcset) {
    element.srcset = srcset;
  }

  element.removeAttribute('data-lazy');
};

const desrtoyObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};

const onIntersect = (entries, entryObserver) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const { src, srcset } = target.dataset;

      if (target.hasAttribute('data-wait') && target.tagName === 'IMG') {
        const image = new Image();
        image.onload = () => setSource(target);

        if (src) {
          image.src = src;
        }

        if (srcset) {
          image.srcset = srcset;
        }
      } else {
        setSource(target);
      }

      observerCount -= 1;

      entryObserver.unobserve(target);

      if (observerCount <= 0) {
        desrtoyObserver();
      }
    }
  });
};

const init = () => {
  const elements = getElements();
  const observableElements = [];

  elements.forEach(element => {
    // element supports native browser lazyloading
    if (lazyloadOptions.forceNativeLazyload || (lazyloadOptions.nativeLazyloadEnabled && 'loading' in element)) {
      element.loading = 'lazy';
      setSource(element);
    } else {
      observableElements.push(element);
    }
  });

  if (observableElements.length && (lazyloadOptions.forceIntersectionObserver || 'IntersectionObserver' in window)) {
    observer = new IntersectionObserver(onIntersect, lazyloadOptions.getObserverOptions());
    observerCount = observableElements.length;

    observableElements.forEach(element => observer.observe(element));

    // eslint-disable-next-line no-use-before-define
    window.addEventListener('resize', onResize);
  }

  return [].concat(elements, observableElements);
};

const onResize = () => {
  desrtoyObserver();

  init();
};

const loadAllNow = () => {
  const elements = getElements();

  window.removeEventListener('resize', onResize);

  desrtoyObserver();

  elements.forEach(element => {
    element.removeAttribute('loading');
    setSource(element);
  });
};

init();

export { lazyloadOptions, loadAllNow, init };
