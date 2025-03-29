---
toc: true
title: "Let's Migrate Github Blog to Sveltekit: TOC and Highlight"
category: ["Programming"]
tags: [migrate-blog-to-sveltekit, web, svelte, sveltekit, javascript]
author:
  - 이현재
---

![toc](/img/2025-03-29-en-migrate-blog-to-sveltekit-toc-and-highlight/toc.jpg)

I think Table of Contents (In short TOC) is the key feature in posts.
It helps users spot the key points, catch where they are reading right now,
and jump between the sections easily.

Yes, my blog as of now has TOC with markdown files and it highlights the current heading,
but in a particularly special form.<br>
In this post, I will explain the how to implement TOC and this specific highlighter.

# TOC Implmentation Structure
![logic-structure](/img/2025-03-29-en-migrate-blog-to-sveltekit-toc-and-highlight/logic-structure.png)
The image shows structure of how the TOC is implemented.
When`+page.svelte` requests TOC data from `page.server.ts`
and the server `load` function calls `getHtmlFromMarkdown` function.
This util-like function parses markdown string with unified, remark and rehype.
It gets HTML from markdown, grabbing for headings in the markdown at the same time.

Let's see the details from top to bottom.

# Markdown Parsing
the main feature of util function `getHtmlFromMarkdown` is to get HTML string from markdown string.
However, if the flag is specified, it also gets headings
from markdown which are used as data for rendering TOC.

You don't necessarily need to get headings with unified library;
you can parse the markdown string by yourself, like using regular expressions.
But I wanted consistent results between the post in HTML and headings in the TOC,
so I got HTML and headings from the same function.

```ts {34-55}
const headingTagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const getTextFromHeading = (node: Element) => {
  let text = '';
  node.children.forEach((child) => {
    if (child.type === 'text') {
      text += child.value;
    } else if (child.type === 'element') {
      text += getTextFromHeading(child);
    }
  });
  return text;
};

export const getHtmlFromMarkdown = async (markdown: string, includeToc: boolean) => {
  const compiler = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeMathjax)
    .use(rehypePrism, {showLineNumbers: true})
    .use(rehypeGithubAlert)
    .use(rehypeStringify, {allowDangerousHtml: true});

  const headings: TOCItem[] = [];

  const result = compiler.parse(markdown);
  const root = await compiler.run(result);
  if (includeToc) {
    root.children.forEach((child) => {
      if (child.type === 'element') {
        if (headingTagNames.includes(child.tagName)) {
          const headingDepth = Number(child.tagName[1]);
          if (headingDepth > maxHeadingDepthInToc) {
            return;
          }
          const headingText = getTextFromHeading(child);
          // unifiedjs converts double quotes into &#x22; (XML character entity)
          // while Sveltekit converts into &quot; (HTML entity)
          // On actual browsers they work fine,
          // but SvelteKit does not detect and discern one from the other;
          // thus it emits errors that elements with same ids cannot be found while building.
          const headingId = removeXSSCharacters(
            `${getHeadingPrefix(headings.length + 1)}${headingText}`.replaceAll(' ', '-')
          );
          if (child.properties) {
            child.properties.id = headingId;
          } else {
            child.properties = {};
            child.properties.id = headingId;
          }
          headings.push({depth: headingDepth, id: headingId, text: headingText});
        }
      }
    });
  }

  const html = compiler.stringify(root);
  return {html: String(html), tocData: includeToc ? headings : []};
};
```

Executing `compiler.run` returns HTML tree (hast tree) and
the variable `root` points to the root node in the tree.
Starting from the root node, it traverses the whole tree searching for heading elements.

