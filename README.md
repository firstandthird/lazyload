<h1 align="center">Lazyload</h1>

<p align="center">
  <a href="https://github.com/firstandthird/lazyload/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/lazyload/Test/main?label=Tests&style=for-the-badge" alt="Test Status"/>
  </a>
  <a href="https://github.com/firstandthird/lazyload/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/lazyload/Lint/main?label=Lint&style=for-the-badge" alt="Lint Status"/>
  </a>
  <img src="https://img.shields.io/npm/v/lazyload.svg?label=npm&style=for-the-badge" alt="NPM" />
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
import { lazyloadOptions, loadAllNow } from '@firstandthird/lazyload';

// Override options
lazyloadOptions.treshold = 0.2;

// Load all sources (ignores lazy loading)
loadAllNow();
```

---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First+Third](https://firstandthird.com) Project_
