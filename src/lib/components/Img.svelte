<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
    properties: Record<string, unknown>;
    imageSizes?: Record<string, {width: number; height: number}>
  }
  let {properties, imageSizes}: Props = $props();
  const onclick = () => {
    if (typeof properties?.src !== 'string') {
      return;
    }
    window.open(properties.src);
  };
  const imgSize = $derived.by(() => {
    if (!imageSizes) {
      return undefined;
    }
    if (typeof properties?.src !== 'string') {
      return undefined;
    }
    return imageSizes[properties.src] ?? undefined;
  });
</script>
{#if imgSize}
  <span style:aspect-ratio={`${imgSize.width} / ${imgSize.height}`} class="block max-w-[100%] max-h-[55vh] mx-auto my-1 bg-gray-100 dark:bg-zinc-900">
    <img
      {...properties}
      title='Click to open in a new tab'
      role='button'
      onclick={onclick}
      loading="lazy"
      width={imgSize.width}
      height={imgSize.height}
    />
  </span>
{:else}
  <span class="block max-w-[100%] max-h-[55vh] w-fit h-fit mx-auto my-1 bg-gray-100 dark:bg-zinc-900">
    <img
      {...properties}
      title='Click to open in a new tab'
      role='button'
      onclick={onclick}
      loading="lazy"
    />
  </span>
{/if}
