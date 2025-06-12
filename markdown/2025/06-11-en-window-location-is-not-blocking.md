---
toc: false
title: "window.location is not Blocking"
category: ["Programming"]
tags: [javascript, web]
author:
  - 이현재
---

`window.location` tells about the current location of the document.
By referencing the value you can get the information about the document,
and you can also set the current document by setting `window.location`.

```js
console.log(window.location.href);
// https://dlguswo333.github.io/

window.location.pathname = '/posts/2';
// Redirect to the https://dlguswo333.github.io/posts/2
```

This is one of the most frequently used `window`'s property 
if your app needs redirections.

But there is one important property of `window.location`
which I always forget about.
**Setting `window.location` is not blocking**.
Not blocking, or synchronous.<br>
What does it mean? It means the code below will continue to execute.

```js
window.location.pathname = 'https://example.com';
alert('This will execute!');
```

<br>

Let's test it. Serve the html file on your localhost.
```html
<html>
    <head></head>
    <body><button id="btn">button</button></body>
    <script type="text/javascript">
        document.querySelector('#btn').addEventListener('click', () => {
            window.location.href = 'http://dlguswo333.github.io';
            alert('This will execute!');
        });
    </script>
</html>
```

And run the following playwright test. The version is 1.53.0 at this time.
```ts
import { expect, test } from '@playwright/test';

test('window.location is not blocking', async ({ page }) => {
  const {promise, resolve} = Promise.withResolvers();
  page.on('dialog', async dialog => {
    dialog.accept();
    resolve(dialog.message());
  });
  await page.goto('http://localhost:8080');
  const btn = page.locator('#btn');
  await expect(btn).toBeVisible();
  await btn.click();
  const timeout =  new Promise((_, rej) => {setTimeout(rej, 1000)});
  await Promise.race([promise, timeout]);
  await page.waitForURL('https://dlguswo333.github.io');
});
```

On Chromium, Firefox, and Webkit the tests ran successfully.
There is one thing Firefox acted different, Unlike other two browsers which got stopped at the alert dialog,
Firefox skipped the alert dialog just like it closed the alert dialog very quickly.
Nevertheless it did show the alert dialog otherwise the test would have failed.

The test tells that most of the popular modern web browsers nowadays including 
Chrome, Edge, and Safari show this non-blocking behavior as of now.
It means even if you try to get out of the current document the code will continue,
resulting in unexpected behavior.

<br>

Another story, there are cases where you call redirections to different urls based on conditions,
and you end up calling redirections multiple times unexpectedly.
In this case most of the time the last one will take over.

```js
if (shouldGoGoogle) {
  window.location.href = 'https://google.com';
}
// You assumed that setting href is blocking but it isn't.
window.location.href = 'https://youtube.com';
```

Sadly even if this non-blocking mechanism matters significantly,
I could not find any reliable Javascript documentation that explicitly mentions about it.
I am not sure about if this behavior is actually standard or not.
In the same context, it is not even clear whether the last call will always take over.
What happens if the first call finishes soon enough? Can we safely assume
that the last call always win?
We don't know. We just assume this is because
most of the time setting `window.location` will run faster than page redirects.

## Links
<https://stackoverflow.com/q/34030245/20140921>
