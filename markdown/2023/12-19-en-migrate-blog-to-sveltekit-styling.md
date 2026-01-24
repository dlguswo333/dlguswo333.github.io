---
toc: true
title: "Let's Migrate Github Blog to Sveltekit: Styling"
category: "Programming"
tags: [migrate-blog-to-sveltekit, web, svelte, sveltekit, javascript, css, tailwind]
author:
  - 이현재
---

# tailwind
I have never used [tailwind][tailwind] but heard it is great.
I chose tailwind to add styles to the blog. The reasons behind are these advantages:

- **No need to name class names**<br>
    Programmers always have tough times naming things. CSS class names are no exception.
    I myself think CSS classes are tricky as there are many classes that do the similar things
    but have something that are different from each other.
- **No need to manage CSS files**<br>
    When building an Web App with CSS files, I need to focus on two files:
    one for JavaScripts, another for styles.
    With tailwind I can focus one single file solely as tailwind codes are integrated into JavaScript files.
- **Pre-defined classes are very useful and pretty as they are.**<br>
    This came to me with great advantages. I have used tailwind's pre-defined styles (classes) quite frequently
    and I hardly had to resort to vanilla CSS. Especially, **they are beautiful on their own**.
    I am terrible at choosing colors.
    When I found nice looking color themes online and applied them to my projects,
    they looked awful and I didn't know why.
    Ctrl+C/Ctrl+V magic does not work when it comes to me, and styling.
    But tailwind, the colors, red, slate, blue and etc, they look awesome and pretty.

I followed tailwind's guide to setup in my project: [link][tailwind-guide].

## Caveat
### Class names in the tailwind code should be **statically** extractable.
What we mean by 'static' is that class names should be extractable without executing the code;
the class names should be written in the code as complete unbroken strings.

```jsx
    {/** This don't work since the class names cannot be statically extractable. */}
    <div class={`text-${shouldHighlight ? 'blue' : 'black'}-500`} ...>

    {/** This works since the class names can be statically extractable. */}
    <div class={`${shouldHighlight ? 'text-blue-500' : 'text-black-500'}`} ...>
```

Here is a quote from tailwind documentation:

> The most important implication of how Tailwind extracts class names is that
> it will only find classes that exist as complete unbroken strings in your source files.
>
> If you use string interpolation or concatenate partial class names together,
> Tailwind will not find them and therefore will not generate the corresponding CSS.<br>
> https://tailwindcss.com/docs/content-configuration#dynamic-class-names

You may also use inline styles to evade the problem.

```jsx
    <div style={`color: ${shouldHighlight ? 'red' : 'black'}`} ...>
```

# Supporting Pre-defined Themes
My blog supports two themes, light and dark themes.
tailwind supports `dark` variant. It determines themes based on `prefers-color-scheme` CSS feature,
but the problem is that it does not let users to manually switch themes in an easy way.

Some may say it is good enough already, but why not improve it?
tailwind also supports themes based on existence of `dark` class name in parent HTML elements.
See [docs](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually)
on how to configure tailwind for this.

Then tailwind lets you use dark theme like the code below.
```html
<div class="dark">
    <span class="bg-white dark:bg-black">text</span>
</div>
```

When you support themes in your webpages, one important challenge is
to render themes without flickering when the webpages reload.
Flickering occurs if the theme switching mechanisms execute slower than your webpage loads.
We need to make sure that the theme applies as fast as your webpage loads.

Let me take an example of https://svelte.dev website.
They support theme like below.
It prioritizes a value stored in `localStorage` (user settings),
and then CSS attribute (system settings).

```html
<body data-sveltekit-preload-code="hover">
    <script>
        const themeValue = JSON.parse(localStorage.getItem('svelte:theme'))?.current;
        const systemPreferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';

        document.body.classList.remove('light', 'dark');
        document.body.classList.add(themeValue ?? systemPreferredTheme);
    </script>
```

Notice that the script is inserted right after opening body tag.
This is to ensure the execution order of `setup theme -> render HTML`.
**You need to inject the script code before any other HTML element that are being rendered on screen**.

I wanted to create a separate file for theme script codes
and reference it from `app.html` in Sveltekit.
but it seemed like there is no easy way to do that.<br>
The emitted compiled output html contains the script tag as is;
no transpiling, no src path substitution.

```html
<!-- Source app.html -->
<body data-sveltekit-preload-data="hover">
    <script type="module" src="/src/lib/colorTheme.ts"></script>
    <div id="root">%sveltekit.body%</div>
</body>

<!-- Compiled output -->
<body data-sveltekit-preload-data="hover">
    <script type="module" src="/src/lib/colorTheme.ts"></script>
```

Of course, unless there is the script file served at that path,
Sveltekit will raise an error in build phase.
My best guess is to serve the script file as a static file at the path,
or just inline the code.
I chose to inline the code because the code is short, and needs to be executed anyway.

[tailwind]: https://tailwindcss.com/docs
[tailwind-guide]: https://tailwindcss.com/docs/guides/sveltekit
