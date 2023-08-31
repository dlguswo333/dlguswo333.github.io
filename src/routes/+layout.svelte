<script>
  import '../app.css';
  import Footer from './Footer.svelte';
  import Header from './Header.svelte';
  import Overlay from '$lib/components/Overlay.svelte';
  import {shouldShowOverlay} from '$lib/store';
</script>
<Header />
<slot />
<Footer />
{#if $shouldShowOverlay}
  <Overlay />
{/if}
