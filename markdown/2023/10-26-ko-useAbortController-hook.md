---
toc: true
title: "useAbortController 훅"
category: "Programming"
tags: [web, react, javascript, typescript]
author:
  - 이현재
---

리액트 프로젝트를 진행하다 보면 fetch 리퀘스트를 보내야 할 때가 오죠.
그럴 때는 `useEffect` 내에서 API를 호출하라는 말을 하곤 합니다.
데이터를 가져오는 것은 리액트 컴포넌트의 수명 주기와 깊은 연관이 있기 때문입니다.

>**Fetching data with Effects**<br>
>You can use an Effect to fetch data for your component.
>...
>Writing data fetching directly in Effects gets repetitive and makes it difficult to add optimizations like caching and server rendering later. It’s easier to use a custom Hook—either your own or maintained by the community.<br>
>https://react.dev/reference/react/useEffect#fetching-data-with-effects

또한, 리퀘스트를 취소하기 위해 boolean 값 또는 `AbortController`를 사용할 수 있습니다.
이는 원치 않는 `race condition`도 예방해줄 수 있죠.

>Note the `ignore` variable which is initialized to `false`, and is set to `true` during cleanup. This ensures your code doesn’t suffer from “race conditions”: network responses may arrive in a different order than you sent them.<br>
>https://react.dev/reference/react/useEffect#fetching-data-with-effects

boolean 값 하나로도 충분하긴 하지만
진행 중인 fetch 리퀘스트도 취소할 수 있는 기능이 있는
`AbortController`가 더 나은 옵션이라 할 수 있습니다.

>The abort() method of the AbortController interface aborts a DOM request before it has completed. This is able to abort fetch requests, the consumption of any response bodies, or streams.<br>
>https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort

이번 포스트에선 `AbortController`를 쓰는 법, 그리고 리액트 프로젝트에서 공통 로직과 코드를 훅으로
분리해 재활용하는 여러 가지 방법을 소개합니다.

# useEffect 내 AbortController
다음 코드는 fetch 리퀘스트를 `AbortController`와 함께 `useEffect` 내에서 사용하는 예시입니다.

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

이 포스트에선 `axios`를 사용해 데이터를 가져옵니다.
`axios`는 `AbortController.signal`을 두번째 파라미터 오브젝트의 `signal` 속성으로 건네 주어야 합니다.
자세한 내용은 [`axios` 문서](https://axios-http.com/docs/cancellation)를 참고하세요.

`keyword` state가 바뀔 때마다, cleanup 함수가 실행되면서
진행 중인 fetch 리퀘스트를 취소하고 에러를 던집니다.
이 에러에 의해 아래 줄의 `setSearchResult(result)`가 실행 되지 않고 스킵되는 것입니다.
또한 취소 시 발생하는 `AbortError`를 처리하기 위해, 또는 의도치 않은 네트워크 에러 등을 방지하기 위해서라도
try catch로 감싸는 것이 바람직합니다.

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

# AbortController 커스텀 훅으로 만들기
만약 코드를 커스텀 훅으로 재활용하고 싶다면 다음과 같이 가능하겠죠.

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

이 훅은 이렇게 사용할 수 있습니다.

```js
useAbortController('/search', params, setSearchResult, onError)
```

하지만 각 argument의 stability를 보장해야 합니다.
만약 리렌더링 때마다 각 argument가 재생성되어 리액트가 **변경** 되었다고 판단 시
매번 `useEffect`가 실행 되므로 불필요한 리퀘스트, 최악의 경우 무한 리렌더링이 발생할 수 있습니다.

또한 이 훅은 `search`와 `abort` 콜백을 필요할 때 부를 수 없다는 단점이 있습니다.
시작/취소 버튼을 클릭할 때와 같이 콜백을 필요할 때 부를 경우가 있을텐데요,
해당 훅은 콜백을 `useEffect`에 감싸고 외부에 노출하지 않기 때문에 원할 때 부르는 것이 불가능합니다.

# 더 고도화된 AbortController 커스텀 훅 만들기
## 콜백과 Abort 함수를 리턴하기
따라서 커스텀 훅이 내부적으로 fetch 리퀘스트를 알아서 부르기 보다는,
리퀘스트를 `AbortController`와 함께 동작하도록 고도화 한 함수를 만들어
abort 함수와 함께 호출 컴포넌트에게 전달해 주어야 합니다.

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

우리가 만들 훅은 리액트의 `useCallback`을 사용해 두 콜백을 생성해야 합니다.
또한 동일 `AbortController` 인스턴스를 `useState`를 사용해 두 콜백 간 공유할 수 있어야 합니다.

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
    // Create a new AbortController,
    // since you cannot use same AbortController more than once.
    setController(new AbortController());
  }, [controller]);

  return [callback, abort];
});
```

하지만 위 훅에는 결함이 하나 있는데, 바로 `AbortController`가 `state`로 관리 된다는 것입니다.
한번 `AbortController.abort()`를 호출하면 그 컨트롤러는 재사용할 수 없죠.
따라서 `AbortController.abort()` 호출 후 새로운 `AbortController`를 생성해 다음 abort에 사용해야 합니다.
그러므로 최신 `AbortController`를 사용하기 위해선 두 콜백이 `controller` state에 의존해야 합니다.
이 의존성은 불필요한 리렌더링이라는 문제를 만들어 냅니다.
1. `abortRequest()` 콜백 호출.
1. `controller` state 갱신.
1. `request`와 `abortRequest` 콜백 갱신.
1. 훅을 사용하는 컴포넌트와 그 자식 컴포넌트들 리렌더링.

게다가 `request` state에 의존하는 이 콜백을 `useEffect` 내에서 부르면
또 다른 이슈가 발생합니다.
abort 콜백 호출 시 effect는 우리의 의도와는 상관 없이 무조건 재실행합니다.
또한 effect 내에선 `request`를 호출하고 그 effect의 cleanup 함수에서 `abort`를 호출하면
무한 리렌더링이 발생합니다.
이러한 동작들은 훅의 내부 로직에 의한 것이기 때문에
내부를 볼 수 없는 훅을 사용하는 입장에선 굉장히 혼란스러울 것입니다.

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
<button onClick={abortSearch}>Cancel Search</button>
```