`id` property from each heading is obtained from the text of the heading for human readabilty.
Notice the function `getTextFromHeading`. Since the heading can have children
just like other nodes, you shouldn't handle them as simple text nodes.
Removing XSS characters and the long comments are about resolving discrepancy between
unified and Sveltekit, rather than protecting from XSS (it's my post anyway).

`getHtmlFromMarkdown` returns an object along with `html` and `tocData` properties.
`tocData` is the very property for TOC and the type is of `{depth: number; id: string; text: string}[]`.

# Pass Parse Results to Svelte Components
The markdown string is stored as a file inside the project repository
and they are fetched using `fs.readFile`.
Therefore, since `getHtmlFromMarkdown` function can only run on server-side,
I call `getHtmlFromMarkdown` function in `load` function defined in `+page.server.ts`.

It doesn't mean it will not work on client-side navigation, Sveltekit will try to load
the data from the server, but the data shall be serializable.

Refer to <https://svelte.dev/docs/kit/routing#page-page.server.js>
for more information about `load` function in Sveltekit,
and this is the part of `load` function from my blog source code.
There is no complicated logic here.

```ts
export const load: PageServerLoad = async ({params}) => {
  // Code skipped in the interest of space...
  try {
    const {date, lang, id} = getDateLangIdFromPostPath(postFilePath);
    const frontmatter = await getFrontmatterFromMarkdown<Frontmatter>(rawContent);
    const {html, tocData} = await getHtmlFromMarkdown(rawContent, !!frontmatter?.toc);
    const langs = await getAvailableLanguagesOfPost(postFilePath);
    return {html, frontmatter, date, lang, id, tocData, langs};
  } catch (e) {
    console.error(e);
    error(500);
  }
}
```

# Render TOC
In the corresponding `+page.svelte`, you render TOC component.

```jsx
<script>
  let {data} = $props();
</script>
  {#if data.tocData}
    <TOC data={data.tocData} />
  {/if}
```

Rendering TOC as HTML is not that special,
you may render them as `li`s inside a `ul`, or just `div`s.
I think I can skip details here.

# Highlight
TOCs are prevalent; you can spot them on many webpages other than my blog.
But I can proudly claim that the highlight on my blog is very special.
Instead of highlighting one heading, I show a vertical bar that
reflects the current scroll position dynamically.

<video controls src="/img/2025-03-29-en-migrate-blog-to-sveltekit-toc-and-highlight/toc.mp4" alt="toc"></video>

## Motivation
Normally, on most of webpages, single heading is highlighted.
Most of the times, it gets the job done, but on occasion, this is not enough.

- When the section with the heading is too long (Am I near the end of this section? Or 50%?)
- When there are many headings in the current viewport (Which one should you highlight? The one at the top or middle? What about the bottom one?)

I've been interested with solving such problems and came up with a solution
to ***highlight range*** rather than a heading.
So the top of the highlight corresponds to the top of the viewport,
while the bottom of the highlight to the bottom of the viewport.

## Calculating Values
![calculating-values](/img/2025-03-29-en-migrate-blog-to-sveltekit-toc-and-highlight/calculating-values.png)
For simplicity, I restricted each heading element in TOC to have same height.

1. Get the viewport top and bottom values in pixel.
2. Get the first and last sections inside the viewport with height information.
3. We get the first section's heading: $first\ heading$.
4. We get the last section's heading: $last\ heading$.
5. Get the first and the last section's heights in the viewport. We call them $first\ section\ height$ and $last\ section\ height$.
6. For the first heading in the viewport, highlight this amount of $alpha$:<br>
$$alpha=\frac{(viewport\ top)-(first\ heading\ pos)}{(first\ section\ height)}$$
7. For the last heading in the viewport, highlight this amount of $beta$:<br>
$$beta=\frac{(viewport\ bottom)-(last\ heading\ pos)}{(last\ section\ height)}$$
8. Make sure to bound the two values between 0 and 1 to mitigate unknown exceptions.<br>
$$min(1, max(0, (value)))$$
9. The values are top and bottom values of the highlight.<br>
$$top=(TOC\ item\ height)*((alpha)+(first\ heading\ index))$$<br>
$$bottom=(TOC\ item\ height)*((beta)+(last\ heading\ index))$$

This is quite straight forward but you need to care some exceptions.
- **There is no heading**<br>
    There is nothing we can do about it. TOC would not draw anything anyway.
- **There is a gap between the post top and the first heading position**<br>
    In this case you insert an imaginary heading at the first.
- **The top and bottom values are incorrect, NaN or Infinity.**<br>
    In this case, there is nothing we can do. It might because our math is incorrect or some unexpected exceptions occur. We bound the value between 0 and maximum values or do not draw in this case.

## Render Highlight
Once we got the values it's time to draw the highlights.
First things first, I observed scroll event for that sequence
and saved the result in global store since I got and used the values in different components.

```ts
export type HeadingHighlight = {
  top: number;
  bottom: number;
}

export const headingHighlight = writable<HeadingHighlight | null>(null);
```

<br>

The code below is from the component where the post is rendered as raw HTML.
This component has the logics for retrieving and calculating the values.
There are a few edge cases that need special handlers
and that is why the code is so long and complicated.
```tsx
  const getHeadingSelector = () => {
    return Array.from({length: maxHeadingDepthInToc})
      .map((_, ind) => (`h${ind + 1}:not(*[data-footnotes] *)`))
      .join(', ');
  };
  const headingSelector = getHeadingSelector();
  let headings: Element[] = $state([]);
  const throttledUpdateHeadingHighlight = throttleWithLast(() => updateHeadingHighlight(), refreshInterval);

  const updateHeadingHighlight = () => {
    if (!$tocItemHeight) {
      return;
    }
    let firstHeading: null | Element = null;
    let lastHeading: null | Element = null;
    let firstHeadingTop = 0;
    let firstHeadingIndex = 0;
    let lastHeadingTop = 0;
    let lastHeadingIndex = 0;
    let firstSectionHeight = 0;
    let lastSectionHeight = 0;

    headings.some((heading, index) => {
      const headingTop = heading.getBoundingClientRect().top;
      const nextHeading = headings[index + 1];
      const nextHeadingTop = nextHeading?.getBoundingClientRect().top ?? mainHtml?.getBoundingClientRect().bottom;

      const isThisFirstHeading =
        headingTop <= 0 && (!nextHeading || 0 < nextHeadingTop);
      if (firstHeading === null && isThisFirstHeading) {
        firstHeadingIndex = index;
        firstHeading = heading;
        firstHeadingTop = headingTop;
        firstSectionHeight = nextHeadingTop - headingTop;
      }

      const isThisLastHeading =
        headingTop < window.innerHeight && (!nextHeading || window.innerHeight < nextHeadingTop);
      if (lastHeading === null && isThisLastHeading) {
        lastHeadingIndex = index;
        lastHeading = heading;
        lastHeadingTop = headingTop;
        lastSectionHeight = nextHeadingTop - headingTop;
        // The first and last headings have been found thus no need to continue looping.
        return true;
      }
    });

    const highlightTopOffset = (0 - firstHeadingTop) / firstSectionHeight;
    const highlightBottomOffset = (window.innerHeight - lastHeadingTop) / lastSectionHeight;
    const highlightTop = $tocItemHeight * (highlightTopOffset + firstHeadingIndex);
    const highlightBottom = $tocItemHeight * Math.min(
      lastHeadingIndex + highlightBottomOffset,
      lastHeadingIndex + 1 // Prevent highlight overflows parent underneath.
    );

    $headingHighlight = {top: Math.floor(highlightTop), bottom: Math.floor(highlightBottom)};
  };

<main class={`max-w-[900px] w-full py-2 ${className ? className : ''}`} bind:this={mainHtml}>
  {@render children?.()}
  {#if html}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
  {/if}
</main>
```

<br>

And this is the code for TOC component.
```tsx
<script lang="ts">
  import {headingHighlight} from '$lib/store';

  let highlightTop: number | undefined = $state(undefined);
  let highlightBottom: number | undefined = $state(undefined);
  $effect(() => {
    highlightTop = $headingHighlight?.top;
    highlightBottom = $headingHighlight?.bottom;
  });
</script>

    {#if highlightTop !== undefined && highlightBottom !== undefined}
      <div class={'absolute left-0 flex'} style={`transition: top 0.1s ease-out, height 0.1s ease-out; top: ${highlightTop}px; height:${highlightBottom - highlightTop}px`}>
        <div class="z-10 rounded-xl bg-blue-400 dark:bg-purple-500 w-1 h-full"></div>
        <div class="z-5 absolute left-0.5 w-6 h-full bg-gradient-to-r from-blue-100 dark:from-fuchsia-900 to-transparent"></div>
      </div>
    {/if}
```

# Postscript
The code is quite complicated and I believe there can be more improvement to that.
What I want to tell you in this post is the idea, how you may highlight TOC in an ingenious way.
You can check the full code of my blog on my Github.
