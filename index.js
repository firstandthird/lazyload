const lazyloadOptions = {
  forceNativeLazyload: false,
  nativeLazyloadEnabled: true,

  getObserverOptions: () => ({
    root: null,
    rootMargin: `0px 0px ${window.innerHeight / 2}px 0px`,
    threshold: 1
  })
};

let observer = null;
const getElements = (selector = '[data-lazy]') => Array.from(document.querySelectorAll(selector));

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

const onIntersect = (entries, entryObserver) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const { src, srcset, wait } = entry.dataset;

      if (wait && entry.tagName === 'IMG') {
        const image = new Image();
        entry.onload = () => setSource(entry);

        if (src) {
          image.src = src;
        }

        if (srcset) {
          image.srcset = srcset;
        }
      } else {
        if (wait && entry.tagName === 'IFRAME') {
          entry.onload = () => setSource(entry);
        }

        setSource(entry);
      }

      entryObserver.unobserve(entry);
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

  if (observableElements.length && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(onIntersect, lazyloadOptions.getObserverOptions());

    observableElements.forEach(element => observer.observe(element));

    // eslint-disable-next-line no-use-before-define
    window.addEventListener('resize', onResize);
  }
};

const onResize = () => {
  if (observer) {
    observer.disconnect();
  }

  init();
};

const loadAllNow = () => {
  const elements = getElements();

  window.removeEventListener('resize', onResize);

  elements.forEach(element => {
    element.removeAttribute('loading');
    setSource(element);
  });
};

init();

export { lazyloadOptions, loadAllNow, init };
