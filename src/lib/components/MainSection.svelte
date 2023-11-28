<script lang="ts">
  import {onMount} from 'svelte';
  import {headingHighlight, shouldShowTOCButton} from '$lib/store';
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
    if (!mainHtml) {
      return;
    }
    $shouldShowTOCButton = true;
    $headingHighlight = null;

    const headings = [...mainHtml.querySelectorAll('h1,h2,h3,h4')];
    const onScroll = throttleWithLast(() => {
      // [TODO] Need more reliable way to get the value.
      const tocItemHeight = 28;
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
          headingTop < 0 && (!nextHeading || 0 < nextHeadingTop);
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
      const highlightTop = tocItemHeight * (highlightTopOffset + firstHeadingIndex);
      const highlightBottom = tocItemHeight * (highlightBottomOffset + lastHeadingIndex);

      $headingHighlight = {top: Math.floor(highlightTop), bottom: Math.floor(highlightBottom)};
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
