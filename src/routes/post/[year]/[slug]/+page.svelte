<script lang="ts">
  import Category from '$lib/components/Category.svelte';
  import MainSection from '$lib/components/MainSection.svelte';
  import TOC from '$lib/components/TOC.svelte';
  import Tag from '$lib/components/Tag.svelte';

  export let data;
</script>
<div class="flex flex-row flex-grow justify-center p-2 lg:p-0 lg:pr-[300px]">
  {#if data.tocData}
    <TOC data={data.tocData} />
  {/if}
  <!-- min-width: 0 is needed to prevent this element grow bigger than the parent -->
  <div class="flex flex-col justify-center min-w-0">
    {#if data.frontmatter}
      <div class="max-w-[900px] flex flex-col items-center py-6 gap-3">
        <h1 class="text-4xl font-bold text-center">{data.frontmatter.title}</h1>
        <span>
          {data.date}
          {#if data.frontmatter.editedDate}
            (Edited {data.frontmatter.editedDate})
          {/if}
        </span>
        {#if data.frontmatter.category}
          <Category categoryName={data.frontmatter.category} />
        {/if}
        <div>
          {#each data.frontmatter.tags as tag, index}
            <Tag tagName={tag} marginLeft={index === 0 ? 2 : 0} marginRight={1} />
          {/each}
        </div>
      </div>
      <hr class="bg-gray-400 my-4" />
    {/if}
    <MainSection html={data.html} className="post" />
  </div>
</div>
