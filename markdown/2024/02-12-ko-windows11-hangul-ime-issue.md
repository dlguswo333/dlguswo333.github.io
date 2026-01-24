---
layout: post
toc: true
title: "Windows 11 한글 IME 입력 이슈"
category: "Programming"
tags: [windows, IME, hangul, javascript]
author:
  - 이현재
---

# Windows 11 에서의 한글 IME 입력 이슈

웹앱 개발 중 윈도우 11에서 발생하는 한글 입력 중 마지막 음절이 지워지는 아주 골 때리는 현상을 겪었습니다.
한글 입력 중 다른 창/탭으로 포커스가 이동하면 입력 중인 글자가 지워지는 것인데요.
또한 같은 window의 다른 엘리먼트 마우스 클릭으로 인하여 포커스를 잃을 경우에도
`'input'` 이벤트가 연달아 두 번 발생하는데, 입력 중인 글자가 지워진 value로 한 번,
그리고 마지막 글자가 원상 복귀 된 value로 한 번 이렇게 발생합니다.
다음은 재현을 위한 간단한 HTML 코드 예시입니다.
동작에 영향을 줄 만한 코드가 없음에도 이슈가 발생하는 것을 확인할 수 있습니다.

```html
<html>
    <body>
      <input id='input' type='text'>
      <div id="log"></div>
    </body>
  <script>
    const inputEle = document.querySelector('#input');
    const logEle = document.querySelector('#log');
    let cnt = 1;
    inputEle.addEventListener('input', (e) => {
        const log = document.createElement('div');
        log.textContent = cnt.toString().padStart(3, '0') + ' ' + JSON.stringify(e.target.value);
        cnt++;
        logEle.prepend(log);
    });
  </script>
</html>
```

`'이런 이슈가'` 값으로 `input` 이벤트 후 다른 창 클릭 시 `이런 이슈` 값으로 `input` 이벤트 한 번 더 발생합니다.
<video controls alt="bug-demo" src="/img/2024-02-12-ko-windows11-hangul-ime-issue/bug-demo.mp4"></video>

추가로 해당 이슈는 구글 검색 페이지에서도 발생하고 있습니다.
<video controls alt="google-bug-demo" src="/img/2024-02-12-ko-windows11-hangul-ime-issue/google-bug-demo.mp4"></video>


직접 실험한 발동 조건과 현상은 아래와 같습니다.
- 다른 창 (Process)으로 포커스 이동 시<br>
  입력 중인 문자 삭제

- 다른 탭으로 클릭하여 포커스 이동 시<br>
  입력 중인 문자 삭제

- 다른 탭으로 Ctrl + Tab으로 포커스 이동 시<br>
  입력 중인 문자 삭제 되지 않음. 우리가 원함직한 동작.

- 같은 Window (탭) 내의 다른 엘리먼트로 포커스 이동 시<br>
  입력 중인 문자가 삭제된 값으로 입력 이벤트가 발동 된 후, 다시 원상복귀.

# 맥의 composing 이슈와 차이점

참고로 애플 맥에서도 한글 입력 이슈가 하나 있죠? 맥에서는 `isComposing` 이슈가 있는데, 둘은 같은 듯 다릅니다.
`isComposing` 이슈는 한글과 같은 조합 문자를 조합하는 중 `keydown` 이벤트가 특정 입력에 대해
같은 `value`와 같은 `e.key`로 두 번 연달아 발생하는 것을 말합니다.
그나마 맥 이슈는 `event.isComposing` 값으로 분기 처리가 가능하며, **무엇보다 글자가 잘려 내려 오지는 않습니다**.

# 해결법

해결법은 어떻게 될까요? 모르겠습니다. 농담이 아니라 진짜요.
`Debounce`를 걸거나 하는 법 외에는 잘 모르겠습니다.
`beforeinput`이나, `compositionstart` 같은 이벤트를 적절히 조합하면 될 듯 하기도 한데,
예외 케이스나 로직을 설계하는 것이 쉽지만은 않아 보입니다.

원초적인 해결법이 있기는 합니다. 바로 Windows 11에서 바뀐 IME를 예전 버전으로 되돌리는 것인데요.
사용자 PC의 설정에서 시간 및 언어 > 언어 및 지역 > Microsoft IME 에서 호환성 > 이전 버전의 Microsoft IME를 활성화하여
해결할 수는 있지만 사용자 디바이스의 설정을 바꾸는 것은 현실적으로 불가능한 방법이라 해야겠죠.

![ime-settings](/img/2024-02-12-ko-windows11-hangul-ime-issue/ime-settings.png)
