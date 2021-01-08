const lazyloadOptions = {
  rootElement: null,
  rootMargin: '0px',
  treshold: 1,
  lazyloadClass: 'loaded',

  getOptions() {
    return {
      root: this.rootElement,
      rootMargin: this.rootMargin,
      threshold: this.treshold
    };
  }
};

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

if ('loading' in HTMLImageElement.prototype) {
  images.forEach(image => {
    image.loading = 'lazy';
    setSource(image);
  });
} else {
  elements = elements.concat(images);
}

if ('IntersectionObserver' in window) {
  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;

        setSource(element);

        observer.unobserve(element);
      }
    });
  }, lazyloadOptions.getOptions());

  elements.forEach(element => lazyObserver.observe(element));
}

export { lazyloadOptions };
