<script lang="ts">
  import {onMount} from 'svelte';

  onMount(() => {
    document.body.style.overflow = 'hidden';

    return () => {document.body.style.overflow = '';};
  });
</script>
<div class="fixed w-full h-full backdrop-blur-lg bg-[#333a] z-10" />
