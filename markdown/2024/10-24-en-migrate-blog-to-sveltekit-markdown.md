---
layout: post
toc: true
title: "Let's Migrate Github Blog to Sveltekit: Markdown"
category: ["Programming"]
tags: [migrate-blog-to-sveltekit, web, svelte, sveltekit, javascript, markdown]
author:
  - 이현재
---

The most important point when it comes to making a blog. Show your blog posts.

Before migrating to Sveltekit I had been using Jekyll with Markdown files.
I wanted to port the Markdown files as-is, so I needed to somehow render
Markdown contents into HTML.

# Markdown → HTML
Even though Markdown is often praised for having relatively simple grammars
and syntaxes, it is not easy to parse Markdown and transpile into HTML on one's own.
So I chose to find a Markdown library that fits my need.

Thankfully there are many Markdown libraries in JS world.
There are [marked][marked], [markdown-it][markdown-it], ...<br>
Amongst many great libraries I chose [unifiedjs][unifiedjs].

# unifiedjs

[unifiedjs][unifiedjs] is not just a Markdown → HTML library.
It receives various input sources including Markdown, HTML, or plain text
and construct into structured data. There are tons of plugins for that process
and they are developed for solely unifiedjs.<br>
It might sound to be a overkill if all you want is translating Markdown into HTML.
But you may granuarly want to do something in the process;
check syntax tree and edit contents, enforce some rules.
With unifiedjs you can do that by importing plugins or writing one for yourself.<br>
For me I wanted to get frontmatter objects inside Markdown contents.
I was able to do that with [remark-frontmatter][remark-frontmatter] plugin.

You may learn more about unifiedjs at its website, but to give an example,
The following codes are my blog source codes.


```ts
import {unified} from 'unified';
import remarkParse from 'remark-parse';
// More imports...

const compiler = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeMathjax)
  .use(rehypePrism, {showLineNumbers: true})
  .use(rehypeStringify, {allowDangerousHtml: true});
```

<br>

If you read unifiedjs's documentation, `compiler.parse()` returns a syntax tree
and `compiler.run` returns a syntax tree with transformation applied.
`compiler.stringify` gives you a final output; in the code below it is HTML code in JS string.
Then you inject the string into Svelte with `{@html}` tag.
As mentioned in the code, you are injecting raw `html` code into your page.
Be careful not to inject some malicious script codes in your Markdown.
```ts
const root = await compiler.run(compiler.parse(markdown));
const html = compiler.stringify(root); // <p>This is serialized html</p> ...

// .svelte file
{@html html} // Careful it is not safe from XSS.
```

<br>

In Markdown → HTML process you need the following fundamental plugins to take each step.
1. `remark-parse`: Parse Markdown raw contents into Markdown syntax tree
2. `remark-rehype`: Transform Markdown syntax tree into HTML syntax tree
3. `rehype-stringify`: Compile HTML syntax tree into serialized string

![unifiedjs-graph](/img/2024-10-24-en-migrate-blog-to-sveltekit-markdown/unifiedjs-graph.png)

# Getting the Summary
![summary](/img/2024-10-24-en-migrate-blog-to-sveltekit-markdown/summary.png)

You might have noticed that my blog shows summaries of posts in main page.
For this I decided to get texts from a remark syntax tree.

I parsed a Markdown file and examined the resultant remark syntax tree.
From the syntax tree I found out the syntax tree is nested JS objects where
the top node is of `type: 'root'` and each node points their children with `children` key.
I visited each node and selected text nodes and concatenated internal values.

```ts
const getSummaryFromMarkdown = async (markdown: string, targetLength: number) => {
  let summary: string | null = null;

  const visit = (node: Content) => {
    if (summary && summary.length >= targetLength) {
      // Summary is long enough thus stop.
      return;
    }
    if (node.type === 'heading' || node.type === 'yaml') {
      // No need to visit these nodes recursively.
      return;
    }
    if (node.type === 'text' || node.type === 'inlineCode') {
      // Get text values and append to the summary.
      const text = node.value.trim();
      if (text) {
        summary = summary === null ? text : `${summary} ${text}`;
      }
    }
    if (!('children' in node)) {
      return;
    }
    node.children.forEach(visit);
  };

  const compiler = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (root: Root) => {
      visit(root);
    });
  const root = compiler.parse(markdown);
  compiler.run(root);
};
```

[marked]: https://marked.js.org/
[markdown-it]: https://www.npmjs.com/package/markdown-it
[unifiedjs]: https://unifiedjs.com/
[remark-frontmatter]: https://github.com/remarkjs/remark-frontmatter
