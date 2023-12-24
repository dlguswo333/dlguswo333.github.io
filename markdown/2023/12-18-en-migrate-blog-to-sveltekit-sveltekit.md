---
toc: true
title: "Let's Migrate Github Blog to Sveltekit: Sveltekit"
category: ["Programming"]
tags: [web, svelte, sveltekit, javascript, typescript, migrate-blog-to-sveltekit]
author:
  - 이현재
---

I had been serving my personal Github blog for years.
It was written in Ruby and Jekyll,
and this is my records migrating the blog to Sveltekit.

# Why Migrate?
This is the most important thing. **WHY?**
Why would you reinvent the wheel if the pre-existing
wheel has no flaw?
There had been no problem with the previous one;
it had been working fine, no bug or errors,
it had been what I had wanted them to be.

But I was not satisfactory with what I had.

- **I am not familiar with `ruby`.**<br>
  Ruby is not my domain language as a web frontend dev. I am not familiar with its grammar and ecosystem. I would learn the language if I would, but for now, sadly I am not interested in the language.
- **I Wanted to polish my JS skills.**<br>
  JavaScript is what I would call my domain language (~~at best~~). I wanted to do a little side project that is not too overwhelming, but requires decent amount of works to get me improve JS skills.
  In that sense, this is a good opportunity to learn whild doing some project.
- **I Wanted to take full control of my github.io.**<br>
  As stated, I am not good at Ruby. I don't know where to add, edit or delete from the codes to improve my blog. Also, the pre-existing html/css/js codes were a bit complicated to understand for me.
- **I Wanted to try out `Svelete` and `Sveltekit`.**<br>
  I have heard that [svelte][svelte] is great. I have been using `react` for some years and wanted to experience new things.
- **CSR + SSG Support**<br>
  Client Side Rendering for smooth page transitions, and Server Side Generation for performance and search engine optimization. Jekyll supports SSG, for sure. But does it support CSR? It might, but am I fluent in Ruby enough to write CSR feature?

# Setup a Project
I wanted to start an empty git repository and npm project first and then add Sveltekit. But it did not work that way; I could run `vite`, but it showed browser's Not found error page. I don't know if there was misconfigurations in my `svelte.config.js` or `src/app.html`. Anyway I started a new boilerplate project with `npm create svelte@latest my-app`.

## eslint
I Installed Svelte extension for *vscode* and also setup eslint. eslint-cli did report code errors but vscode gui editor did not. I added the following field in vscode settings and vscode started to report lint errors found in `.svelte` files.
```json
    "eslint.validate": ["svelte"],
```

# Using Svelte
I have been writing React code, so my experience on Svlete
is focused on comparing it to React.
To put it simple, Svelte is rather simple;
I mean less verbose than React code.
But I am reluctant to say that
Svelte is better than React.
It has pros and cons.

## States, Effect
You need to declare states and effect to implement logics
and wrap them in callbacks and memos for performance.
But you don't need to do that in Svelte.
You can write plain `let` variables and reference or
update them directly.
There is no need to worry about rerendering.

To create an effect on value updates,
write function body that need to be executed and
add dollar sign `$` label to it.
It will run **reactively** whenever values change.

```jsx
let count = 0;
$: {
  console.log(count);
}
$: if(count > 10) {
  console.log('count is over ten!');
}
```

But the point is, the value referenced should be
on the left side of assignments.
It's like Svelte detects reference by
whether values' names are on the left hand side of assignments.

> A simple rule of thumb: the name of the updated variable must appear on the left hand side of the assignment.<br>
> https://learn.svelte.dev/tutorial/updating-arrays-and-objects

> This holds true for Svelte@4,
> but it may change in upcoming Svelte@5.<br>
> See [Svelte runes][svelte-rune] for more.

## Stores
Unlike React, Svelte provides built-in global store feature out of the box.

> A store is an object that allows reactive access to a value via a simple store contract.
> The svelte/store module contains minimal store implementations which fulfil this contract.<br>
> https://svelte.dev/docs/svelte-components

To reference inner value, you can access it by adding a dollar sign in front of it;
whether you read it or assign it. This let Svelte to subcribe to the store.


```jsx
  export const currentTheme = writable<ColorTheme | null>(null);

  const getGithubImgSrc = (currentTheme: typeof $themeStore) => {
    return currentTheme === 'dark' ? '/github-mark-white.svg' : '/github-mark.svg';
  };
  let githubImgSrc = getGithubImgSrc($themeStore);
  $: githubImgSrc = getGithubImgSrc($themeStore);
```

But I am not still used to writing dollar sign `$` in front of Svelte stores.
In that case, I have an alternative; using `set`, `update` and `subscribe` methods on the store.
Check out Svelte/store docs for more: [link](https://svelte.dev/docs/svelte-store)

This built-in global storage shines Svelte over the React.
You do not need to list all the third-party packages and spend time pulling one out of them.

## Callbacks
To add callbacks onto html elements in React, you add attributes such as `onClick`, `onBlur`, ...
In Svelte, things go similar in that you add attributes on html elements.
To add event listeners, you add `on:eventname` attributes and they are called `element directives`.

```jsx
<script>
	let count = 0;

	/** @param {MouseEvent} event */
	function handleClick(event) {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	count: {count}
</button>
```

There are directives other than `on:...`. For example, with `bind:value` property,
you can bind a variable to the html element's `value`.

```jsx
<script>
  let name = '';

  $: {
    console.log(name);
  }
</script>

Your name:
<input bind:value={name}>
```

There are so many directives of a variety in Svelte,
you definitely want to check out official [documentation][svelte-element-directive].

<!-- [TODO] lifecycle -->

[svelte]: https://svelte.dev/
[jekyll]: https://jekyllrb.com/
[svelte-rune]: https://svelte.dev/blog/runes
[svelte-element-directive]: https://svelte.dev/docs/element-directives
