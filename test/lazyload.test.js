/* eslint-disable compat/compat */
import { lazyloadOptions, loadAllNow, init } from '..';

let unobserve;
let disconnect;
let observe;
let onIntersect;
let windowIntersectionObserver;
let observedElements = 0;

const events = {};

window.addEventListener = jest.fn((event, cb) => {
  events[event] = cb;
});

const setup = () => {
  windowIntersectionObserver = window.IntersectionObserver;

  unobserve = jest.fn();
  disconnect = jest.fn();
  observe = jest.fn();

  window.IntersectionObserver = jest.fn(function(cb) {
    this.observe = observe;
    this.disconnect = disconnect;
    this.unobserve = unobserve;
    onIntersect = cb;
  });

  document.body.innerHTML = `
    <div style="height: 1500px;"></div>
    <img src="" srcset="" data-lazy data-srcset="https://picsum.photos/seed/picsum/200/300" alt="">
    <img src="" data-lazy data-src="https://picsum.photos/seed/picsum/200/300" alt="">
    <img src="" data-lazy data-wait data-src="https://picsum.photos/seed/picsum/200/300" alt="">
    <img src="" srcset="" data-lazy data-wait data-srcset="https://picsum.photos/seed/picsum/200/300" alt="">
    <iframe src="" data-lazy data-src="https://firstandthird.com/" title="First+Third Website"></iframe>
    <video src="" data-lazy data-src="https://www.w3schools.com/html/movie.mp4" controls></video>
    <audio src="" data-lazy data-src="https://www.w3schools.com/html/horse.mp3"></audio>
  `;

  // Important since init is called automatically before the mock takes place
  observedElements = init();
};

beforeAll(() => {
  setup();
});

afterAll(() => {
  window.IntersectionObserver = windowIntersectionObserver;
});

describe('setup', () => {
  test('gets default options', () => {
    expect(lazyloadOptions.getObserverOptions()).toHaveProperty('root', 'treshold', 'rootMargin');
  });

  test('non-visible sources are not loaded', () => {
    const elements = [...document.querySelectorAll('[data-lazy]')];
    const emptySources = elements.every(element => element.getAttribute('src') === '' || element.getAttribute('scrset') === '');
    expect(emptySources).toBe(true);
  });

  test('intersection observer is setup', () => {
    expect(observe).toHaveBeenCalled();
  });

  test('init returns observed elements', () => {
    const elements = [...document.querySelectorAll('[data-lazy]')];
    expect(observedElements.length).toBe(elements.length);
  });
});

describe('sources are lazy-loaded', () => {
  beforeAll(() => {
    loadAllNow();
  });

  test('images', () => {
    const imageSrc = document.querySelector('img[data-src]');
    const imageSrcset = document.querySelector('img[data-srcset]');

    expect(imageSrc.src).toBe('https://picsum.photos/seed/picsum/200/300');
    expect(imageSrcset.srcset).toBe('https://picsum.photos/seed/picsum/200/300');
  });

  test('videos', () => {
    const video = document.querySelector('video');
    expect(video.src).toBe('https://www.w3schools.com/html/movie.mp4');
  });

  test('iframes', () => {
    const iframe = document.querySelector('iframe');
    expect(iframe.src).toBe('https://firstandthird.com/');
  });

  test('audios', () => {
    const audio = document.querySelector('audio');
    expect(audio.src).toBe('https://www.w3schools.com/html/horse.mp3');
  });
});

describe('intersection observer works', () => {
  beforeEach(() => {
    setup();
  });

  test('image loads on intersect', () => {
    const image = document.querySelector('img[data-src]');

    expect(image.src).toBe('http://localhost/');

    onIntersect([{ target: image, isIntersecting: true }], { unobserve });

    expect(unobserve).toHaveBeenCalled();
    expect(image.src).toBe('https://picsum.photos/seed/picsum/200/300');
  });

  test('observer is disconnected when all elements are loaded', () => {
    const elements = [...document.querySelectorAll('[data-lazy]')];

    elements.forEach(element => {
      onIntersect([{ target: element, isIntersecting: true }], { unobserve });
    });

    expect(disconnect).toHaveBeenCalled();
  });
});

describe('resize', () => {
  beforeAll(() => {
    window.innerHeight = 200;
    events.resize();
  });

  test('observer is destroyed', () => {
    expect(disconnect).toHaveBeenCalled();
  });

  test('observer options are updated', () => {
    expect(lazyloadOptions.getObserverOptions().rootMargin).toBe('0px 0px 100px 0px');
  });
});
