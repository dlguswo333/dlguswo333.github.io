<script lang="ts">
  import {onMount} from 'svelte';
  import {shouldShowTOCButton} from '$lib/store';
  import throttleWithLast from '$lib/throttleWithLast';

  /** Raw html in `string` type */
  export let html: string | null = null;
  /** Additional class to add. */
  export let className: string | null = null;
  /** If toc data exists, it means it needs show toc button. */
  export let tocDataExists: boolean = false;

  let mainHtml: HTMLElement | null = null;
  const refreshInterval = 100;
  onMount(() => {
    if (!tocDataExists || !mainHtml) {
      return;
    }
    $shouldShowTOCButton = true;
    const headings = [...mainHtml.querySelectorAll('h1,h2,h3,h4')];
    const onScroll = throttleWithLast(() => {
      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;
      let firstHeading: undefined | Element;
      let lastHeading: undefined | Element;

      headings.some((heading, index) => {
        const headingTop = heading.getBoundingClientRect().top;
        const nextHeading = headings[index + 1];
        const nextHeadingTop = nextHeading?.getBoundingClientRect().top;

        const isThisFirstHeading =
          headingTop < viewportTop && (!nextHeading || viewportTop < nextHeadingTop);
        if (firstHeading === undefined && isThisFirstHeading) {
          firstHeading = heading;
        }

        const isThisLastHeading =
          headingTop < viewportBottom && (!nextHeading || viewportBottom < nextHeadingTop);
        if (lastHeading === undefined && isThisLastHeading) {
          lastHeading = heading;
          // The first and last headings have been found thus no need to continue looping.
          return true;
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
