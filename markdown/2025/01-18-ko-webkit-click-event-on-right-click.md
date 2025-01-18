---
layout: post
toc: true
title: "사파리에서 우클릭으로 클릭 이벤트가 발동되는 이슈"
category: ["Programming"]
tags: [web, browser, html, javascript]
author:
  - 이현재
---

웹 플랫폼은 기기, OS, 브라우저에 관계 없이 동일한 동작을 보여준다는 특징이
있지만 항상 그렇지는 않다는 것은 널리 알려져 있는 사실입니다.
몇 년 전까지는 인터넷 익스플로러가 이 분야의 최강자였지만
IE가 사라지고 난 뒤에는 사파리가 그 자리를 차지하고 있습니다.
예시로 크롬에서는 2013년부터 지원한 Date Picker 기능이 2021년 4월에 추가되었습니다.<br>
<https://caniuse.com/input-datetime>

물론, 사파리가 앞서 지원하는 기능도 많고 크로미움 계열이 대부분의 점유율을 차지하는 요즘
상대적으로 약세인 사파리가 억울한 점도 있다고 생각하지만 _'New IE'_ 라고 종종 불리는 것도 현실입니다.

<br>

---

<br>

기능 지원 여부뿐 아니라 동작에서도 달라지는 경우도 있는데요.
그 중 한 가지를 최근 발견하게 되어 공유 드립니다.
이는 Webkit 17과 18.2 에서 재현 가능합니다.

`contextmenu`의 기본 동작을 막으면 `click` 이벤트가 발동되는 이슈인데요. 직접 보도록 합시다.
`playwright`를 사용하면 크로미움과 함께 MacOS가 아니어도 사파리 (Webkit) 브라우저를 쉽게 테스트할 수 있습니다.

```shell
npx playwright open -b webkit
npx playwright open -b chromium
```
<br>

`input` 엘리먼트 `contextmenu` 이벤트 리스너 내에서 `e.preventDefault()`를 호출한 뒤 `input`을 우클릭해 보세요.

```html
<html>
    <input type="checkbox" id="input">
    <input type="checkbox" id="inputprevent">
    <script type="text/javascript">
        const input = document.getElementById('input');
        input.addEventListener('click', (e) => {
            console.log('input click', e);
        });
        const inputprevent = document.getElementById('inputprevent');
        inputprevent.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        inputprevent.addEventListener('click', (e) => {
            console.log('input click', e);
        });
    </script>
</html>
```

<video controls alt="example-1" src="/img/2025-01-18-ko-webkit-click-event-on-right-click/1.mp4"></video>

`input`을 우클릭하면 크로미움에서는 값이 변하지 않지만 사파리에서는 값이 변합니다!
즉, 사파리에선 contextmenu의 기본 동작을 막자 좌클릭을 한 것처럼 동작하게 됩니다.
하지만 신기하게도 `input`에 `click` 이벤트 리스너를 걸어도 리스너는 실행되지 않습니다.
즉, **이벤트 리스너를 bypass 하면서 클릭할 수 있는 유저 시나리오가** 생긴 셈입니다.
사람마다 다르겠지만 저는 이를 예상되는 동작이라고 보기 힘들었습니다.

<br>

---

<br>

`label`과 `input`을 연결했을 때에도 비슷한 동작을 보여줍니다.
`id`와 `for` 속성을 사용해 `input`에 연결한 `label`을 클릭하면 `input`에도 `click` 이벤트가 발동됩니다.
이때에는 `input`에 건 `click` 이벤트 리스너가 발동하면서 `e.button`을 출력하면 `0`,
즉 좌클릭이 눌러졌다고 판단하고 있습니다.
>When a user clicks or touches/taps a label, the browser passes the focus to its associated input
>(the resulting event is also raised for the input).
>That increased hit area for focusing the input provides an advantage to anyone trying to activate it
>— including those using a touch-screen device.<br>
><https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label>

```html
<html>
    <input type="checkbox" id="input">
    <label for="input" id="label">label</label>
    <input type="checkbox" id="inputprevent">
    <label for="inputprevent" id="labelprevent">label with prevent</label>
    <script type="text/javascript">
        const input = document.getElementById('input');
        const label = document.getElementById('label');
        input.addEventListener('click', (e) => {
            console.log('input click', e);
        });
        const inputprevent = document.getElementById('inputprevent');
        const labelprevent = document.getElementById('labelprevent');
        labelprevent.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        inputprevent.addEventListener('click', (e) => {
            console.log('input click', e);
        });
    </script>
</html>
```

<video controls alt="example-2" src="/img/2025-01-18-ko-webkit-click-event-on-right-click/2.mp4"></video>
<br>

하지만 이것은 이상합니다. 왜냐하면 클릭 이벤트는 마우스의 주버튼 (보통 좌클릭)을 눌렀을 때 발동되는 이벤트이기 때문입니다.

>A pointing-device button (such as a mouse's primary button) is both pressed and
>released while the pointer is located inside the element.<br>
><https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event>

`such as`라는 표현이 모호하긴 하지만 `contextmenu`에 `e.preventDefault()`를 호출하지 않고 우클릭을 하면
`click` 이벤트가 발동되지 않는다는 사실에서 사파리도 우클릭을 클릭 이벤트라 보지 않음을 추론할 수 있습니다.

<br>

---

<br>

사파리의 이런 동작을 크로미움과 동일하게 수정하고 싶다면
우클릭 여부를 `mousedown` 이벤트에서 잡아서 그에 따라 다른 이벤트 리스너에서 판별하면 됩니다.
하지만 저는 이렇게 하기보다는 사파리의 동작이 변경되길 희망합니다.
