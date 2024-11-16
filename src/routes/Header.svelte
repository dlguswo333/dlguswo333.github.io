<script>
  import ColorThemeButton from '$lib/components/ColorThemeButton.svelte';
  import HeaderLink from '$lib/components/HeaderLink.svelte';
  import TocIcon from '$lib/components/TOCIcon.svelte';
  import {showTOC, shouldShowTOCButton} from '$lib/store';
  import {page} from '$app/stores';

  $: links = [
    {href: '/categories/', text: 'Categories', isActive: $page.url.pathname.startsWith('/categories/')},
    {href: '/tags/', text: 'Tags', isActive: $page.url.pathname.startsWith('/tags/')},
    {href: '/about/', text: 'About', isActive: $page.url.pathname.startsWith('/about/')}
  ];
</script>
<header class="z-10 p-2 sticky top-0 flex flex-row items-center justify-between border-b border-b-gray-300 bg-gray-50 dark:bg-[#2c3039] dark:border-b-gray-700">
  <div class="flex flex-row items-center gap-1">
    <!-- Each item size must be the same for beauty. -->
    <a href="/" class="inline-block h-8 w-8">
      <span class='hidden'>Go To Home</span>
      <img src="/favicon.svg" alt="Logo">
    </a>
    <ColorThemeButton />
    {#if $shouldShowTOCButton}
      <button class="inline-block md:hidden h-8 w-8"
        on:click={() => {$showTOC = !$showTOC;}}
      >
        <TocIcon />
      </button>
    {/if}
  </div>
  <div class="flex flex-row items-center">
    {#each links as {href, text, isActive}}
      <HeaderLink href={href} text={text} isActive={isActive} />
    {/each}
  </div>
</header>
