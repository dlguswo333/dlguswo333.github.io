---
layout: post
toc: true
title: "Prevent Color Theme Button Flickering"
category: ["Programming"]
tags: [javascript, svelte, sveltekit, html, css]
author:
  - 이현재
---

My blog support light and dark themes.
You click the color theme button inside the header and it updates without reloading, seamlessly.
It all thanks to client Javascript.

My blog is written with Sveltekit and it is required to
prerender HTML because there is no running server
and the HTML is updated with client side codes.
Color theme button is no exception and here is the point
where the problem arises.
Because when the server prerenders HTML, it has no way
to know which color theme clients are going to use.

Here are steps my blog is rendered on browsers.
First browsers handle prerendered HTML.
Then the inline script inside the `body` tag is going to run
and it prepares to render pages in according to light/dark themes.
[Post you might interest](/post/2023/12-19-en-migrate-blog-to-sveltekit-styling)

The color theme button has something different from other components.
Since the server does not know the current theme, it renders an empty button
and only on browsers will it update HTML by grabbing the current theme from `localStorage`.
It is also possible instead of rendering `null` to render one of `light` or `dark` randomly,
but I thought it is not a good idea to show the invalid button on browsers
with the opposite theme configured; that is why I render an empty button.

```jsx
{#if currentTheme === 'dark'}
  {/** Render button for light mode */}
{:else if currentTheme === 'light'}
  {/** Render button for dark mode */}
{:else}
  {/** Render empty button (server only) */}
{/if}
```

![before-phases.png](/img/2024-12-25-en-how-to-prevent-flickering-color-theme-button/before-phases.png)

In the meantime, that is, after the page is painted before browsers update it
there is a **mismatch** and it will **flicker** on update.

<video controls alt="before" src="/img/2024-12-25-en-how-to-prevent-flickering-color-theme-button/before.mp4"></video>
<br><br>

Even though I tried to solve this it is not possible to know the configured themes on prerender phase.
It is not a good idea not to postpone rendering HTML before browsers update them,
no matter it is possible or not.
Prerender is to render pages as fast as possible and
it is just too much to lose just because of the flickering theme button.

The solution is quite simple.
To figure out how other websites mitigated this issue
I referred to react official documentation site [react.dev](https://react.dev).
react.dev also branches off renderings in according to the current selected theme just like I did,
but unlike I did with Javascript it branches off with CSS classes.
This solution is ready-to-apply to my blog which prepares for theme rendering synchronously with inline scripts.

![after-phases.png](/img/2024-12-25-en-how-to-prevent-flickering-color-theme-button/after-phases.png)

I deleted branching scripts and applied tailwind `dark:hidden` class to the HTML tags
which should appear on light theme, and `hidden dark:block` classes to the ones on dark theme.

```jsx
<button title="Click to activate dark mode" class="dark:hidden">
  {/** Render button for dark mode */}
</button>
<button title="Click to toggle to light mode" class="hidden dark:block">
  {/** Render button for light mode */}
</button>
```

<video controls alt="after" src="/img/2024-12-25-en-how-to-prevent-flickering-color-theme-button/after.mp4"></video>

Now flickering went away on refresh!
I could remove the empty button because there are no flickering and mismatch renderings.
As a matter of facts, it is not that difficult.
On the contrary, I could have applied this solution without realizing
if I had perceived the component as just another normal component that supports light/dark themes.
