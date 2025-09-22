---
toc: true
title: "Render Markdown in Svelte Component"
category: ["Programming"]
tags: [web, svelte, sveltekit, javascript]
author:
  - 이현재
---

Okay, I have finished [migrating my Github blog to Sveltekit][migrate-blog-to-sveltekit],
and it has been doing fine so far.

One problem is my pages do not appear on Google search for unknown reasons
even though I have sitemap in txt format.
I have been handling the issues manually for several years but I don't know the exact reason why.
That's another problem that I need to take care of.

In this post I am going to talk about different topic, rendering Markdown in Svelte component.

# Markdown is Rendered in Raw HTML as of Now
I have written blog posts written in Markdown. They are rendered in Svelte context,
but not *in Svelte way*. They are transformed into raw HTML string and injected into Svelte
using `{@html html}` syntax: ([Svelte document][svelte-html-syntax]).
Even though they are rendered inside Svelte, they are not compiled into Svelte code.

>To inject raw HTML into your component, use the `{@html ...}` tag.x\
>It also will not compile Svelte code.\
><https://svelte.dev/docs/svelte/@html>

# What's the Problem with Raw HTML?

Rendering into raw HTML string is good enough, but it doesn't allow me to redefine HTML elements in Svelte.
I Need to handle them in *unified* or *HTML* ways.
Most of time that might be a problem. I am already creating table of contents with my custom unfied plugin.
But what if it requires some interactivities, like click event listeners?
Sure, you can do that with native DOM APIs. Well, that blurs the whole points of using Svelte.
Defining Svelte components and using them for rendering Markdown will be really great.

# How to Render in Svelte Component
To render Markdown into Svelete component, I can get html syntax tree from *unified* compiler and traverse the tree. *remark-rehype* plugin returns a HTML syntax tree like below.
`tagName` represent corresponding HTML tag and I can render text upon `type: 'text'` node.
```js
{
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [Array],
      position: [Object]
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [Array],
      position: [Object]
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [Array],
      position: [Object]
    },
    ...
```

<br>

I need to create a recursive Svelete component because I need to traverse hast tree and render children as children. The component below is not perfect implementation but it works on my simple *about* page.\
Svelte has a nice tag `svelte:component` which lets you render an arbitrary, generic HTML element. You inject the tag with `this` property.\
Also I created a snippet component called `Child` to render children. It renders `Self` for each child node.
If I want to customize some HTML tags, I can add `if node.tagName === '<TAG_NAME>'` statements on them. Pretty simple.
```jsx
<script lang="ts">
  import type { Parent, RootContent } from 'hast';
  import Self from './Markdowner.svelte';

  interface Props {
    node: Parent | RootContent;
  }
  const {node}: Props = $props();
</script>

{#snippet Child()}
  {#if 'children' in node}
    {#each node.children as child}
      <Self node={child} />
    {/each}
  {/if}
{/snippet}

{#if node.type === 'raw' && typeof node.value === 'string'}
  {@html node.value}
{:else if 'tagName' in node}
    <svelte:element this={node.tagName} {...node.properties}>{@render Child()}</svelte:element>
{:else if 'value' in node}
  {node.value}
{:else}
  {@render Child()}
{/if}
```

>[!note]
>There is `{@html}` syntax inside the component. This is to render raw HTML inside Markdown; for instance `<br>`.

<br>

And I hand over the hast node tree from `load` server function,
and inject it to the component as a property and it is ready to go.

```jsx
  let {
    html = null,
    root = null,
    className = null,
    tocDataExists = false,
    children,
  }: Props = $props();

  <!-- ... -->

  {#if root}
    <Markdowner node={root} />
  {:else if html}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
  {/if}
```

<br>

The image below compares results rendered in raw HTML and in Svelte component.
As you can see they show the same output.
![compare](/img/2025-09-21-en-render-markdown-in-svelte/compare.png)

However I wouldn't do this because there can be many edge cases. What if some properties are nested arrays? How about nested objects? There are too many edge cases that need to be handled.

[migrate-blog-to-sveltekit]: /tags/#migrate-blog-to-sveltekit
[svelte-html-syntax]: https://svelte.dev/docs/svelte/@html
