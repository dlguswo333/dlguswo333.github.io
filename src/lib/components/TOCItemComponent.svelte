<script lang="ts">
  import type {TOCItem} from '$lib/types';
  import {tocItemHeight} from '$lib/store';

  interface Props {
    item: TOCItem;
    shouldBind: boolean;
  }

  let {item, shouldBind}: Props = $props();
  let tocItem: HTMLElement | null = $state(null);

  const coefficient = 2 / 3;
  const constant = 0.4;

  $effect(() => {
    if (tocItem === null) {
      return;
    }
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      $tocItemHeight = tocItem?.getBoundingClientRect().height ?? 0;
    });
    resizeObserver.observe(tocItem);
    return () => {
      resizeObserver.disconnect();
    };
  });
</script>
{#snippet anchor()}
  <a
    href={`#${item.id}`}
    class="relative z-10 py-1.5 whitespace-nowrap overflow-hidden break-all overflow-ellipsis flex-grow"
    style={`padding-left: ${coefficient * (item.depth - 1) + constant}rem;`}
  >
    {item.text}
  </a>
{/snippet}
{#if shouldBind}
  <!-- The only difference is bind property -->
  <li
    title={item.text}
    class={`flex ml-1 hover:bg-gray-100 dark:hover:bg-gray-700 ${item.depth === 1 ? 'font-bold' : ''}`}
    bind:this={tocItem}
  >
    {@render anchor()}
  </li>
{:else}
  <li
    title={item.text}
    class={`flex ml-1 hover:bg-gray-100 dark:hover:bg-gray-700 ${item.depth === 1 ? 'font-bold' : ''}`}
  >
    {@render anchor()}
  </li>
{/if}
