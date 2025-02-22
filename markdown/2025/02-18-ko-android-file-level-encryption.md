---
layout: post
toc: true
title: "안드로이드 폰에서 내 파일은 안전할까?"
category: ["Programming"]
tags: [security, mobile, android]
author:
  - 이현재
---

![android icon](/img/2025-02-18-ko-android-file-level-encryption/android.png)

# 서론
휴대폰의 세상에 우리는 휴대폰으로 사진을 찍고, 영상을 남기며, 문서를 저장합니다.
그렇게 작은 폰에 우리의 디지털 정보들을 남기면서 이런 생각을 하셨을거에요.<br>
- *"민감한 데이터를 이렇게 저장해도 안전할까?"*
- *"중고로 다른 사람에게 팔면 그 사람이 내 파일을 볼 수 있지 않을까?"*
- *"만약 누가 내 폰을 습득하거나 훔쳤다면 안에 있는 파일을 볼 수 있는 것 아닐까?"*

당연한 걱정이라고 생각합니다. 요즘 같이 휴대폰에 갖가지 개인 정보를 저장하는
저 같은 사람이라면 더더욱 걱정되는 내용이지요.

이러한 걱정 때문에 중고로 판매하는 사람들 중에는 판매 전 기기 초기화를 한 번이 아니라 여러 번 진행하거나,
큰 파일을 복사해 기기 용량을 꽉 채우거나, 더 나아가 스토리지를 '00000...'으로 채우는 프로그램을
사용하는 사람도 있다고 합니다.

하지만 현실적으로, 일반인의 입장에서 살펴봤을 때 과연 이런 과정이 필요할까요?
안드로이드가 나온지 20년이 다 되어가는 요즘, OS 자체적으로 이런 걱정을 안해도 되도록
보안 기능을 제공하고 있진 않을까요?

# 요즘 안드로이드는 내가 설정한만큼 안전합니다
결론부터 말하자면, 2016년 출시한 안드로이드 7부터 **내 파일은 내가 설정한 패스워드만큼 안전**합니다.
안드로이드 Nougat부터 파일 기반으로 암호화가 기본으로 적용되었기 때문에
기기가 잠금이 해제되지 않은 이상 파일을 읽을 수가 없습니다.
스토리지에는 암호화가 되어 저장되고, 파일을 읽거나 쓸 때에는 자동으로 암복호화를 해주기 때문에
기기에 물리적으로 접근이 가능해도 **암호를 모르면 파일을 읽을 수 없습니다**.

그럼에도 불구하고 기기를 다른 사람에게 양도할 때는 기기 초기화를 진행하거나,
기기를 잠시 떨어뜨려놓아야 하는 상황에는 잠금을 항시 유지하거나
알기 힘든 강력한 패스워드를 설정하는 등 기본적인 보안 규칙을 지킬 필요는 있다고 생각합니다.

>[!warning]
>참고로 인터널 스토리지가 아닌 외부 스토리지, 그러니까 SD 카드는 목적 자체가 이 기기 저 기기 옮겨다니는 것이기에
>암호화가 적용되지 않을 가능성이 굉장히 농후합니다. SD 카드는 항상 조심하세요!

## 안드로이드의 File Level Encryption
안드로이드에 적용된 File Level Encryption, 다른 말로 File Based Encryption[^3]은
말 그대로 파일을 기반으로 적용하는 암호화로,
파일을 스토리지에 쓸 때 암호화를 적용해 쓰며 읽을 때는 복호화를 한 다음 프로세스에 전달하는,
사용자와 일반적인 개발자에게는 transparent한 암호화 기법입니다.
transparent 하기에 기기를 사용하면서 내 파일이 암호화가 되어 저장된다는 것을 눈치채지 못하게 되는 것이죠.

또한 암호화 적용 시 각 파일마다 다른 키를 적용하고 있다고 합니다.
때문에 데이터가 같더라도 암호화된 결과물은 다르며
기기 잠금을 해제하지 않은 상태라도 일부 파일은 부팅 후 바로 복호화를 진행하기에
알람과 같은 필수 기능을 사용할 수 있는 것입니다.[^6]
>Android 7.0 and later supports file-based encryption. File-based encryption allows different files to be encrypted with different keys that can be unlocked independently.[^1]

## 중요 데이터는 한 번 더 암호화를 해야 합니다
이렇게 파일 레벨에서 암호화를 한다 하더라도 안드로이드는 앱 개발자에게 민감 정보에 대해서는 한 번 더 암호화를 할 것을 권장하고 있습니다.
즉 커널 레벨에서 암호화에다가 유저 레벨에서의 암호화로 이중 잠금하는 셈이지요.
안드로이드 10부터 일반적으로 앱 내 파일 시스템이 샌드박스가 되면서 서로 다른 앱의 데이터를 볼 수 없게 되었습니다.

