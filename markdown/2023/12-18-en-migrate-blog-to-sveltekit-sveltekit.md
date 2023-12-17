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
  Client Side Rendering for smooth page transitions, and Server Side Generation for performance and search engine optimization. Jekyll supports SSG, for sure. But does it support CSR? It might, but would I be able to write Ruby codes to add CSR feature?

[svelte]: https://svelte.dev/
[jekyll]: https://jekyllrb.com/
[tailwind]: https://tailwindcss.com/docs
[remark-frontmatter]: https://unifiedjs.com/explore/package/remark-frontmatter/
[unfiedjs]: https://github.com/unifiedjs/unified
[mdsvex]: https://mdsvex.com/
[rehype-prism-plus]: https://github.com/timlrx/rehype-prism-plus
[rehype-raw]: https://unifiedjs.com/explore/package/rehype-raw/
