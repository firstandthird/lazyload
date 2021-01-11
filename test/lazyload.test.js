import { lazyloadOptions, loadAllNow } from '..';

lazyloadOptions.nativeLazyloadEnabled = false;

const setup = () => {
  document.body.innerHTML = `
    <div style="height: 1500px;"></div>
    <img src="" srcset="" data-lazy data-srcset="https://picsum.photos/seed/picsum/200/300" alt="">
    <img src="" data-lazy data-src="https://picsum.photos/seed/picsum/200/300" alt="">
    <iframe src="" data-lazy data-src="https://firstandthird.com/" title="First+Third Website"></iframe>
    <video src="" data-lazy data-src="https://www.w3schools.com/html/movie.mp4" controls></video>
    <audio src="" data-lazy data-src="https://www.w3schools.com/html/horse.mp3"></audio>
  `;

  loadAllNow();
};

beforeAll(() => setup());

describe('setup', () => {
  test('gets default options', () => {
    expect(lazyloadOptions.getOptions()).toHaveProperty('root', 'treshold', 'rootMargin');
  });

  test('non-visible sources are not loaded', () => {
    const elements = [...document.querySelectorAll('[data-lazy]')];
    const emptySources = elements.every(element => element.getAttribute('src') === '' || element.getAttribute('scrset') === '');
    expect(emptySources).toBe(true);
  });
});

describe('sources are lazy-loaded when visible', () => {
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

describe('native lazy loading property is set', () => {
  beforeAll(() => {
    lazyloadOptions.nativeLazyloadEnabled = true;
    setup();
  });

  test('image native lazy-load', () => {
    const imageSrc = document.querySelector('img[data-src]');
    expect(imageSrc.loading).toBe('lazy');
  });
});
