<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
    properties: Record<string, unknown>;
  }
  let {properties}: Props = $props();
  const onclick = () => {
    if (typeof properties?.src !== 'string') {
      return;
    }
    window.open(properties.src);
  };
</script>
<img
  {...properties}
  title='Click to open in a new tab'
  role='button'
  onclick={onclick}
/>
