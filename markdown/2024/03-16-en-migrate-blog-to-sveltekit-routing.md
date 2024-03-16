---
toc: true
title: "Let's Migrate Github Blog to Sveltekit: Routing"
category: ["Programming"]
tags: [migrate-blog-to-sveltekit, web, svelte, sveltekit, javascript]
author:
  - 이현재
---

Routing (paths, specifically) is one of the essential parts when you create a web app.
You may want to take extra times designing the structure as it is not easy
to change them as every single change may come as a breaking change.
Web browsers remember your web app's URLs or even readers might have saved links to your pages.

# Key Points
There are some key points which I considered when I created my new blog.

**Each routes should not overlap each other**.
Each route (path) should not intrude others' domain.
What I mean by domain are two: semantics and URLs.<br>
There is no way you should have two separate routes `post` and `article`
unless they are completely different.
It would be okay as long as you assign them atomic and meaningful domains.<br>
Also, you are required not to have overlapping URLs.
This sounds so obvious, but this is the point where routes play important roles.
You may exclude unforeseen overlapping URLs in the future with good route designs.
Say you have `post` path and you list posts and show each post on the route.
`post/1`, `post/2`, and `post/how-to-svelte`.
Are you sure your post names and numbers won't overlap?<br>
...Sure, it won't, by 99.999%. But you don't need to risk 0.001% possiblity as you can make it zero.

Also you might want to **consider file structure**.
Recently some of famous web frameworks are introducing folder routing structure.
One of examples is Next.JS 13, [*App Router*][app-router].
Sveltekit uses the same routing mechanisms.
Consider your routes carefully as they are going to be your source folder structure.

The next one is about **Readability**.
URLs are visible to users on web browsers.
They are not meant to be readable, but they look much nicer if they are.

# My Design
Here is my blog's humble design.
![routing](/img/2024-03-16-en-migrate-blog-to-sveltekit-routing/routing-structure.png)

- `/`<br>
    The root page. shows all my blogs in time order, using pagination.
- `/about`<br>
    Shows information about me. This renders a markdown file.
- `/post/{year}{post-name}`<br>
    This is to distinguish from `/posts`.
    I did not want to include year in the URL path at first, but it was necessary to find markdown files in the file structure easily.<br>
    The file path for blog post is `/post/{year}/{lang}-{month}-{date}-{post-name}`. For example, if there is a post file at `markdown/2023/01-01/eng-learn-svelte.md`, the designated URL path is `/2023/01-01-eng-learn-svelte`.<br>
    I thought about giving language a separate URL segment, but it would give readers a falsy impression that each post is provided with multiple languages but I am lazy. The `lang` follows [*ISO 639-2 Code*][iso-639-2-code].
- `/posts/{num}`<br>
    This is where paginated post lists are rendered.
- `/categories`<br>
    Contains all the categories and posts with each category. No pagination.
- `/tags`<br>
    Contains all the tags and posts with each category. No pagination.

# Sveltekit Routing
As I mentioned earlier[link][svelte-routing]
Basically you create a folder `src/routes` which will be your app's root
and each nested folder will be also a nested path.

>You can change `src/routes` to a different directory by editing the project config.
>See `routes` option in Sveltekit config [document][svelte-document].

[app-router]: https://nextjs.org/docs/app/building-your-application/routing
[svelte-routing]: https://kit.svelte.dev/docs/routing
[svelte-document]: https://kit.svelte.dev/docs/configuration
[iso-639-2-code]: https://www.loc.gov/standards/iso639-2/php/code_list.php
