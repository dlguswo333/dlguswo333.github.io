---
toc: true
title: "Svelte '<style>' String Bug"
category: "Programming"
tags: [web, svelte, sveltekit, javascript]
author:
  - 이현재
---

When I started using Svelte for replacement of React,
I thought it will ease me from mitigating edge cases and trivial issues that I had met using React.
But there is no such thing as a flawless thing. Svelte is not free from trivial issues.

Add `<style> aaa </style>` string inside your Svelte script tag like below and render it.
```jsx
<script lang="ts">
  const a = '<style> aaa </style>';
  console.log(a);
</script>
<div>Test</div>
```

<br>

With vite-plugin-svelte@6.2.1, it will not work showing an error like below,
even though you just logged it or even you did not use the variable.
```markdown
Internal server error: Error while preprocessing Test.svelte
  - [postcss] Test.svelte.vite-preprocess.css:1:2: Unknown word aaa
  Plugin: vite-plugin-svelte:preprocess
```

<br>

According to **<https://github.com/sveltejs/svelte/issues/5292>**,
This happens because Svelte preprocessor tries to actually parse it as a style tag.
Since it is regex based, we can workaround this by making the string more ***implicit***.

```jsx
<script lang="ts">
  const a = '<styl' + 'e> aaa </styl' + 'e>';
  console.log(a);
</script>
<div>Test</div>
```