## useRef로 AbortController 관리하기
`AbortController`를 `useState`가 아닌 `useRef`로 관리하면
리렌더링 이슈를 해결할 수 있습니다.

```js
const useAbortController = ((url, params, onFetchComplete, onError) => {
  const controllerRef = useRef(new AbortController());

  const request = useCallback(async () => {
    try {
      const signal = controllerRef.current.signal;
      const result = await axios.get(url, {
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

이제 리렌더링 이슈에서 해방되었습니다.
`request` 콜백 내 `signal` 변수가 새로 정의된 것에 주의하세요.
`abort` 콜백은 `controllerRef.current`를 업데이트 합니다.
따라서 `abort` 콜백 호출 후, `fetch` 함수 내 `controllerRef.current`는
우리가 원하는 `AbortController`가 아닐 수도 있다는 것이죠.
만약 `fetch` 전 `abort` 콜백을 호출했다면 `fetch`가 참조하는
`AbortController`는 새 인스턴스일 수 있으며 그렇다면
방금 호출한 `abort`는 리퀘스트를 취소하지 못합니다.
따라서 `fetch` 호출 직전 `controllerRef.current`를 다른 변수에
저장해 사용해야 합니다.

# AbortController를 콜백의 파라미터로 전달하기
유연성을 더 높이기 위해 url이 아니라, `AbortController`를 받는 콜백을
훅의 파라미터로 받을 수도 있습니다.
이렇게 되면 `url`, `params`, `onFetchComplete`, `onError`
이렇게 파라미터 여러 개가 아닌 파라미터로 넘겨줄 콜백 하나에서 전부 처리가 가능합니다.

```js
const searchWithAbortController = useCallback(
  async (abortController) => {
    try {
      const result = await axios.get('/search', {
        signal: abortController.signal
      });
      // Handle result
    } catch (e) {
      // Handle errors
    }
  }, []);

const [search, abortSearch] = useAbortController(searchWithAbortController);
```

이러한 훅은 다음과 같이 정의할 수 있습니다.
이 훅의 역할은 파라미터로 받은 콜백에 `AbortController`를 바르는 게 다입니다.
훅을 호출하는 쪽에 응답과 에러를 처리하도록 역할을 넘겼기 때문에 훅의 코드가 굉장히 간결합니다.
하지만 반대로 호출하는 쪽의 코드가 더 복잡해지겠죠.

```js
const useAbortController = ((cb) => {
  const controllerRef = useRef(new AbortController());

  const callback = useCallback(() => {
    const controller = controllerRef.current;
    return cb(controller);
  }, [cb]);

  const abort = useCallback(() => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  }, []);

  return [callback, abort];
});
```

## 파라미터의 콜백에 다른 인자도 전달하기
여기서 더 고도화를 해보죠. 콜백이 `AbortController` 뿐 아니라
다른 인자도 받을 수 있으면 얼마나 좋을까요?

```js
const useAbortController = ((cb) => {
  const controllerRef = useRef(new AbortController());

  const callback = useCallback((...args) => {
    const controller = controllerRef.current;
    return cb(controller, ...args);
  }, [cb]);

  const abort = useCallback(() => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  }, []);

  return [callback, abort];
});
```

이러한 패턴은 `useAbortController` 훅으로 감싸기 전의 원래 함수와
파라미터가 일치하기 때문에 호출 시 굉장히 편리합니다.

```js
const searchWithAbortController = useCallback(
  async (abortController, keyword) => {
    try {
      const result = await axios.get('/search', {
        params: {keyword},
        signal: abortController.signal
      });
      // Handle result
    } catch (e) {
      // Handle errors
    }
  }, []);

