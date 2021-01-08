import { lazyloadOptions } from '..';

lazyloadOptions.lazyloadClass = 'mycustomclass';

const setup = () => {
  const container = document.createElement('div');
  container.id = 'main';
  container.innerHTML = `
    <div style="height: 1500px;"></div>
    <img src="" srcset="" data-lazy data-srcset="https://picsum.photos/seed/picsum/200/300" alt="">
    <img src="" data-lazy data-wait data-src="https://picsum.photos/seed/picsum/200/300" alt="">
    <iframe src="" data-lazy data-src="https://firstandthird.com" title="First+Third Website"></iframe>
    <video src="" data-lazy data-src="https://www.w3schools.com/html/movie.mp4" controls></video>
    <audio src="" data-lazy data-src="https://www.w3schools.com/html/horse.mp3"></audio>
  `;

  document.body.appendChild(container);
};

beforeAll(() => setup());

describe('setup', () => {
  test('non-visible sources are not loaded', () => {
    const container = document.getElementById('main');
    const elements = [...document.querySelectorAll('[data-lazy]')];
    const emptySources = elements.every(element => element.getAttribute('src') === '' || element.getAttribute('scrset') === '');

    container.scrollTop = 1500;

    expect(emptySources).toBe(true);
  });
});

describe('sources are lazy-loaded when visible', () => {
  test('images', () => {
    const imageSrc = document.querySelector('img[data-src]');
    const imageSrcset = document.querySelector('img[data-srcset]');

    setTimeout(() => {
      expect(imageSrc.src).toBe('https://picsum.photos/seed/picsum/200/300');
      expect(imageSrc.classList.contains('mycustomclwass')).toBe(true);
      expect(imageSrcset.src).toBe('https://picsum.photos/seed/picsum/200/300');
    });
  });

  test('videos', () => {
    const video = document.querySelector('video');

    setTimeout(() => {
      expect(video.src).toBe('https://www.w3schools.com/html/movie.mp4');
    });
  });

  test('iframes', () => {
    const iframe = document.querySelector('iframe');

    setTimeout(() => {
      expect(iframe.src).toBe('https://firstandthird.com');
    });
  });

  test('audios', () => {
    const audio = document.querySelector('audio');

    setTimeout(() => {
      expect(audio.src).toBe('https://www.w3schools.com/html/horse.mp3');
    });
  });
});
describe('sources are lazy-loaded when visible', () => {
  test('images', () => {
    const imageSrc = document.querySelector('img[data-src]');
    const imageSrcset = document.querySelector('img[data-srcset]');

    setTimeout(() => {
      expect(imageSrc.src).toBe('https://picsum.photos/seed/picsum/200/300');
      expect(imageSrcset.src).toBe('https://picsum.photos/seed/picsum/200/300');
    });
  });

  test('videos', () => {
    const video = document.querySelector('video');

    setTimeout(() => {
      expect(video.src).toBe('https://www.w3schools.com/html/movie.mp4');
    });
  });

  test('iframes', () => {
    const iframe = document.querySelector('iframe');

    setTimeout(() => {
      expect(iframe.src).toBe('https://firstandthird.com');
    });
  });

  test('audios', () => {
    const audio = document.querySelector('audio');

    setTimeout(() => {
      expect(audio.src).toBe('https://www.w3schools.com/html/horse.mp3');
    });
  });
});
