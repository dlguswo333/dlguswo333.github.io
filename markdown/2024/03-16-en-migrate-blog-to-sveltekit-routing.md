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
Web browsers remember your website's URLs or even readers might have saved links to your pages.

# Key Points
There are some key points which I considered when creating my new blog.

**Each routes should not overlap each other**.<br>
Each route (path) should not intrude on others.
What I mean by domain are these two: semantics and URLs.<br>
There is no need you should have two separate routes `post` and `article`
unless they are completely different in the context.
Each domain should have distinct semantic.<br>
Also, you are required not to have overlapping URLs.
This sounds so obvious, but this is the point where routes play important roles.
Good route designs can exclude unforeseen overlapping URLs in the future.
Some endpoints may have the same name thus the same end path,
but it will be okay as long as they are served at different parent paths!

![routing](/img/2024-03-16-en-migrate-blog-to-sveltekit-routing/good-routing-design.png)

Also you might want to **consider file structure**.<br>
Recently some of famous web frameworks are introducing folder routing structure.
One of examples is Next.JS 13, [*App Router*][app-router].
Sveltekit uses the same routing mechanisms.
So consider your routes carefully as they are going to be your source code folder structure.

The last one is about **Readability**.<br>
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
    This is distinct from `/posts`.
    I did not want to include year in the URL path at first, but it was necessary to find markdown files in the file structure easily.<br>
    The file path for blog post is `/post/{year}/{lang}-{month}-{date}-{post-name}`. For example, the URL path for a post file `markdown/2023/01-01/eng-learn-svelte.md` is `/2023/01-01-eng-learn-svelte`.<br>
    I thought about giving language a separate URL segment, but it would give readers a falsy impression that each post is provided with multiple languages but... I am lazy. The `lang` follows [*ISO 639-2 Code*][iso-639-2-code].
- `/posts/{num}`<br>
    This is where paginated post lists are rendered.
- `/categories`<br>
    Lists every category per each category. No pagination.
- `/tags`<br>
    Lists every post per each tag. No pagination.

>Category and tag are different.
>category : post is 1:N relation but tag : post is M : N relation.
>A post may have up to one category but many tags.

# Sveltekit Routing
First check out Sveltekit [routing document][svelte-routing].
As I mentioned earlier basically you create a folder `src/routes` which will be your app's root
and each nested folder will be also a nested path.

>You can change `src/routes` to a different directory by editing the project config.
>See `routes` option in Sveltekit config [document][svelte-document].

In each route, you make `+page.svelte` file; it becames a visitable page.
It means `+page.svelte` file at `src/routes` directory creates the root page.

>Every `+page.svelte` file inside `src/routes` creates a page in your app.<br>
><https://learn.svelte.dev/tutorial/pages>

The key point of `+page.svelte` is that it does not show up at nested paths.
Say you have a header component that will be visible at every path.
Even if you do, you do not need to include the header component in every `+page.svelte` file,
you can do that with single `+layout.svelte` file.

`+layout.svelte` is a file where you can declare the common component at the path and its all child paths.

```jsx
<Header />
<Slot />
```

`<Slot /> is where each `+page.svelte` will be rendered.

But a question arises here: Where should the header component file be placed?
Sveletekit document tells us to put it to the topmost directory where it is used.
If the topmost path is `/`, it would be best to be placed at `src/routes/` directory.

Also, if the same component is shared among different paths (eg. `/post/author`, `/about/me`),
it recommends placing the file to someplace else so referers can easily import them such as `lib` folder.

>Because SvelteKit uses directory-based routing, it's easy to place modules and components alongside the routes that use them. A good rule of thumb is 'put code close to where it's used'.<br>
>...<br>
>Sometimes, code is used in multiple places. When this happens, it's useful to have a place to put them that can be accessed by all routes without needing to prefix imports with `../../../../`. In SvelteKit, that place is the `src/lib` directory. Anything inside this directory can be accessed by any module in `src` via the `$lib` alias.<br>
><https://learn.svelte.dev/tutorial/lib>


## `trailingSlash`
It's also important to note that sometimes, trailing slash in URL matters.
To put it simple with an example,
it's about which one path `/a` or `/a/` should be accessible and
html file being served at the path should be placed as `/a/index.html` or `/a.html`.
It's not just about which URL is *looking cool*, your link may be broken with 404 error.

Be aware that which URL is accessible depends on which hosting provider your website is hosted.

Check out Sveletekit's `trailingSlash` layout option [document][svlete-trailing-slash].
Also this [trailing slash guide][trailing-slash-guide]. This guide is highly valuable.

[app-router]: https://nextjs.org/docs/app/building-your-application/routing
[svelte-routing]: https://kit.svelte.dev/docs/routing
[svelte-document]: https://kit.svelte.dev/docs/configuration
[svlete-trailing-slash]: https://kit.svelte.dev/docs/page-options#trailingslash
[iso-639-2-code]: https://www.loc.gov/standards/iso639-2/php/code_list.php
[trailing-slash-guide]: https://github.com/slorber/trailing-slash-guide
