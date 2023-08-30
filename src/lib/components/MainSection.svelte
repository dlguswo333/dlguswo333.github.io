<script lang="ts">
  import {onMount} from 'svelte';
  import {activeHeadingIndex, shouldShowTOCButton} from '$lib/store';
  import throttleWithLast from '$lib/throttleWithLast';

  /** Raw html in `string` type */
  export let html: string | null = null;
  /** Additional class to add. */
  export let className: string | null = null;
  /** If toc data exists, it means it needs show toc button. */
  export let tocDataExists: boolean = false;

  let mainHtml: HTMLElement | null = null;
  const refreshInterval = 50;
  onMount(() => {
    if (!tocDataExists || !mainHtml) {
      return;
    }
    $shouldShowTOCButton = true;
    const headings = [...mainHtml.querySelectorAll('h1,h2,h3,h4')];
    const onScroll = throttleWithLast(() => {
      headings.some((heading, index) => {
        // Mark the last heading as active that sits before the middle line of window.
        if (heading.getBoundingClientRect().top > window.innerHeight / 2) {
          $activeHeadingIndex = Math.max(Number(index) - 1, 0);
          return true;
        } else if (index === headings.length - 1) {
          $activeHeadingIndex = Number(index);
        }
      });
    }, refreshInterval);
    document.addEventListener('scroll', onScroll);
    return () => {
      $shouldShowTOCButton = false;
      document.removeEventListener('scroll', onScroll);
    };
  });
</script>
<!--
@component
Render raw html in main section.
-->
<main class={`max-w-[900px] w-full py-2 ${className ? className : ''}`} bind:this={mainHtml}>
  <slot />
  {#if html}
    {@html html}
  {/if}
</main>
