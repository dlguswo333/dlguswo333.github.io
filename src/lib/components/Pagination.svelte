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
    {#if curIndex === index}
      <li class="flex justify-center items-center mr-3 last:mr-0 rounded-lg shadow-md bg-sky-400">
        <a href={getHref(index)} class="flex justify-between items-center px-2 py-1 text-slate-50 font-semibold">
          {index}
        </a>
      </li>
    {:else}
      <li class="flex justify-center items-center mr-3 last:mr-0 rounded-lg shadow-md transition bg-sky-200 hover:bg-purple-500 dark:bg-sky-800 dark:hover:bg-purple-500">
        <a href={getHref(index)} class="flex justify-between items-center px-2 py-1 text-white dark:text-gray-400 dark:hover:text-white font-semibold">
          {index}
        </a>
      </li>
    {/if}
  {/each}
</ul>
