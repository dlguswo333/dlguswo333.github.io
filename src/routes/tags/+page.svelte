<script lang="ts">
  import MainSection from '$lib/components/MainSection.svelte';
  import TOC from '$lib/components/TOC.svelte';
  import PostLine from '../PostLine.svelte';

  let {data} = $props();
</script>
<div class="flex flex-row flex-grow justify-center p-2 lg:p-0 lg:pr-[300px]">
  {#if data.tocData}
    <TOC data={data.tocData} />
  {/if}
  <MainSection tocDataExists={!!data.tocData.length}>
    {#each data.tags as {tag, posts}}
      <section class="mb-8 w-full">
        <h1 id={tag} class="text-3xl font-bold pb-2 mb-3 border-b-2 scroll-mt-[50px]">
          {tag}
        </h1>
        <ul>
          {#each posts as post}
            <PostLine post={post} />
          {/each}
        </ul>
      </section>
    {/each}
  </MainSection>
</div>
