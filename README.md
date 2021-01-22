<h1 align="center">Lazyload</h1>

<p align="center">
  <a href="https://github.com/firstandthird/lazyload/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/lazyload/Test/main?label=Tests&style=for-the-badge" alt="Test Status"/>
  </a>
  <a href="https://github.com/firstandthird/lazyload/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/lazyload/Lint/main?label=Lint&style=for-the-badge" alt="Lint Status"/>
  </a>
  <img src="https://img.shields.io/npm/v/@firstandthird/lazyload?style=for-the-badge" alt="NPM" />
</p>

Lazyload library

## Installation

```sh
npm install @firstandthird/lazyload
```

_or_

```sh
yarn add @firstandthird/lazyload
```

## Example

```html
<img src="" data-lazy data-src="https://picsum.photos/seed/picsum/200/300" alt="">
```

```js
import { lazyloadOptions, loadAllNow, init } from '@firstandthird/lazyload';

// Override options
lazyloadOptions.nativeLazyloadEnabled = false; // disables native loading="lazy"
lazyloadOptions.getOptions = () => ({
  root: null,
  rootMargin: `0px 0px 100px 0px`,
  threshold: [0.2, 0.3, 1]
});

// Load all sources (ignores lazy loading)
loadAllNow();
```

See [more examples](./example/index.html).

---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First+Third](https://firstandthird.com) Project_
