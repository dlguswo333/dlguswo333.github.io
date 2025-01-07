<script lang="ts">
  import '../app.css';
  import Footer from './Footer.svelte';
  import Header from './Header.svelte';
  import Overlay from '$lib/components/Overlay.svelte';
  import {shouldShowOverlay} from '$lib/store';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let {children}: Props = $props();
</script>
<Header />
{@render children?.()}
<Footer />
{#if $shouldShowOverlay}
  <Overlay />
{/if}
