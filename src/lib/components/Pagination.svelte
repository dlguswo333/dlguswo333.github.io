<script lang="ts">
  interface Props {
    curIndex: number;
    maxIndex: number;
    maxDisplaySize: number;
    getHref: (num: number) => string;
  }

  let {
    curIndex,
    maxIndex,
    maxDisplaySize = $bindable(),
    getHref,
  }: Props = $props();

  // It is nonsense displayed paginations are less than 5.
  maxDisplaySize = Math.min(5, maxDisplaySize);

  const displayIndices: number[] = [1];
  const start = Math.max(2, curIndex - Math.floor(maxDisplaySize / 2));
  for (let i = start;i <= Math.min(maxIndex, start + maxDisplaySize - 3);++i) {
    displayIndices.push(i);
  }
  if (displayIndices[displayIndices.length - 1] !== maxIndex) {
    displayIndices.push(maxIndex);
  }
</script>


<ul class="m-2 flex flex-row items-center">
  {#each displayIndices as index}
    {#snippet anchor()}
      <a href={getHref(index)} class="font-semibold flex justify-between items-center px-2 py-1 dark:text-gray-200">
        {index}
      </a>
    {/snippet}
    {#if curIndex === index}
      <li class="flex justify-center items-center mr-3 last:mr-0 rounded-lg border-2 border-gray-400">
        {@render anchor()}
      </li>
    {:else}
      <li class="flex justify-center items-center mr-3 last:mr-0 rounded-lg transition hover:bg-gray-200 dark:hover:bg-gray-700">
        {@render anchor()}
      </li>
    {/if}
  {/each}
</ul>
