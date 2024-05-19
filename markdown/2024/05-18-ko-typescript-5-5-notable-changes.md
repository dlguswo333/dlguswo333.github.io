---
layout: post
toc: true
title: "Typescript 5.5 주목할만한 변경점"
category: ["Programming"]
tags: [typescript]
author:
  - 이현재
---

Typescript 5.5 베타가 2024년 4월 25일 릴리즈 되었습니다!<br>
https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta<br>
늘 그렇듯이 이번에도 변경점이 많은데요,
그러나 특히 눈에 띄는 타입 체크 관련 변경점이 있어 소개해드리도록 하겠습니다.

# Inferred Type Predicate
다음과 같은 `Bird`, `Fish` 두 타입이 있으며 둘이 Union 된 타입을 가진 변수가 있다고 칩시다.

```ts
type Bird = {
    fly: () => void;
}

type Fish = {
    swim: () => void;
}

declare const animal: Bird | Fish;
```

이 변수의 타입에 따라 다른 코드를 실행하는 브랜칭을 하고 싶습니다.
기존 타입스크립트의 타입 체크는 인라인으로 if 브랜치를 타거나:

```ts
if ('swim' in animal) {
    animal.swim();
}
```

타입을 검사하는 함수, *User-defined Type Guard*를 정의하여
타입을 체크할 수 있었습니다.

```ts
function getIsBird(animal: Bird | Fish): animal is Bird {
    return 'fly' in animal;
}
```

이렇게 `arg is Type` 불린을 반환하는 함수를 *Type Guard* 함수라고 부릅니다.
>To define a user-defined type guard, we simply need to define 
>a function whose return type is a type predicate:<br>
>https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

하지만 이렇게 별개의 함수를 만들 때 Type Predicate를 반환 타입으로
명시하지 않으면 타입스크립트는 해당 타입을 Narrowing 하지 않는 문제가 있습니다!

```ts
// Typescript does not see it as type guard function; it just returns a boolean!
function getIsBird(animal: Bird | Fish) {
    return 'fly' in animal;
}

if (getIsBird(animal)) {
    animal.fly(); // This line emits error!
}
```

![no-type-predicate-function-error](/img/2024-05-18-ko-typescript-5-5-notable-changes/no-type-predicate-function-error.png)

로직 상으로는 문제가 전혀 없습니다. 타입 검사 후 `animal`이 `Bird` 타입임이 보장되며,
중간에 `animal` 변수가 변한 것도 아닙니다.
그저 타입스크립트가 이것을 처리할 수 없었던 것이죠.

하지만 이제 5.5 에서는 가능합니다!

```ts
function getIsBird(animal: Bird | Fish) {
    return 'fly' in animal;
}

if (getIsBird(animal)) {
    animal.fly(); // This is fine since 5.5!
}
```

추론이 잘 되고 있는지는 LSP의 함수 Definition으로도 확인할 수 있습니다.
추론 되었다면 함수의 리턴 타입에 Type Predicate가 명시됩니다.

![inferred-type-predicate](/img/2024-05-18-ko-typescript-5-5-notable-changes/inferred-type-predicate.png)

## 이점
가장 명확한 장점은 이제 Type Predicate를 명시하지 않아도 된다는 점입니다.
하지만 더 나아가, 추론이 Arrow Function에도 동작하기 때문에,
지금껏 쓰지 못했던 `Array.filter(v => v !== null)`과 같은 코드에 대해서도
Type Narrowing이 동작합니다!

```ts
declare const animals: (Bird | Fish)[];

function getIsBird(animal: Bird | Fish): animal is Bird {
  return 'fly' in animal;
}

// We used to write this way.
const birds = animals
    .filter(getIsBird)
    .forEach(animal => animal.fly());

// This is fine since 5.5!
const birds = animals
  .filter(animal => 'fly' in animal)
  .forEach(animal => animal.fly());
```

이제 꼭 별개의 Type Guard 함수를 선언하지 않아도 됩니다!


## 추론 조건
타입스크립트 5.5부터 Type Predicate가 명시되지 않은 함수에 대해서도
아래 조건을 충족하면 Type Predicate를 반환하는 함수임을 _추론_ 합니다.
대개의 경우 평소 쓰던 것처럼 Type Guard 함수를 작성하면 잘 동작할 겁니다.

1. 명시된 리턴 타입이나 Type Predicate가 없어야 함.
2. `return` 문이 하나만 있어야 하며 implicit return은 없어야 함.
3. 인자를 변형하지 않아야 함.
4. 파라미터와 연관하여 `boolean` 표현식 (expression)을 리턴해야 함.

