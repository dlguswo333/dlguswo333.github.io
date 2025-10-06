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
but not *in a Svelte way*. They are transformed into raw HTML string and injected into Svelte
using `{@html html}` syntax: ([Svelte document][svelte-html-syntax]).
Even though they are rendered inside Svelte, they are not compiled into Svelte code.

>To inject raw HTML into your component, use the `{@html ...}` tag.x\
>It also will not compile Svelte code.\
><https://svelte.dev/docs/svelte/@html>

# Problems with Raw HTML?
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

I need to create a recursive Svelete component because I need to traverse hast tree and render children as children.
The component below is not perfect implementation but it works on my simple *about* page.\
Svelte has a nice tag `svelte:component` which lets you render an arbitrary, generic HTML element. You inject the tag with `this` property.

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
![compare](/img/2025-10-06-en-render-markdown-in-svelte/compare.png)

<br>

But there were many edge cases that I needed to handle.
Some properties like `className` need to be handled explicitly.
`className` is an array of strings and also, its key should be translated into `class`.
Such are the exceptions I need to take care.

## Raw HTML String into Proper Node
I have some raw HTML inside Markdown such as `<br>` and `<kbd>TEXT</kbd>`.
`<br>` does not give me any error while `<kbd>` does.
This is because `<kbd>TEXT</kbd>` are converted into nodes that is not compatible with Svelte's `{@html}` syntax.\
Let's say we have the following Markdown string.
```markdown
<kbd>Hello</kbd>
<br>
World
```

<br>

And if we convert it with *unified* we get this:
```js
[
    {
        "type": "raw",
        "value": "<kbd>",
    },
    {
        "type": "text",
        "value": "Hello",
    },
    {
        "type": "raw",
        "value": "</kbd>",
    },
    {
        "type": "text",
        "value": "\n",
    },
    {
        "type": "raw",
        "value": "<br>",
    },
    {
        "type": "text",
        "value": "\nWorld",
    }
]
```

<br>

`<kbd>` and `</kbd>` are separated into two distinct nodes and I feed `{@html}` one node at a time.
`{@html}` expects [valid standalone HTML][svelte-html-syntax] and that's why it does not render correctly.

This can be resolved by parsing raw HTML into proper node in the syntax tree.
*rehype-raw* plugin converts raw HTML into a rehype node in the tree.
If I add the plugin into the parsing procedure I get this.
Notice that `<kbd>` are transformed into single node with a child text node `'Hello'`.
```js
[
    {
        "type": "element",
        "tagName": "kbd",
        "properties": {},
        "children": [
            {
                "type": "text",
                "value": "Hello",
            }
        ],
    },
    {
        "type": "text",
        "value": "\n",
    },
    {
        "type": "element",
        "tagName": "br",
        "properties": {},
        "children": [],
    },
    {
        "type": "text",
        "value": "\nWorld",
    }
]
```

## Fix SVG not Rendered Correctly
I found that for some reason SVG are not rendered correctly. 
Even though it has a proper `d` property it does not show up in the inspection tool as if it wasn't set up.
![svg d property](/img/2025-10-06-en-render-markdown-in-svelte/svg_d_property.png)

<br>

It turns out that Svelte may not know what namespace it should be in
when rendering arbitary SVG elements with `<svelte:element />`.

>Svelte tries its best to infer the correct namespace from the element’s surroundings, but it’s not always possible.\
>[svelte-element]

So I created a separate twin Markdown renderer component with `<svelte:options namespace="svg" />` in it.


[migrate-blog-to-sveltekit]: /tags/#migrate-blog-to-sveltekit
[svelte-html-syntax]: https://svelte.dev/docs/svelte/@html
[svelte-element]: https://svelte.dev/docs/svelte/svelte-element
