---
layout: post
toc: false
editedDate: 2024-11-02
title: "React may Rerender before Async Callback Resolves"
category: ["Programming"]
tags: [web, react, javascript]
author:
  - 이현재
---

In React, rerendering may run before async callbacks finish or resolve.

Think of a simple component which calls API and update its own state.
Upon the button click, the following function calls run in order: `onClick` => `updateState` => `api`.

```jsx
const Component = () => {
  const [state, setState] = useState(0);

  const api = async (currentValue) => {
    await new Promise(res => setTimeout(res)); // To mimic remote API call
    return currentValue + 1;
  }

  const updateState = async () => {
    const newValue = await api(state);
    setState(newValue);
  };

  const onClick = async () => {
    console.log('log-0');
    await updateState();
    console.log('log-1');
  };

  useEffect(() => {
    console.log('rerender');
  });

  return <>
    <div>Component {state}</div>
    <button onClick={onClick}>Click</button>
  </>;
};
```

![basic-component](/img/2023-09-10-react-may-rerender-before-async-callback-resolves/basic-component.gif)


Console prints out `log-0` => `log-1` => `rerender` in order.
I believe this is expected behavior for most of React developers.

---

Then what if we have a local cache so that we dont need to call API?

```jsx
const getCache = () => {
  const entries = {
    0: 1,
    1: 2,
    2: 3,
  };
  return (currentValue) => {
    return entries[currentValue];
  };
};

const cache = getCache();
```

Let's integrate the cache into the component.

```jsx
const CacheComp = () => {
  const [state, setState] = useState(0);

  const api = async (currentValue) => {
    await new Promise(res => setTimeout(res));
    return currentValue + 1;
  };

  const updateState = async () => {
    const cachedValue = cache(state);
    if (cachedValue) {
      setState(cachedValue);
      return;
    }
    const newValue = await api(state);
    setState(newValue);
  };

  const onClick = async () => {
    console.log('log-0');
    await updateState();
    console.log('log-1');
  };

  useEffect(() => {
    console.log('rerender');
  });

  return <>
    <div>Component with cache {state}</div>
    <button onClick={onClick}>Click</button>
  </>;
};

export default CacheComp;

```

![component-with-cache](/img/2023-09-10-react-may-rerender-before-async-callback-resolves/component-with-cache.gif)

It outputs `log-0` => `rerender` => `log-1`.

Is this expected behavior? I think not.
Before even `onClick` function finishes (= the promise returned by `updateState` resolves),
React updates states (= rerender by `setState(cachedValue)`).

I have no idea what is the root cause for this phenomenon,
but it has something to do that `updateState` function is `async` function but
the statements it executes when cache hits occur are actually *synchronous*.

```jsx
  // If cache hits...
  const updateState = async () => {
    const cachedValue = cache(state);
    setState(cachedValue);
    return;
  };
```

After `setState` runs, `onClick` waits for `updateState()` to resolve.
In the meantime, React decided to rerender for some reasons.

---

Think of another example where multiple states are defined and get updated.
Both have cache integrated.

```jsx
const MultiCacheComp = () => {
  const [state1, setState1] = useState(0);
  const [state2, setState2] = useState(0);

  const api = async (currentValue) => {
    await new Promise(res => setTimeout(res));
    return currentValue + 1;
  };

  const updateState = async () => {
    const cachedValue1 = cache(state1);
    if (cachedValue1) {
      setState1(cachedValue1);
    } else {
      const newValue1 = await api(state1);
      setState1(newValue1);
    }

    const cachedValue2 = cache(state2);
    if (cachedValue2) {
      setState2(cachedValue2);
    } else {
      const newValue2 = await api(state2);
      setState2(newValue2);
    }
  };

  const onClick = async () => {
    console.log('log-0');
    await updateState();
    console.log('log-1');
  };

  useEffect(() => {
    console.log('rerender');
  });

  return <>
    <div>Component with cache {state1} {state2}</div>
    <button onClick={onClick}>Click</button>
  </>;
};
```

![component-with-multi-states](/img/2023-09-10-react-may-rerender-before-async-callback-resolves/component-with-multi-states.gif)

It outputs `log-0` => `rerender` => `log-1`.
But if cache misses occur, it outputs `log-0` => `rerender` => `log-1` => `rerender`.

What does it mean? Well, I don't know.
But it looks obvious that synchronous states are clustered together, inducing one rerender.<br>
But if cache misses occur, one click makes React rerender twice.
From that, if you have an `useEffect` dependent on the two states, it will run twice.
This might be problematic if you have another api call in `useEffect`; the api will run twice!

It might be best not to assume React would work the way we want.
This might be the best option since React is an UI library; it needs to show what's happening instantly.
If you want these two `setStates` are clustered into one rerender, call them together.

```tsx
  const updateState = async () => {
    let value1 = cache(state1);
    if (!value1) {
      value1 = await api(state1);
    }

    let value2 = cache(state2);
    if (!value2) {
      value2 = await api(state2);
    }
    setState1(value1);
    setState2(value2);
  };
```
<br>

---

These examples may seem too unnatural compared to codes on the real world.
But believe me, I encountered this problem while developing for real use cases.
If **you have some codes that need to run before rerendering**,
then you might encounter this problem.

These kinds of caveats hit us so hard wasting our times.
But don't get me wrong. I do think this is not a React's problem.
The issue I have been describing is not an easy one to solve.
We have no way to tell when API calls will return the values.
In the meantime, React must decide when to rerender, without ruining user experiences on web pages.

The conclusion is **do not assume asynchronous callbacks will finish before rerendering**.
Keep in mind that React may rerender earlier for its own sakes.
