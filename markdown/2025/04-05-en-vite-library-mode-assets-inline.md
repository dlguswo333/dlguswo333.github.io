---
toc: false
title: "Vite: Library Mode and Assets Inline"
category: "Programming"
tags: [javascript, web, vite]
author:
  - 이현재
---

vite is used mostly for bundling *end applications*,
but it can be also used for building a library, like a UI component library.
What makes library mode special is that you can specify the entrypoint file
while in normal mode your entrypoint is forced to be a HTML file.
There is a documentation on official vite webpage and it's pretty straight forward.<br>
<https://vite.dev/guide/build#library-mode>

<br>

But you need to be careful when you work in library mode with vite.
As of April 2025, vite v6.2.5, limiting inlining assets does not work correctly.
Here is the related Github issue link: <https://github.com/vitejs/vite/issues/3295>

If you inline assets, separate asset files may become embedded right where they were referenced.
The easiest example would be an image file referenced in a css file.
```css
.bg {
    background: url('./cat.jpg');
}
```

If you tell vite to inline the image file,
vite will replace `url('./cat.jpg')` with something like base64.
```css
.bg{background:url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBA...)}
```

In that way, the number of asset files are decreased,
and it may also benefit from the reduced number of network requests.

However, inlining assets is a double-edged sword
since it might actually increase the total size of build outputs.

Getting back to the image asset, base64 is worse than binary when it comes to the size
since you need **4/3 times as many bytes as the original**.

Why? Since single base64 can represent 64 while single byte can represent 256,
so when you try to convert binary of $n$ bytes into base64,
you need to represent as many data as $n$ bytes can; that is $2^{8n}$.
Say $x$ base64 characters can do that, which may represent $2^{6x}$.
Thus:<br>
$$
2^{6x} >= 2^{8n}
$$
$$
x >= \frac{4}{3}n
$$

Therefore, when it comes to file size,
base64 can be said to be inherently inefficient compared to binary format.

<br>

Moreover, inlining assets means you can't do *'declare once, use everywhere'*.
It may be different per asset type,
but when it comes to image assets in a css file, vite duplicates them.
Let's see how vite works by doing some experiment.

The focuses are vite config and the css file.
vite config specifies library mode and it prohibits from inlining assets
by `assetsInlineLimit: 0`.
And the css file has many `url('./cat.jpg')`s and the cat file is only 64KB.
```js {11-15}
// vite.config.js
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: undefined,
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    minify: true,
    assetsInlineLimit: 0,
    lib: {
      formats: ['es'],
      entry: './src/App.tsx',
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [react()],
});
```

```jsx
// src/App.tsx
import './style.css';

const App = () => {

  return <>
    <div className='bg1'>
      App
    </div>
  </>;
};

export default App;
```

```css
/** src/style.css */
.bg1 {
    background: url('./cat.jpg');
}

.bg2 {
    background: url('./cat.jpg');
}

.bg3 {
    background: url('./cat.jpg');
}

/** It continues... */
```

<br>

If we build it, what does happen? Let's see the build result.
```text
> vite build

vite v6.2.5 building for production...
✓ 17 modules transformed.
dist/react-playground.css  2,163.64 kB │ gzip: 1,627.22 kB
dist/react-playground.js      76.75 kB │ gzip:    19.14 kB │ map: 206.87 kB
```

<br>

vite built it successfully but the css output file is **2MB**!
It bloats! With repeated same base64 cat images!
```css
.bg1{background:url(data:image/jpeg;base64,/9j/4...)}
.bg2{background:url(data:image/jpeg;base64,/9j/4...)}
.bg3{background:url(data:image/jpeg;base64,/9j/4...)}
/** It continues... */
```

<br>

It is not a good idea to bloat your library with the same repeated base64 data...
Thus, be careful when you build a library with vite and check your output size.

The possible solutions are to build only the css files in normal mode
and make other files to refer to the output,
or you can build your library in another bundler (e.g. webpack) until vite solves the issue.
