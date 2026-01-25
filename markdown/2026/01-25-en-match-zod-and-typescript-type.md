---
layout: post
toc: false
title: "Matching Zod and Typescript Type"
category: "Programming"
tags: [typescript, zod]
author:
  - 이현재
---

Typescript itself already check types, but it offers only compile time type safety.
Your Typescript codes cannot assign `string` values to `number` variables,
but external sources can, such as server APIs or databases.
And to some extent, your codes can also trick Typescript's validation.
Think of `as any` and non-null assertions.\
You can check if the values actually fit the types by `typeof` or something
like that, but implementing type checking functions for complicated types is not an easy job.
```ts
const bookData = getSomeData();
// You got book data and want to check if it actually is...
if (
  typeof bookData === 'object' && 
  typeof bookData.title === 'string' &&
  bookData.title.length > 0 &&
  typeof bookData.pageCount === 'number' &&
  bookData.pageCount > 0 &&
  Number.isInteger(bookData.pageCount)
) {
  // It is!
}
```

That's where you need **zod**.

[zod](https://zod.dev) is a runtime type validation library for Typescript.
It checks the values' types at runtime, and gives you the corresponding Typescript types.
Also it provides easy and comfortable interface.
zod's API is declarative and concise. Moreover, it offers more than just type checkings;
`z.int()` and `z.positive()` are such examples.
```ts
const bookData = getSomeData();
const bookDataZod = z.object({
  title: z.string().min(1),
  pageCount: z.number().positive().int(),
});
type BookData = z.infer<typeof bookDataZod>;
const safeBookData = bookDataZod.parse(bookData);
// safeBookData variable has the typescript type corresponding to bookDataZod!
```

I think zod's one big advantage is that you become to trust your codes more.
That is really great.

As you saw from the code above, zod can give you Typescript static types with `z.infer`.
The inferred types are guranteed to match the original zod types.

But what about the vice versa? What if you want to have an Typescript type
and want to have the corresponding zod type? 
One such scenario is where you have Typescript types already and
you want to have zod types for validation. Can you do that?
```ts
type BookData = {
    title: string;
    pageCount: number;
}

// How?
const bookDataZod = getZodFromType<BookData>();
const bookData = getSomeData<BookData>(bookDataZod);
```

As far as I know, you can't get zod types from Typescript types easily.
To put it simply, zod runs on runtime, Typescript types only on compile time.
They get erased after compilation and you can't easily get
something run on runtime which only exist in compile time.
But it is something that is not possible, you can do that by converting zod codes into Typescript codes.
Check out [ts-to-zod](https://github.com/fabien0102/ts-to-zod).

Then can you at least write zod types so that they statically match your Typescript types?
```ts
type BookData = {
    title: string;
    pageCount: number;
}
const bookDataZod = z.object({
  title: z.string().min(1),
  pageCount: z.number().positive().int(),
});
const bookData = getSomeData<BookData>(bookDataZod);
```

As the author of the function `getSomeData`, you want to match both types to each other. 
```ts
const getSomeData = <ReturnType>(returnTypeZod: unknown): ReturnType => {
  // ...
  // The function returns `ReturnType`, so `returnTypeZod` must match it.
  return returnTypeZod.parse(some);
}
```
Can you do that? The answer is yes, thanks to `z.ZodType`.
>*All schemas extend the `z.ZodType` base class, which in turn extends `z.$ZodType` from zod/v4/core.*\
><https://zod.dev/packages/zod>

`z.ZodType` is a base class of all schemas and as a generic type,
it receives two generic paramets: `Output` and `Input`.
>*The base class for all Zod schemas is `$ZodType`. It accepts two generic parameters: `Output` and `Input`.*\
><https://zod.dev/packages/core>

Unless you are using zod types with diverged input and output such as `transform` feature,
the point is the first parameter `Output`.
You specify the `Output` with the original Typescript type.
Typescript will check if the zod type match the Typescript type.
Otherwise it will give you an error.
```ts
const getSomeData = <ReturnType>(returnTypeZod: z.ZodType<ReturnType>): ReturnType => {
  // ...
  return returnTypeZod.parse(some);
};

// Okay!
getSomeData<BookData>(z.object({title: z.string(), pageCount: z.number().positive().int()}));

// Typescript Error: Type '{ foo: string; bar: number; }' is missing the following properties from type 'BookData': title, pageCount 
getSomeData<BookData>(z.object({foo: z.string(), bar: z.number()}));
```

Also, you can assign the zod variable the Typescript type to ensure if they are in sync.
```ts
type BookData = {
    title: string;
    pageCount: number;
}

const bookDataZod: z.ZodType<BookData> = z.object({
  title: z.string().min(1),
  pageCount: z.number().positive().int(),
});
```

Happy coding!
