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
  maxDisplaySize = Math.max(5, maxDisplaySize);

  const displayIndices: number[] = $derived.by(() => {
    const ret = [1]; // Always show the first index.
    const start = Math.max(
      // Lower limit: Must be equal to 2 or bigger.
      2,
      Math.min(
        // Upper limit: To prevent that there may be not enough indices above the current to fill the other half.
        maxIndex - (maxDisplaySize - 2),
        // Base case: Half spaces for indices below the current.
        curIndex - Math.floor((maxDisplaySize - 2) / 2)
      )
    );
    const end = Math.min(
      maxIndex,
      start + maxDisplaySize - 3 // Base case: [start, end] should be (maxDisplaySize - 2) long.
    );
    for (let i = start;i <= end;++i) {
      ret.push(i);
    }
    // Always show the last index.
    if (ret[ret.length - 1] !== maxIndex) {
      ret.push(maxIndex);
    }
    return ret;
  });
</script>


<ul class="m-2 flex flex-row items-center">
  {#each displayIndices as index (index)}
    {#snippet anchor()}
      <a href={getHref(index)} class="font-semibold flex justify-between items-center px-2 py-1 dark:text-gray-200">
        {index}
      </a>
    {/snippet}
    {#if curIndex === index}
      <li class="flex justify-center items-center mr-3 last:mr-0 rounded-lg border-2 border-gray-400" aria-current="page">
        {@render anchor()}
      </li>
    {:else}
      <li class="flex justify-center items-center mr-3 last:mr-0 rounded-lg transition hover:bg-gray-200 dark:hover:bg-gray-700">
        {@render anchor()}
      </li>
    {/if}
  {/each}
</ul>
