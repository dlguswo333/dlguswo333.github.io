<script lang="ts">
  import {onMount} from 'svelte';
  import {showTOC} from '$lib/store';

  const hideOverlay = () => {
    $showTOC = false;
  };

  onMount(() => {
    document.body.style.overflow = 'hidden';

    return () => {document.body.style.overflow = '';};
  });
</script>
<div class="fixed w-full h-full backdrop-blur-lg bg-[#333a] z-10"
  on:mousedown={hideOverlay} role="button" aria-pressed="false" aria-label="Hide TOC" tabindex="0" />
