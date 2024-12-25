---
layout: post
toc: true
title: "컬러 테마 버튼 플리커링 예방하기"
category: ["Programming"]
tags: [javascript, svelte, sveltekit, html, css]
author:
  - 이현재
---

제 블로그는 라이트 테마와 다크 테마를 지원합니다.
헤더에 있는 컬러 테마 버튼을 누르면 리로딩 없이 심리스 하게 변경됩니다.
모두 클라이언트 자바스크립트 덕분이죠.

제 블로그는 Sveltekit 으로 작성되었으며 따로 서버가 없기 때문에
Prerender 된 HTML에 클라이언트 코드에서 업데이트를 합니다.
컬러 테마 버튼도 Prerender 되는데 여기서 문제가 발생합니다.
HTML 파일을 생성할 때 서버는 클라이언트가 어떤 컬러 테마를 사용할 지
알 수 없기 때문입니다.

브라우저에서 제 블로그가 렌더링되는 단계는 다음과 같습니다.
먼저 서버에서 받은 HTML을 브라우저가 처리할 겁니다.
그런 다음 `body` 태그 내 inline script가 실행되면서
라이트/다크 테마에 따라 페이지를 그리기 위한 준비를 마칩니다.
[참조할만한 포스트](/post/2023/12-19-en-migrate-blog-to-sveltekit-styling)

컬러 테마 버튼은 다른 컴포넌트와 다른 점이 있는데,
서버에서는 현재 테마를 모르기에 빈 버튼을 그리고
브라우저에서만 `localStorage`에서 현재 설정된 테마를 가져와 HTML을 업데이트 합니다.
서버에서 렌더링 할 때 기본값을 `null`이 아니라 `light`나 `dark` 둘 중 하나를
임의로 렌더링 할 수도 있겠지만, 정반대 테마를 보여주는 브라우저에서
아예 잘못된 버튼을 보여주는 것보단 빈 버튼을 보여주는게 낫다고 생각해
빈 버튼을 렌더링 하고 있습니다.

```jsx
{#if currentTheme === 'dark'}
  {/** Render button for light mode */}
{:else if currentTheme === 'light'}
  {/** Render button for dark mode */}
{:else}
  {/** Render empty button (server only) */}
{/if}
```

![before-phases.png](/img/2024-12-25-ko-how-to-prevent-flickering-color-theme-button/before-phases.png)

그 사이에, 그러니까 페이지가 그려지고 브라우저에서 업데이트 하기까지
**불일치**가 발생하고 업데이트 할 때 **플리커링**이 발생하게 됩니다.

<video controls alt="before" src="/img/2024-12-25-ko-how-to-prevent-flickering-color-theme-button/before.mp4"></video>
<br><br>

해결을 해보려 해도 서버가 없는 Prerender 단계에서 브라우저의 테마를 알기는 불가능한 일입니다.
브라우저에서 업데이트 하기 전까지 HTML을 페인트 하지 않는 방식도 
가능하고 안하고는 둘째 치고 좋은 방법은 아닙니다.
Prerender는 페이지를 최대한 빨리 보여주기 위함인데
테마 버튼이 깜빡인다고 그리지 않는 것은 너무한 처사입니다.

해결 방법은 의외로 간단했습니다.
다른 서비스는 어떻게 해결을 하였는지 참조하기 위해
이슈가 나타나지 않는 react의 공식 문서 사이트 [react.dev](https://react.dev) 를 참조하였습니다.
react.dev 도 현재 선택된 테마에 따라 렌더링을 분기하기는 하지만,
분기를 자바스크립트로 하는 제 블로그와 달리 CSS 클래스로 분기 하고 있었습니다.
이 방식은 inline script로 synchronous 하게 테마에 따른 렌더링 준비를 하는
제 블로그에도 바로 적용이 가능한 해결 방법입니다.

![after-phases.png](/img/2024-12-25-ko-how-to-prevent-flickering-color-theme-button/after-phases.png)

스크립트로 분기 하는 코드를 삭제하고
라이트 테마에서 보여줘야 하는 HTML 태그에 tailwind의 `dark:hidden`을 적용하고
다크 테마에서 보여줘야 하는 HTML 태그에는 `hidden dark:block`을 적용하였습니다.

```jsx
<button title="Click to activate dark mode" class="dark:hidden">
  {/** Render button for dark mode */}
</button>
<button title="Click to toggle to light mode" class="hidden dark:block">
  {/** Render button for light mode */}
</button>
```

<video controls alt="after" src="/img/2024-12-25-ko-how-to-prevent-flickering-color-theme-button/after.mp4"></video>

이제 리프레시해도 플리커링이 일어나지 않습니다!
플리커링과 불일치 렌더링이 사라졌으니 서버에서 빈 버튼을 보여주는 로직도
필요가 없어져서 삭제할 수 있었습니다.
사실 그렇게 어려운 해결 방식은 아닙니다.
오히려 이 버튼을 다른 일반적인 컴포넌트와 라이트/다크 테마를 지원하는
컴포넌트와 똑같이 취급하면 자연스럽게 적용할 수 있는 방법입니다.
