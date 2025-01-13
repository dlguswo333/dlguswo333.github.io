<script lang="ts">
  import {onMount} from 'svelte';
  import {headingHighlight, shouldShowTOCButton, tocItemHeight} from '$lib/store';
  import throttleWithLast from '$lib/throttleWithLast';

  
  
  
  interface Props {
    /** Raw html in `string` type */
    html?: string | null;
    /** Additional class to add. */
    className?: string | null;
    /** If toc data exists, it means it needs show toc button. */
    tocDataExists?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    html = null,
    className = null,
    tocDataExists = false,
    children,
  }: Props = $props();

  let mainHtml: HTMLElement | null = $state(null);
  const refreshInterval = 100;
  let headings: Element[] = $state([]);
  const throttledUpdateHeadingHighlight = throttleWithLast(() => updateHeadingHighlight(), refreshInterval);

  const updateHeadingHighlight = () => {
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
        headingTop <= 0 && (!nextHeading || 0 < nextHeadingTop);
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
    const highlightTop = $tocItemHeight * (highlightTopOffset + firstHeadingIndex);
    const highlightBottom = $tocItemHeight * Math.min(
      lastHeadingIndex + highlightBottomOffset,
      lastHeadingIndex + 1 // Prevent highlight overflows parent underneath.
    );

    $headingHighlight = {top: Math.floor(highlightTop), bottom: Math.floor(highlightBottom)};
  };

  // Setup.
  onMount(() => {
    if (!tocDataExists || !mainHtml) {
      return;
    }
    if (!mainHtml) {
      return;
    }
    $shouldShowTOCButton = true;
    $headingHighlight = null;

    headings = [...mainHtml.querySelectorAll('h1,h2,h3,h4')];
    document.addEventListener('scroll', throttledUpdateHeadingHighlight);
    return () => {
      $shouldShowTOCButton = false;
      $headingHighlight = null;
      document.removeEventListener('scroll', throttledUpdateHeadingHighlight);
    };
  });

  $effect(() => {
    if ($tocItemHeight && mainHtml) {
      headings = [...mainHtml.querySelectorAll('h1,h2,h3,h4')];
      // Need to call update highlight function manually here for following situations:
      // However, calling the function right away may have undesirable effects because the height might change,
      // maybe due to images not loaded yet. Need to call after some interval.
      // - Refreshing the page remembers the scroll position.
      // - On small screens where TOC does not render each TOC item have height of zero.
      throttledUpdateHeadingHighlight();
    }
  });
</script>
<!--
@component
Render raw html in main section.
-->
<main class={`max-w-[900px] w-full py-2 ${className ? className : ''}`} bind:this={mainHtml}>
  {@render children?.()}
  {#if html}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
  {/if}
</main>
