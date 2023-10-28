---
toc: true
title: "useAbortController Hook"
category: ["Programming"]
tags: [web, react, javascript, typescript]
author:
  - 이현재
---

If you are developing a React project and trying to make a fetch request,
you are often said to call your request API inside `useEffect`.
This is beacuse fetching data is most likely to be closely linked
to lifecycles of your React components.

>**Fetching data with Effects**<br>
>You can use an Effect to fetch data for your component.
>...
>Writing data fetching directly in Effects gets repetitive and makes it difficult to add optimizations like caching and server rendering later. It’s easier to use a custom Hook—either your own or maintained by the community.<br>
>https://react.dev/reference/react/useEffect#fetching-data-with-effects

Also, you may add a boolean value or `AbortController`
to cancel requests you had figured out to be not needed anymore.
This also prevents unwanted data race conditions.

>Note the `ignore` variable which is initialized to `false`, and is set to `true` during cleanup. This ensures your code doesn’t suffer from “race conditions”: network responses may arrive in a different order than you sent them.<br>
>https://react.dev/reference/react/useEffect#fetching-data-with-effects

Although using boolean value is good enough,
An abortController is a better option
since it is able to cancel ongoing fetch requests.

>The abort() method of the AbortController interface aborts a DOM request before it has completed. This is able to abort fetch requests, the consumption of any response bodies, or streams.<br>
>https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort

In this post, we are going to learn about how to use `AbortController` and extract
common logics and codes into a reusable custom hook in various ways.

# useEffect with AbortController
The following codes are examples of
an `useEffect` that calls a fetch request with `AbortController`.

```js
useEffect(() => {
  const controller = new AbortController();
  const search = async () => {
    const result = await axios.get('/search', {
      params: {keyword},
      signal: controller.signal
    });
    setSearchResult(result);
  };
  search();

  return () => {
    controller.abort();
  };
}, [keyword]);
```

In this post, we are going to use `axios` for fetching data.
`axios` needs you to hand over `AbortController.signal` as `signal` key of the second parameter object.
Refer to [`axios` document](https://axios-http.com/docs/cancellation) for more.

Everytime `keyword` changes, the cleanup function will abort the ongoing fetch request
and throw an error. Due to the error, `setSearchResult(result)` will not execute.
It is also recommended to wrap the fetch requests to handle `AbortError` or other unexpected errors.

>When abort() is called, the fetch() promise rejects with a `DOMException` named `AbortError`.<br>
>https://developer.mozilla.org/en-US/docs/Web/API/AbortController

```js
useEffect(() => {
  const controller = new AbortController();
  const search = async () => {
    try {
      const result = await axios.get('/search', {
        params: {keyword},
        signal: controller.signal
      });
      setSearchResult(result);
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        // Handle AbortError
      } else {
        // Handle other errors
      }
    }
  };
  search();

  return () => {
    controller.abort();
  };
}, [keyword]);
```

# Custom Hook with AbortController
If you want to reuse the code and make it as a custom hook, maybe you can do this:
```js
const useAbortController = ((url, params, onFetchComplete, onError) => {
  useEffect(() => {
    const controller = new AbortController();
    const search = async () => {
      try {
        const result = await axios.get(url, {
          params,
          signal: controller.signal
        });
        onFetchComplete(result);
      } catch (e) {
        onError(e);
      }
    };
    search();

    return () => {
      controller.abort();
    };
  });
}, [url, params, onFetchComplete, onError]);
```

And call the hook like this:
```js
useAbortController('/search', params, setSearchResult, onError)
```

Be aware if you cannot gurantee the stabilities of each argument,
the `useEffect` will rerun everytime the component rerenders,
resulting in unnecessary repeated request calls or infinite rerenders in the worst case.

But this custom hook has some flaws.
- You cannot call the `search` function on your demand<br>
  you might need to call the function on other circumstances,
  such as on button clicked.
  However Since the hook does not expose the request function, you just can't.
- You cannot cancel the `search` function.<br>
  Same reason as above.

# Advanced Custom Hook with AbortController
## Return Callback and Abort Function
The custom hook shouldn't call fetch request inside itself;
it should wrap the fetch request with an `AbortController`
and return it back to the caller, together with an abort function.

```jsx
const [search, abortSearch] = useAbortController(
  url,
  params,
  setSearchResult,
  onError,
);

// Use it like this:
<button onClick={search}>Search</button>
<button onClick={abortSearch}>Abort Search</button>
```

The custom hook should create two functions with `useCallback`.
Also, `AbortController` instances should be shared between the two functions
with a help from `useState`.

```js
const useAbortController = ((url, params, onFetchComplete, onError) => {
  const [controller, setController] = useState(new AbortController());

  const request = useCallback(async () => {
    try {
      const result = await axios.get(url, {
        params,
        signal: controller.signal
      });
      onFetchComplete(result);
    } catch (e) {
      onError(e);
    }
  }, [controller, url, params, onFetchComplete, onError]);

  const abortRequest = useCallback(() => {
    controller.abort();
    // Create a new AbortController since you cannot reuse an AbortController.
    setController(new AbortController());
  }, [controller]);

  return [callback, abort];
});
```

However, there is a flaw in the hook;
the `AbortController` is managed as a **state**.
You cannot reuse the same controller after `AbortController.abort()` call.
You need to create new one after calling `AbortController.abort()`.
It means the two functions should depend on `controller` state.
This presents us a problem; unnecessary rerenders.
1. Call `abortRequest()` callback.
1. `controller` state renews.
1. `request` and `abortRequest` callbacks renews.
1. Components which call the hook rerender, also do their children.

Futhermore, we may have a problem if we call the callback inside `useEffect`.
The effect should depend on `request`.
When we abort the callback, the effect reruns whether we like it or not.
Also, calling callback and return abort function inside `useEffect`
results in an infinite rerenders.
Since these behaviors are due to the internal logics of this hook,
it should be avoided or it will confuse those who use the hook.

```jsx
const [search, abortSearch] = useAbortController(
  url,
  params,
  setSearchResult,
  onError,
);

useEffect(() => {
  search();

  return () => {
    abortSearch();
  }
}, [search, abortSearch]);

// All I want to do is cancel searching,
// but search API is called when the button is pressed?
<button onClick={abortSearch}>Cancel search</button>
```

## Manage AbortController with useRef
Instead of managing `AbortController` with `useState`
and suffer from rerenders, we got a better option: `useRef`.

```js
const useAbortController = ((url, params, onFetchComplete, onError) => {
  const controllerRef = useRef(new AbortController());

  const request = useCallback(async () => {
    try {
      const signal = controllerRef.current.signal;
      const result = await fetch(url, {
        params,
        signal
      });
      onFetchComplete?.(result);
    } catch (e) {
      onError?.(e);
    }
  }, [url, params, onFetchComplete, onError]);

  const abortRequest = useCallback(() => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  }, []);

  return [callback, abort];
});
```

Now the hook does not incur any rerender or make you suffer from rerender.
However **note** that the `signal` variable is created and used
inside `request` callback.
`abort` function changes `controllerRef.current`,
which means `controllerRef.current` referred by `fetch`
might not be the `AbortController` instance you want.
It could be a new `AbortController`,
then `fetch` may run even though you called `abortRequest`.
Thus, we need to store `controllerRef.current` some place else
before we make a `fetch` call.

# Pass Callback as Parameter when you Call
