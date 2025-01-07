<script lang="ts">
  import {run} from 'svelte/legacy';

  import TocItemComponent from './TOCItemComponent.svelte';
  import type {TOCItem} from '$lib/types';
  import {headingHighlight} from '$lib/store';
  import {showTOC} from '$lib/store';
  import {onMount} from 'svelte';

  interface Props {
    data: TOCItem[];
  }

  let {data}: Props = $props();


  onMount(() => {
    $showTOC = false;
    const onResize = () => {
      // md: size
      if (window.innerWidth >= 840) {
        $showTOC = false;
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      $showTOC = false;
      window.removeEventListener('resize', onResize);
    };
  });
  let highlightTop: number | undefined = $state(undefined);
  let highlightBottom: number | undefined = $state(undefined);
  run(() => {
    highlightTop = $headingHighlight?.top;
    highlightBottom = $headingHighlight?.bottom;
  });
</script>
<!--
I don't know why, but setting max-height on 'aside' shows bad strange behavior.
The scrollable height is not big enough to show the front child 'li' elements.
-->
<aside class={`w-[330px] overflow-hidden hidden mt-10 self-start md:!flex md:sticky md:top-14 flex-col justify-center items-center p-3
  ${$showTOC ? '!w-[94vw] py-6 z-20 !flex fixed top-14 left-[50%] translate-x-[-50%] border-2 border-neutral-300 bg-neutral-50 shadow-lg rounded-md dark:bg-neutral-800' : ''}`}>
  <div class="relative w-full overflow-auto max-h-[80vh]">
    <ul class="relative">
      {#each data as item, ind}
        <TocItemComponent item={item} shouldBind={ind === 0} />
      {/each}
      <div class="absolute top-0 left-0 z-5 rounded-xl bg-gray-200 dark:bg-gray-500/25 w-1 h-full"></div>
    </ul>
    {#if highlightTop !== undefined && highlightBottom !== undefined}
      <div class={'absolute left-0 flex'} style={`transition: top 0.1s ease-out, height 0.1s ease-out; top: ${highlightTop}px; height:${highlightBottom - highlightTop}px`}>
        <div class="z-10 rounded-xl bg-blue-400 dark:bg-purple-500 w-1 h-full"></div>
        <div class="z-5 absolute left-0.5 w-6 h-full bg-gradient-to-r from-blue-100 dark:from-fuchsia-900 to-transparent"></div>
      </div>
    {/if}
  </div>
</aside>
