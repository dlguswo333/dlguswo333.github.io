<script lang="ts">
  import '../app.css';
  import Footer from './Footer.svelte';
  import Header from './Header.svelte';
  import Overlay from '$lib/components/Overlay.svelte';
  import {shouldShowOverlay} from '$lib/store';
  import {onMount} from 'svelte';
  import {customEvent, defaultTitle} from '$lib/index';
  import {page} from '$app/state';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let {children}: Props = $props();

  onMount(() => {
    if (import.meta.hot) {
      import.meta.hot.on(
        customEvent.reload,
        (payload: {path: string}) => {
          if (page.url.pathname.startsWith(payload.path)) {
            console.log(`${customEvent.reload} activated...`);
            window.location.reload();
          }
        }
      );
    }
  });
</script>
<svelte:head>
  <title>{defaultTitle}</title>
</svelte:head>
<Header />
{@render children?.()}
<Footer />
{#if $shouldShowOverlay}
  <Overlay />
{/if}
