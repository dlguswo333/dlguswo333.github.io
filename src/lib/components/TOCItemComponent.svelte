<script lang="ts">
  import type {TOCItem} from '$lib/types';
  import {tocItemHeight} from '$lib/store';

  interface Props {
    item: TOCItem;
    shouldBind: boolean;
  }

  let {item, shouldBind}: Props = $props();

  const coefficient = 2 / 3;
  const constant = 0.4;
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
    bind:offsetHeight={$tocItemHeight}
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
