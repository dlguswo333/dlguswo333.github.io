<script lang="ts">
  import type {TOCItem} from '$lib/types';

  export let data: TOCItem[];
  const coefficient = 2 / 3;
  const constant = 0.3;
</script>
<aside class="w-[300px] overflow-hidden hidden mt-10 self-start md:!flex md:sticky md:top-14 flex-col justify-center items-center p-5">
  <ul class="w-full">
    {#each data as item}
      <li title={item.text}
        class={`flex border-l-4 border-transparent hover:border-gray-300 hover:bg-gray-50 ${item.depth === 1 ? 'font-bold' : ''}`}
        style={`padding-left: ${coefficient * (item.depth - 1) + constant}rem;`}>
        <a href={`#${item.id}`} class="whitespace-nowrap overflow-hidden break-all overflow-ellipsis flex-grow">
          {item.text}
        </a>
      </li>
    {/each}
  </ul>
</aside>
