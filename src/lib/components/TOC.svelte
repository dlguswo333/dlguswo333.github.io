<script lang="ts">
  import type {TOCItem} from '$lib/types';
  import {headingHighlight} from '$lib/store';
  import {showTOC} from '$lib/store';
  import {onMount} from 'svelte';

  export let data: TOCItem[];

  const coefficient = 2 / 3;
  const constant = 0.3;

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
  let highlightTop: number | undefined = undefined;
  let highlightBottom: number | undefined = undefined;
  $: {
    highlightTop = $headingHighlight?.top;
    highlightBottom = $headingHighlight?.bottom;
  }
</script>
<!--
I don't know why, but setting max-height on 'aside' shows bad strange behavior.
The scrollable height is not big enough to show the front child 'li' elements.
-->
<aside class={`w-[300px] overflow-hidden hidden mt-10 self-start md:!flex md:sticky md:top-14 flex-col justify-center items-center p-3
  ${$showTOC ? '!w-[94vw] py-6 z-20 !flex fixed top-14 left-[50%] translate-x-[-50%] border-2 border-neutral-300 bg-neutral-50 shadow-lg rounded-md dark:bg-neutral-800' : ''}`}>
  <div class="relative w-full">
    <ul class="max-h-[80vh] overflow-auto">
      {#each data as item}
        <li title={item.text}
          class={`flex border-l-4 border-transparent hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${item.depth === 1 ? 'font-bold' : ''} ${$showTOC ? 'py-1.5' : ''}
        `}
        >
          <a href={`#${item.id}`} class="relative z-10 py-0.5 whitespace-nowrap overflow-hidden break-all overflow-ellipsis flex-grow"
            style={`padding-left: ${coefficient * (item.depth - 1) + constant}rem;`}>
            {item.text}
          </a>
        </li>
      {/each}
    </ul>
    {#if highlightTop !== undefined && highlightBottom !== undefined}
      <div class={'absolute left-0 flex'} style={`transition: top 0.1s ease-out, height 0.1s ease-out; top: ${highlightTop}px; height:${highlightBottom - highlightTop}px`}>
        <div class="rounded-xl bg-blue-400 w-1 h-full" />
        <div class="w-6 h-full bg-gradient-to-r from-blue-100 to-white" />
      </div>
    {/if}
  </div>
</aside>
