---
toc: false
title: "Fedora 42 KDE에 한글 입력하기"
category: ["Programming"]
tags: [Linux]
author:
  - 이현재
---

이 글은 2025년 배포된 '**Fedora KDE Plasma Desktop 42**'을 기준으로 설명합니다.
몇 개월 전 Ubuntu 24.04 LTS를 쓸 때는 한글 입력 세팅이 이렇게 어렵진 않았던 기억이 있어서
우분투나 Gnome 데스크탑 환경을 쓰면 간단히 해결될 수도 있습니다.
리눅스 다국어 입력기는 ibus, nimf 등 여러 가지가 있는데 그 중 KDE 환경에는 fcitx5를 추천하는 글이
검색 결과에 많이 나와서 fcitx5를 썼습니다.

첫번째로 할 일은 페도라 환경 설정에 들어가 **키보드** > **키 바인딩**에 들어가 **한/영** 키를 **한/영** 키로 인식되게 바꾸는 것입니다.
**오른쪽 Alt 키를 한/영 키로 만들기** 항목을 체크 표시해주세요.
![keyboard](/img/2025-08-02-ko-hangul-input-fedora-42/keyboard.webp)
![keybinding](/img/2025-08-02-ko-hangul-input-fedora-42/keybinding.webp)

<br>

그 다음 할 일은 fcitx5 설치입니다.
GUI로 간편하게 fcitx5 설정을 할 수 있는 패키지를 설치하도록 합니다.
설정 툴인 `fcitx5-configtool`을 설치하면 의존성 패키지인 `fcitx5`도 같이 설치됩니다.
```shell
sudo dnf install fcitx5-configtool
```

설치 후 터미널에서 `fcitx5-configtool`을 실행 후 왼쪽 입력기 리스트에 '**한글**'을 추가해줍니다. 꼭 '**한글**'이어야 합니다.
다른 '키보드 - 한국어' 입력기들은 영어가 입력되는 입력기로 '**한글**'이 진짜 한글이 입력되는 입력기입니다.
![inputmethod](/img/2025-08-02-ko-hangul-input-fedora-42/inputmethod.webp)

<br>

그리고 입력기를 전환할 수 있는 키를 설정해 줍니다.
트리거 입력기에 '**한/영**'키가 설정되어 있는지 확인해 줍니다.
![trigger](/img/2025-08-02-ko-hangul-input-fedora-42/trigger.webp)

<br>

페도라 환경 설정에 들어가 **키보드** > **가상 키보드**로 들어가 **fcitx5**를 선택합니다.
![virtual_keyboard](/img/2025-08-02-ko-hangul-input-fedora-42/virtual_keyboard.webp)

<br>

설정한 입력기 전환 키를 눌러 입력기 전환이 잘되는지, 한글 입력이 잘 되는지 확인해 줍니다.

만약 키보드 전환이 되지 않는다면 시스템 업데이트 후 다시 시도해줍니다.
제 경우에는 업데이트 전 한글로 전환 시 '**한글 (사용할 수 없음)**' 툴팁이 뜨면서 한글 입력이 되지 않는 문제가 있었으나,
페도라 업데이트 후 한글 입력을 정상적으로 할 수 있었습니다.

만약 electron, chrome과 같은 chromium 기반의 앱에 한글 입력이 되지 않는다면
아래 스크립트를 실행해 환경 변수를 추가합니다. [참조 링크](https://blog.litehell.info/post/fcitx5_for_101_key_keyboard_kde_laptop/)
```shell
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export QT4_IM_MODULE=fcitx
export QT5_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
```

<br>

>[!note]
>위 환경 변수 설정 시 설정하지 말라는 OS 알림이 뜨며
>변수를 설정하지 말라는 [fcitx5 문서](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland)도 찾을 수 있지만
>사용 중 문제가 발생하지도 않았으며 이게 제가 이해할 수 있는 가장 간편한 해결 방법이었습니다.

<br>

---

<br>

이 글의 부제는 '_리눅스 한글 입력은 아직도 고통이다_' 입니다.

리눅스 PC의 인기는 나날이 상승 중이라고 합니다: 
[Linux market share approaching 4.5% for first time, could hit 5% by 1Q25](https://www.tomshardware.com/software/linux/linux-market-share-approaching-45-for-first-time-could-hit-5-by-1q25)\
인터넷 커뮤니티에도 _리눅스를 깔아서 써봤습니다_ 라는 글에
_나는 윈도우로 다시는 안 돌아갈 것이다!_ 라며 긍정적인 반응을 많이 찾아볼 수 있기에
'_리눅스가 PC에 깔아서 써도 꿀리지 않을 정도까지 왔구나!_' 라고 기대했지만
실제로 이번 주 리눅스를 깔아서 써보니 아직 멀었다는 생각이 듭니다. 
아무리 요즘 윈도우가 별로라고 하지만 수십 년간 이어온 그 짬밥이 사라지긴 힘들죠.

리눅스가 윈도우보다 나은 점이 없다는 말은 아니며 리눅스가 더 나은 점도 분명히 있습니다만
실제로 윈도우에 길들여진 사람에게는 불편할만한 요소가 아직 많습니다.
예를 들어 Gnome에는 아직도 터치패드 스크롤 속도 조절을 설정에서 제공하지 않으며
KDE에서는 부팅 후 잠금 해제를 지문으로 할 수 없습니다.

'_그냥 되던데_'가 가능한 윈도우에 비해 설정이 필요한 요소가 많은 리눅스는
바로 사용이 가능한 환경을 요구하는 저 같은 사람에게는
아직 불편한 요소가 많다고 느꼈습니다.


