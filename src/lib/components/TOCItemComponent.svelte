<script lang="ts">
  import type {TOCItem} from '$lib/types';
  import {tocItemHeight, showTOC} from '$lib/store';

  export let item: TOCItem;
  export let shouldBind: boolean;

  const coefficient = 2 / 3;
  const constant = 0.4;
</script>
{#if shouldBind}
  <!-- The only difference is bind property -->
  <li
    title={item.text}
    bind:offsetHeight={$tocItemHeight}
    class={`flex ml-1 hover:bg-gray-100 dark:hover:bg-gray-700 ${item.depth === 1 ? 'font-bold' : ''} ${$showTOC ? 'py-1.5' : ''}
  `}
  >
    <a
      href={`#${item.id}`}
      class="relative z-10 py-0.5 whitespace-nowrap overflow-hidden break-all overflow-ellipsis flex-grow"
      style={`padding-left: ${coefficient * (item.depth - 1) + constant}rem;`}
    >
      {item.text}
    </a>
  </li>
{:else}
  <li
    title={item.text}
    class={`flex ml-1 hover:bg-gray-100 dark:hover:bg-gray-700 ${item.depth === 1 ? 'font-bold' : ''} ${$showTOC ? 'py-1.5' : ''}
  `}
  >
    <a
      href={`#${item.id}`}
      class="relative z-10 py-0.5 whitespace-nowrap overflow-hidden break-all overflow-ellipsis flex-grow"
      style={`padding-left: ${coefficient * (item.depth - 1) + constant}rem;`}
    >
      {item.text}
    </a>
  </li>
{/if}
