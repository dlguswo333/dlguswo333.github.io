---
toc: false
title: "Return Await for your Stack Trace"
category: ["Programming"]
tags: [javascript]
author:
  - 이현재
---

`async`/`await` on top of `Promise` is a major feature in JavaScript. It allows you to write asynchronous codes as if they were synchronous. It's hard to imagine writing codes without them, and it surprises me that it has not been 10 years yet since Chrome 55 supported async functions. In 2025, almost every modern browsers support it thankfully.

I have been growing using async functions, but it still make me wonder to see codes like the below:
```js
const func = async () => {
  // ...
  return await axios.get(/** ... */);
}
```

The question is: Do we actually need to `await` a `Promise` that is going to be returned? Because, even if we `await` and `return` it, the returned value from the async function is still a `Promise`; the caller needs to `await` it anyway. It looks duplicated and unnecessary since the caller will `await` again. There is no difference between the two from my perspective. So I have been gone for the shorter one.

But actually there is a difference. That is not about how it works; they are the same in that perspective, the difference lies within developer experience, **the stack trace**. If we omit `await` when returning a `Promise` and the `Promise` throws, then the function which returns it does not show up in the stack trace.

Let's see an example. The two async function read a non-existent directory.
```js
import {readdir} from 'fs/promises';

const path = 'notexist';
const readAwait = async () => {
  return await readdir(path);
}
const readWithoutAwait = () => {
  return readdir(path);
}

const main = async () => {
  try {
    await readAwait();
  } catch (e) {
    console.error(e);
  }
  try {
    await readWithoutAwait();
  } catch (e) {
    console.error(e);
  }
}
main();
```

The result is the following. The first stack trace shows `readAwait` which does `return await`. But the second do not show `readWithoutAwait` from the stack, as if `main` function directly calls `readdir` function.
```js
Error: ENOENT: no such file or directory, scandir 'notexist'
    at async readdir (node:internal/fs/promises:955:18)
    at async readAwait (file:///home/lhj/test/await.js:5:10)
    at async main (file:///home/lhj/test/await.js:13:5) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'scandir',
  path: 'notexist'
}
Error: ENOENT: no such file or directory, scandir 'notexist'
    at async readdir (node:internal/fs/promises:955:18)
    at async main (file:///home/lhj/test/await.js:18:5) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'scandir',
  path: 'notexist'
}
```
 \
But I would not say the second stack trace is entirely wrong. It shows as it was commanded. `readWithoutAwait` did call `readdir` but did not wait for the resolve and return the `Promise` right away, and it's the `main` function which waits for it. Nontheless, it's not good for debugging experience. 

Let's see another example. This time there are two middle functions and one of them does `return await` and the other `return` it right away.
```js
import {readdir} from 'fs/promises';

const path = 'notexist';
const readAwait = async () => {
  return await readdir(path);
}

const middleWithoutAwait = () => {
  return readAwait();
}
const middleAwait = async () => {
  return await readAwait();
}

const main = async () => {
  try {
    await middleAwait();
  } catch (e) {
    console.error(e);
  }
  try {
    await middleWithoutAwait();
  } catch (e) {
    console.error(e);
  }
}
main();
``` 
 \
Guess the result.  `middleAwait` does `return await` so it will be visible from the stack trace. On the other hand `middleWithoutAwait` function is not seen from the trace.
```js
Error: ENOENT: no such file or directory, scandir 'notexist'
    at async readdir (node:internal/fs/promises:955:18)
    at async readAwait (file:///home/lhj/test/await2.js:5:10)
    at async middleAwait (file:///home/lhj/test/await2.js:12:10)
    at async main (file:///home/lhj/test/await2.js:17:5) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'scandir',
  path: 'notexist'
}
Error: ENOENT: no such file or directory, scandir 'notexist'
    at async readdir (node:internal/fs/promises:955:18)
    at async readAwait (file:///home/lhj/test/await2.js:5:10)
    at async main (file:///home/lhj/test/await2.js:22:5) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'scandir',
  path: 'notexist'
}
```
 \
So, if you want to have more *desirable* stack traces, you should do `return await`. MDN also recommends it and says that the two are as fast as the other.
>Contrary to some popular belief, `return await promise` is at least as fast as `return promise`, due to how the spec and engines optimize the resolution of native promises.\
>...\
>except for stylistic reasons, `return await` is almost always preferable.\
>[await - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#improving_stack_trace)

 \
Even if I ran the test codes on Node.js but it also applies to other JavaScript engines like Chrome.\
You can find more about `return await` and `Promise` from the links below. I was inspired to write this post from those links.

- [nodebestpractices/sections/errorhandling/returningpromises.md at master · goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/returningpromises.md)
- [Faster async functions and promises · V8](https://v8.dev/blog/fast-async#improved-developer-experience)

