---
layout: post
toc: true
title: "Typescript 5.5 Noticeable Changes"
category: "Programming"
tags: [typescript]
author:
  - 이현재
---

Typescript 5.5 beta has been released on April 25th, 2024!<br>
https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta<br>
As always has been, this new update brings lots of changes,
But there are some exceptional changes related to type checking
so let me introduce those things.

# Inferred Type Predicate
Let us say there are two types `Bird`, `Fish` and a variable with type of union of the two.

```ts
type Bird = {
    fly: () => void;
}

type Fish = {
    swim: () => void;
}

declare const animal: Bird | Fish;
```

You want to execute different lines of code according to the type of the variable.
In previous Typescript you would either have if statement:

```ts
if ('swim' in animal) {
    animal.swim();
}
```

Else define a type checking funtion: *User-defined Type Guard*
to check the type.

```ts
function getIsBird(animal: Bird | Fish): animal is Bird {
    return 'fly' in animal;
}
```

Such functions that returns a `arg is Type` boolean are called *Type Guard* functions.
>To define a user-defined type guard, we simply need to define 
>a function whose return type is a type predicate:<br>
>https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

However when you define such separate functions you need to define Type Predicate
as the return type else Typescript would not narrow the target parameter type!

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

There is no issue in the logics. After checking the type `animal` is guranteed to be `Bird` type
and `animal` variable has not been changed.
It was just because Typescript could not handle it.

But from 5.5 Typescript can handle this!

```ts
function getIsBird(animal: Bird | Fish) {
    return 'fly' in animal;
}

if (getIsBird(animal)) {
    animal.fly(); // This is fine since 5.5!
}
```

You can see from type definition of function with LSP it implicitly check the type.
since it can infer the type Type Predciate is denoted as return type.

![inferred-type-predicate](/img/2024-05-18-ko-typescript-5-5-notable-changes/inferred-type-predicate.png)

## Advantages
The most prominent Advantage is that you do not need to denote Type Predicate.<br>
But From that onwards, because inference also works on arrow functions,
Type narrowing are added to the codes that had not been
such as `Array.filter(v => v !== null)`!

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

You don't need to define Type Guard function separately!


## Inference Condition
From Typescript 5.5 even functions without Type Predicate
will be _inferred_ to return Type Predicate if they hold the following conditions.
Most of the times they will be inferred well 
if you wrote them in the way you would normally write Type Guard function.

1. There should be no denoted return types or Type Predicate.
2. There should be only one `return` statement and no implicit returns.
3. It should not modify the parameter.
4. It should return `boolean` expression with respect to the parameter.

As with the first condition, you shouldn't even denote `boolean` return type.
And there is no meaning of inference if it explicitly returns Type Predicate.

The second one tells that the inference needs the function to return explicitly.
Also keep in mind the return statement should not be more than one.
The next codes are examples of no inference.

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

The fourth means that you need to actually inspect the type of parameter
so that Typescript check the code path which would return `true` or `false`
to infer Type Predicate.
For example the below would not work as it does not tell Typescript anything.

```ts
function getIsBird (animal: Bird | Fish) {
  return true;
}
```

Oddly the following code does not work either.
If the returned value is `true` it does mean that `animal` is of `Bird` type.<br>
If you read the pull request of Inferred Type Predicate,
Type Guard must be _if and only if_.
Thus `return 'fly' in animal && Math.random() > 0.5` code
may return different boolean values according to the right hand side operand
even though it is handed a `Bird` parameter;
as a result it is not a Type Guard function.
Nevertheless it does not quite explain why `&& true` is not a Type Guard expression.

```ts
function getIsBird (animal: Bird | Fish) {
  return 'fly' in animal && true;
}
```

<br>

There are more details that I could not introduce about Inferred Type Predicate, 
so for more please visite the official documentation and PR.

https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#inferred-type-predicates
https://github.com/microsoft/TypeScript/pull/57465

## Type Guard Now Flows
Now Type Guard in TypeScript now Flows!
That means, if you wrap a Type Guard function and return it as is
Type Predicate would be deprecated.
But as told earlier, since Type Predicate is now inferred, Type Predicate is also preserved.

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
From 5.5 as long as for normal functions if they hold the inference conditions
they will return Type Predicate not `boolean`.
It means variable types could have changed unintentionally 
and leads to unwanted type errors.

Even though type narrowing is not needed,
since Inferred Type Predicates check the types.
If you try to assign a value of type which is filtered out
it may throws an error.

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

Cases like this can be handled with explicit typings.

```ts
const filteredAnimals: (Bird | Fish)[] = removeBirds(animals);
```
# Control Flow Narrowing for Constant Indexed Accesses
Now as long as an object and a key are constant it can be type-narrowed!

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

In the code above as both `obj` and `key` are constant,
inside the if block `obj[key]` is gurantedd to be of `number` type
but Typescript did not notice it.
But since 5.5 it can!