const [search, abortSearch] = useAbortController(searchWithAbortController);

// Like this. No need to care AbortController, just your arguments.
search('keyword');
```

만약 `AbortController`가 파라미터의 마지막에 오길 바란다면, 다음과 같이 보내면 됩니다.

```js
const useAbortController = ((cb) => {
  const controllerRef = useRef(new AbortController());

  const callback = useCallback((...args) => {
    const controller = controllerRef.current;
    return cb(...args, controller);
  }, [cb]);

  const abort = useCallback(() => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  }, []);

  return [callback, abort];
});

const searchWithAbortController = useCallback(
  async (keyword, abortController) => {
    try {
      const result = await axios.get('/search', {
        params: {keyword},
        signal: abortController.signal
      });
      // Handle result
    } catch (e) {
      // Handle errors
    }
  }, []);
```

### Typescript로 타이핑 하기
이제 이 훅을 어떻게 타입스크립트로 짤 수 있을지 봅시다.
currying 함수 작성 시 타입이 Deprecated 되지 않게 하는 것은 DX에 적지 않은 영향을 미칩니다.
신경 써서 작성하지 않으면 currying 함수의 타입은 날라가게 되죠.
다음 타입스크립트 코드를 봅시다.
동작은 하지만 모든 타입이 `unknown`입니다. 이건 아니죠.

```ts
const useAbortController = (
  cb: (controller: AbortController, ...args: unknown[]) => unknown
) => {
  const controllerRef = useRef(new AbortController());

  const callback = useCallback((...cbArgs: unknown[]) => {
    const controller = controllerRef.current;
    return cb(controller, ...cbArgs);
  }, [cb]);

  const abort = useCallback(() => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  }, []);

  return [callback, abort];
};
```

여기서 필요한 것은 *generics*입니다.
제네릭 타입을 훅에 추가함으로써 리턴 하는 함수는 자동으로 상세한 타입을 가지게 됩니다.

```ts
const useAbortController = <Args extends unknown[], Ret>
  (
    cb: (controller: AbortController, ...args: Args) => Ret
  ) => {
  const controllerRef = useRef(new AbortController());

  const callback = useCallback((...cbArgs: Args) => {
    const controller = controllerRef.current;
    return cb(controller, ...cbArgs);
  }, [cb]);

  const abort = useCallback(() => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  }, []);

  return [callback, abort];
};
```

이제 노출되는 콜백 파라미터는 자세한 타입을 가지게 되나 함수 자체의 타이핑은
모호한데요.
이 훅의 리턴 타입이 무엇인지 명시하지 않았기 때문입니다.

![useAbortController-typescript-wrong-types](/img/2023-10-26-en-useAbortController-hook/useAbortController-typescript-1.png)

![useAbortController-typescript-wrong-types](/img/2023-10-26-en-useAbortController-hook/useAbortController-typescript-2.png)

다음과 같이 상세한 타입을 줌으로써 해결하거나,

```ts
const useAbortController = <Args extends unknown[], Ret>
  (
    cb: (controller: AbortController, ...args: Args) => Ret
  ): [callback: (...args: Args) => Ret, abortCallback: () => void] => {
```

리턴하는 콜백 어레이에 `as const`를 줘서 해결할 수 있습니다.
```ts
  return [callback, abort] as const;
```

이제 콜백은 자세한 타입을 갖게 되었습니다.  :)

만약 훅에서 `AbortController`가 마지막 파라미터로 오게 만들고 싶다면
타입스크립트로 작성하긴 까다롭긴 하나 100% 가능합니다.

```ts
type ArgsWithController<T extends unknown[]> = [...T, AbortController];

const useAbortController = <Args extends unknown[], Ret>
  (
    cb: (...args: ArgsWithController<Args>) => Ret
  ): [callback: (...args: Args) => Ret, abortCallback: () => void] => {
  const controllerRef = useRef(new AbortController());

  const callback = useCallback((...cbArgs: Args) => {
    const controller = controllerRef.current;
    return cb(...cbArgs, controller);
  }, [cb]);

  const abort = useCallback(() => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  }, []);

  return [callback, abort];
};
```

타입스크립트는 개발자를 돕기 위해 탄생한 언어라는 것을 말씀 드리고 싶습니다.
만약 같은 로직을 재활용할 일이 없거나, 타입스크립트가 그다지 유용하다고 느끼지 않는다면
타입스크립트를 사용하지 않아도 괜찮습니다.
하지만 상세한 타이핑과 함께 한번 작성된 타입스크립트 코드는 여러분을 여러 번 구할 것입니다.
