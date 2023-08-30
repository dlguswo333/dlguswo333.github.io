<script>
  import HeaderLink from '$lib/components/HeaderLink.svelte';
  import TocIcon from '$lib/components/TOCIcon.svelte';
  import {showTOC, shouldShowTOCButton} from '$lib/store';
</script>
<header class="p-2 sticky top-0 flex flex-row items-center justify-between border-b border-b-gray-300 bg-gray-50">
  <div>
    <a href="/" class="inline-block h-8 w-8">
      <span class='hidden'>Go To Home</span>
      <img src="/favicon.svg" alt="Logo">
    </a>
    {#if $shouldShowTOCButton}
      <button class="inline-block md:hidden h-8 w-8"
        on:click={() => {$showTOC = !$showTOC;}}
      >
        <TocIcon />
      </button>
    {/if}
  </div>
  <div class="flex flex-row items-center">
    <HeaderLink href='/categories' text='Categories' />
    <HeaderLink href='/tags' text='Tags' />
    <HeaderLink href='/about' text='About' />
  </div>
</header>