1번 조건과 관련하여, `boolean`을 명시해주어도 안됩니다.
그리고 Type Predicate를 명시하면 추론의 필요가 없겠죠.

2번은 함수가 명시적인 리턴을 해야 추론이 가능함을 나타냅니다.
또한 리턴 문이 하나만 존재해야 함에 주의하세요.
다음은 추론이 안되는 코드 예시입니다.

```ts
// No Inferred Type Predicate
function getIsBird (animal: Bird | Fish) { 
  if ('fly' in animal) {
    return true;
  }
  return false;
}

// No Inferred Type Predicate
function getIsBirdNotFishOrDog (animal: Bird | Fish | Dog) {
  if ('bark' in animal) {
    return false;
  }
  if ('swim' in animal) {
    return false;
  }
  return true;
}
```

4번은 실제로 인자의 타입을 검사해야 `true`가 나올 code path와
`false`가 나올 code path를 타입스크립트가 검사해
추론할 수 있음을 의미합니다.
예를 들어 아래는 안됩니다.

```ts
function getIsBird (animal: Bird | Fish) {
  return true;
}
```

희한하게 아래 코드도 안됩니다. 리턴 값이 `true`라면
`animal`이 `Bird`임이 보장이 됨에도요.
이것은 왜인지 잘 모르겠네요.<br>
PR을 읽어보면 Type Guard는 _if and only if_ 가 되어야만 합니다.
그래서 `return 'fly' in animal && Math.random() > 0.5`는
`Bird` 인자가 전달되어도 뒤 표현식에 따라
리턴 값이 달라질 수 있으므로 타입 가드 함수라고 할 수 없는 것이죠.
그럼에도 불구하고 `&& true`는 왜 타입 가드가 아닌지 설명이 안되는군요.

```ts
function getIsBird (animal: Bird | Fish) {
  return 'fly' in animal && true;
}
```

이외에도 Inferred Type Predicate는 제가 소개드리지 못한 상세 사항이 많으니
더 자세한 사항은 공식 문서와 PR을 참조해 주세요.

https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#inferred-type-predicates
https://github.com/microsoft/TypeScript/pull/57465

## Type Guard가 이제 Flow 됩니다
이제 타입스크립트의 Type Guard도 Flow 됩니다!
그 말인즉슨, Type Guard 함수를 감싸 그대로 반환하면 Type Predicate가 Deprecated 되었는데
이제 위에서 말한 바와 같이 Type Predicate가 추론 되니 Type Predicate가 보존됩니다.

```ts
function getIsBird (animal: Bird | Fish) {
  return 'fly' in animal;
}

// This function returns type predicate since 5.5!
function wrappedGetIsBird (animal: Bird | Fish) {
  return getIsBird(animal);
}
```

## Breaking Changes in Your Code
이제 일반 함수에 대해서 조건이 일치한다면
`boolean`이 아닌 Type Predicate를 반환하게 되므로
그에 따라 타입이 의도치 않게 변경되어 기존 코드에서
타입 에러가 발생할 수 있습니다.

Type Narrowing이 필요하지 않음에도 불구하고
Inferred Type Predicate로 인해 타입이 검사되어
필터 아웃된 타입을 변수에 사용하려 할 때
에러가 발생할 가능성이 있습니다.

```ts
declare const animals: (Bird | Fish)[];

function removeBirds (arr: (Bird | Fish)[]) {
  return arr.filter(animal => 'swim' in animal);
}

// We only wanted to filter out Birds, but the returned value
// now reject Bird!
const filteredAnimals = removeBirds(animals);
filteredAnimals.push(newBird); // Error since 5.5!
```

![unwanted-inferred-type-predicate](/img/2024-05-18-ko-typescript-5-5-notable-changes/unwanted-inferred-type-predicate.png)

이와 같은 경우에는 Explicit Type으로 해결할 수 있습니다.

```ts
const filteredAnimals: (Bird | Fish)[] = removeBirds(animals);
```
# Control Flow Narrowing for Constant Indexed Accesses
이제 Object와 key가 constant 하다면 Type Narrowing 할 수 있습니다!

```ts
function getDouble(obj: Record<string, number | null>, key: string): number {
    if (obj[key]) {
        const value = obj[key];
        // This is fine since 5.5!
        return value * 2;
    }
    return 0;
}
```

코드에서 `obj` `key` 둘 다 불변하기에 if 문 내부에서 `obj[key]`가
`number` 타입임이 보장되나 타입스크립트는 이를 파악하지 못했습니다.
하지만 이제 5.5 부터는 가능합니다!
