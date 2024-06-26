<script lang="ts">
  import {afterNavigate, beforeNavigate} from '$app/navigation';
  import {headingHighlight, shouldShowTOCButton, tocItemHeight} from '$lib/store';
  import throttleWithLast from '$lib/throttleWithLast';

  /** Raw html in `string` type */
  export let html: string | null = null;
  /** Additional class to add. */
  export let className: string | null = null;
  /** If toc data exists, it means it needs show toc button. */
  export let tocDataExists: boolean = false;

  let mainHtml: HTMLElement | null = null;
  const refreshInterval = 100;
  let headings: Element[] = [];
  const onScroll = throttleWithLast(() => updateHeadingHighlight(), refreshInterval);

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
    const highlightTop = $tocItemHeight * (highlightTopOffset + firstHeadingIndex);
    const highlightBottom = $tocItemHeight * Math.min(
      lastHeadingIndex + highlightBottomOffset,
      lastHeadingIndex + 1 // Prevent highlight overflows parent underneath.
    );

    $headingHighlight = {top: Math.floor(highlightTop), bottom: Math.floor(highlightBottom)};
  };

  // Setup.
  afterNavigate(() => {
    if (!tocDataExists || !mainHtml) {
      return;
    }
    if (!mainHtml) {
      return;
    }
    $shouldShowTOCButton = true;
    $headingHighlight = null;

    headings = [...mainHtml.querySelectorAll('h1,h2,h3,h4')];
    document.addEventListener('scroll', onScroll);
    return () => {
    };
  });

  // Dis-setup.
  beforeNavigate(() => {
    $shouldShowTOCButton = false;
    document.removeEventListener('scroll', onScroll);
  });

  $: if ($tocItemHeight && mainHtml) {
    headings = [...mainHtml.querySelectorAll('h1,h2,h3,h4')];
    updateHeadingHighlight();
  }
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
