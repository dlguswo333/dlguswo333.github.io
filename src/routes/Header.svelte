<script>
  import HeaderLink from '$lib/HeaderLink.svelte';
</script>
<header class="p-2 flex flex-row align-middle justify-between border-b border-b-gray-300 bg-gray-50">
  <a href="/" class="inline-block h-8 w-8">
    <span class='hidden'>Go To Home</span>
    <img src="/favicon.svg" alt="Logo">
  </a>
  <div class="flex flex-row items-center">
    <HeaderLink href='/categories' text='Categories' />
    <HeaderLink href='/tags' text='Tags' />
    <HeaderLink href='/about' text='About' />
  </div>
</header>
