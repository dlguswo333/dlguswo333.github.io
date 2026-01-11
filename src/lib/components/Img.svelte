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
  <img
    {...properties}
    title='Click to open in a new tab'
    role='button'
    onclick={onclick}
    loading="lazy"
    width={imgSize.width}
    height={imgSize.height}
  />
{:else}
  <img
    {...properties}
    title='Click to open in a new tab'
    role='button'
    onclick={onclick}
    loading="lazy"
  />
{/if}