덕분에 파일은 훨씬 더 안전해졌지만 멀웨어 앱 또는 루팅 기기 등의 혹시 모르는 취약점에 의한 공격을 막기 위해서입니다.
또한 기기 잠금이 풀린 상태여도 민감한 데이터에 접근하기 위해서는 한 번 더 패스워드를 확인하는 편이 안전합니다.

>*In general, encrypting all sensitive data is a recommended security practice, no matter where it is stored.*<br>
>...<br>
>*It is important to note that full disk encryption (or file-based encryption from Android 10) is a measure aimed at protecting data from physical access and other attack vectors. Because of this, to grant the same security measure, sensitive data held on external storage should additionally be encrypted by the application.*[^4]

위는 앱 개발자에게 적용되는 권장 사항이지만 기기를 사용하는 일반 유저에게도 적용되는 것이라 할 수 있습니다.
민감한 파일은 암호화해 저장하세요.

## 메타데이터도 암호화될 수 있습니다
파일 사이즈나, 폴더 구조, 수정된 시각 등
파일 시스템 메타데이터는 File Level Encryption 적용 범위에 포함되지 않는다고 합니다.
하지만 이것도 2018년 출시한 안드로이드 9, Pie부터 Metadata Encryption 기능을 적용하면서
File Level Encryption이 암호화하지 않은 메타데이터들을 암호화할 수 있다고 합니다.[^5]

# 결론
## 우리가 준수할 보안 규칙
*'a chain is only as strong as its weakest link'* 라는 말처럼
기본적인 보안을 위해 다음 사항을 준수하도록 합시다.

- **강력한 기기 패스워드를 설정한다.**
- **항시 기기 잠금을 유지한다.**
- **탈취에 대비해 원격 잠금 등 보안 대책을 강구한다.**
- **기기 양도 전 기기 초기화를 진행한다.**<br>
  초기화를 여러 번 반복할 필요가 없다는 말이 기기 초기화를 아예 하지 않아도 된다는 말은 아닙니다.
  잠금이 되어 있어도 가능한 최고의 보안을 위해 기기 초기화는 필요합니다.

## 기기 패스워드가 중요합니다
결국 우리가 설정한 기기 패스워드가 가장 중요합니다.
우리 기기 패스워드를 다른 사람이 알고 있다면 기기 잠금이 의미 없는 것과 마찬가지죠.
애당초 패스워드를 알고 있다면 기기 잠금을 풀고 파일을 읽으면 그만입니다.

기기 패스워드는 너무 짧거나 예측이 쉬운 단어로 저장하지 마세요.

<br>

---

<br>

저도 보안에 대한 식견은 짧지만, 일반인의 입장에서 생각해봤을 때,
결국 누가 내 기기를 가져가 파일을 들여다 볼 것인가는 내 파일에 그럴만한 가치가 있을까에 따라 달라지지 않을까 생각합니다.
기기를 훔쳐가거나, 1234부터 시작해서 패스워드를 하나씩 입력해보거나,
아니면 스토리지 칩을 적출해 들여다보거나, 이런 것들은 결국 리스크가 있고 돈이 들고 인력이 들기 마련입니다.
백만 년이 걸리더라도 그럴만한 가치가 있다고 생각하면 백만 년을 걸려 암호를 깰 것이고,
그렇지 않다면 시도조차 하지 않겠죠.

하지만 내 데이터가 백만 년이 아니라 하루의 가치, 돈으로 환산해 천 원의 가치가 될까말까 하더라도
비밀번호가 1234라면 이건 아무도 없는 길바닥에 떨어진 천 원과 다를 바 없습니다.

패스워드는 꼭 강력한 패스워드를 사용하고, 기기 잠금을 항시 유지하는 습관을 들이는 등 보안 규칙을 준수하도록 합시다.


[^1]: https://source.android.com/docs/security/features/encryption

[^3]: https://en.wikipedia.org/wiki/Filesystem-level_encryption

[^4]: https://developer.android.com/privacy-and-security/risks/sensitive-data-external-storage#sensitive-data-stored-in-external-storage-encrypt-sensitive-data

[^5]: https://source.android.com/docs/security/features/encryption/metadata#implementation-on-internal-storage

[^6]: https://developer.android.com/privacy-and-security/direct-boot
