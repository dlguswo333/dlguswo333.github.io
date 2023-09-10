---
layout: post
toc: false
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
before even `onClick` function finishes (= the promise returned by `updateState` resolves),
React updates states (= rerender by `setState(newValue)`).

I have no idea what is the root cause for this phenomenon,
but it has something to do that `updateState` function is `async` function but
the statements it executes when cache hits occur are actually `sync`.

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

---

These examples may seem too unnatural compared to codes on the real world.
But believe me, I encountered this problem while developing for real use cases.
If **we have some codes that need to run before rerendering**,
then we have a problem.

These kinds of caveats hit us so hard wasting our times.
But don't get me wrong. I do think this is not a React's problem.
The issue I have been describing is not an easy one to solve.
We have no way to tell when API calls will return the values.
In the meantime, React must decide when to rerender, without ruining user experiences on web pages.

The conclusion is **do not assume asynchronous callbacks will finish before rerendering**.
Keep in mind that React may rerender earlier for its own sakes.
