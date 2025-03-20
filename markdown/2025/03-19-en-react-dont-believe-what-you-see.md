---
layout: post
toc: true
math: false
title: "React: Don't Believe What You See (By its Surface)"
category: ["Programming"]
tags: [web, react, javascript]
author:
  - 이현재
---

# React, States, Renders.
We all know that React components will rerender upon its state changes,
and `useEffect` or `useLayoutEffect` will run everytime they rerender.
Thus as long as we specify proper dependencies for them we will have the latest effects running.
Then even though we might have several rerenders,
we are sure that we will have the correct states and render results eventually.

# You Need to Go Deeper Sometimes
However, sometimes, you expect components to render 100% fully like the way you want it to be,
but maybe they do not because they need to setup and rerender several times.
Likewise, things can be complicated if the following conditions hold.
- Components need to rerender several times before rendering fully.
- Inner components have their own states and rerender which outer components do not know about.
- And you expect them to render 100% right away.

The last bullet is crucial. You can't be sure that you are good to go within a single render.
They might need several milliseconds to render fully.

If applications do not work as expected, you need to inspect your code first.
If you can't find possible bugs from your code, sometimes,
You need to go into libraries' codes and see if they will work as you want.
This is so sad, but sometimes you can't treat them as some kind of cognitive barriers,
or abtrations layers.
I'm not saying they have bugs and they are to be blamed
but it's feasible that **they are not implemented to work as you want**.

Check them as if they are kinds of your code.
Check if they rerender, have their internal states or rerender without you knowing it.

# Real Life Example
Let me give you an example in real life.
I was using a react library called [`react-shadow`](https://github.com/Wildhoney/ReactShadow)
which helps create a shadow dom in react.
I needed to grab elements inside the shadow dom and I wrote this.

```jsx
import root from 'react-shadow';

useEffect(() => {
  const shadowRoot = elementRef.current.shadowRoot;
  shadowRoot.querySelectorAll(MY_SELECTOR);
}, []);

return <>
  <root.div>
    <InnerComponents />
  </root.div>
</>;
```

But it did not return anything. Let's see the code inside the library briefly.

```jsx
/** Code credit to https://github.com/Wildhoney/ReactShadow */

// root is null initially.
const [root, setRoot] = useState(null);

// It sets root something meaninful here.
useLayoutEffect(() => {
  if (node.current) {
      const root = node.current.attachShadow({
        mode,
        delegatesFocus,
      });
      styleSheets.length > 0 &&
        (root.adoptedStyleSheets = styleSheets);
      setRoot(root);
    } catch (error) {
      utils.handleError({ error, styleSheets, root });
    }
  }
}, [ref, node, styleSheets]);

return (
  {/** If root is null the children will not be rendered. */}
  {root && (
    <utils.Context.Provider value={root}>
      <ShadowContent root={root}>
        {options.render({
          root,
          ssr,
          children,
        })}
      </ShadowContent>
    </utils.Context.Provider>
  )}
);
```

It's obvious from the code that the component needs to rerender to render its children.
And my code tries to get the elements before it rerenders.

But at first I did not understand why I can't get the children thinking:<br>
***"they have `useLayoutEffect` and I have `useEffect`,
why on earth my `useEffect` can't grab the children? `useEffect` runs after `useLayoutEffect`
and `useEffect` would run after the rerender anyway!"***

My logics aren't wrong, but in this context they are wrong.<br>
The statement `useEffect` runs after `useLayoutEffect` is so true.
But that does not apply when they come from *different render paths*.<br>
Moreover, you can't tell the component would rerender just because the inner component rerenders.
That violates the nature of React rendering mechanism.

# Prototype Example
For simplicity I have the following example code which mimics the `react-shadow` case.
The objective is to get the text content rendered by react components.

```jsx
import {useEffect, useLayoutEffect, useState} from 'react';

const Inner = () => {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }
  console.log('I am ready!');
  return <>
    <div>I am ready!</div>
  </>;
};

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const getTextContent = () => ref.current.textContent.trim();
    console.log('useEffect', `'${getTextContent()}'`);
  });

  return <div ref={ref}>
    <Inner />
  </div>;
};
```

Now, you render the component `App` for the first time.
`App` will render the inner component `Inner`, but
`Inner` will not render anything but only after running `useLayoutEffect`.

Now it's time for the effects to run.
obviously, the `useLayoutEffect` in `Inner` will run before the `useEffect` in `App`.
Since the state `ready` in `Inner` has been changed, `Inner` is going to rerender,
but not yet! we got more jobs to do in this render path.
We need to execute `useEffect` from `App`.

The effect tries to get the text content, but there is no text content,
`Inner` is not ready yet!
Thus the empty text will be logged into the console.

After all the effects and other chores, React will rerender `Inner` component as queued.
This time `Inner` is ready, rendering a `div` with the text *'I am ready!'*!<br>
But `App` hasn't rerendered this time. No state change, no context change, no effect run.
So, the parent component `App` fails to get the latest text content.

This is the console output after we render `App`.
```text
useLayoutEffect
useEffect ''
I am ready!
```

Nothing went wrong, `useLayoutEffect` ran before `useEffect`
and only components which need rerender rerendered.
But we failed to accomplish our job to get the text content.

Maybe it seems too obvious: how did I fall for this simple error?
Yes, that's right. I was against the basic principles of how React works.
But hey, what if the component is not ours, something like *a component from a library*?
You would not understand why your code does not work just by scratching the surface.

```jsx
import Inner from 'component-library'; // You don't know how it works. Should you?

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const getTextContent = () => ref.current.textContent.trim();
    console.log('useEffect', `'${getTextContent()}'`);
  });

  return <div ref={ref}>
    <Inner />
  </div>;
};
```

# Yes, You Need to Go Deeper Sometimes
Yes, you do need to go deeper sometimes.
There are some cases you can't solve the problem just by scratching the surface.
If you keep scratching the surface, you might confuse the basic principles
and end up blaming everything just like I did with React mechanisms.

Frankly, when I understood this issue, all those things including my past experience came together.
I think this isn't the first time I met this kind of issues.<br>
But somehow I had solved them taking workarounds without understanding the key point.
If I hadn't gone deeper this time I would have kept scratching the surface again and again.
Thanks to this time, if I meet this kind of problems again I think I would find a solution much quicker.

---

I think this is kind like [What I don't like in react](/post/2023/03-31-en-what-i-dont-like-in-react).
But you do need to go deeper into libraries in other tools or frameworks sometimes.
So I don't think React is behind all this.
More you get experienced and complicated things you make, more you are likely to meet tricky problems.
It's just with React you need to go deeper... a few times!
