<script lang="ts">
  import type {TOCItem} from '$lib/types';
  import {activeHeadingIndex} from '$lib/store';

  export let data: TOCItem[];

  const coefficient = 2 / 3;
  const constant = 0.3;
</script>
<!--
I don't know why, but setting max-height on 'aside' shows bad strange behavior.
The scrollable height is not big enough to show the front child 'li' elements.
-->
<aside class="w-[300px] overflow-hidden hidden mt-10 self-start md:!flex md:sticky md:top-14 flex-col justify-center items-center p-3">
  <ul class="w-full max-h-[80vh] overflow-auto">
    {#each data as item, index}
      <li title={item.text}
        class={`flex border-l-4 border-transparent hover:border-gray-300 hover:bg-gray-50 ${item.depth === 1 ? 'font-bold' : ''} ${$activeHeadingIndex === index ? 'border-blue-500' : ''}`}
        style={`padding-left: ${coefficient * (item.depth - 1) + constant}rem;`}>
        <a href={`#${item.id}`} class="whitespace-nowrap overflow-hidden break-all overflow-ellipsis flex-grow">
          {item.text}
        </a>
      </li>
    {/each}
  </ul>
</aside>
