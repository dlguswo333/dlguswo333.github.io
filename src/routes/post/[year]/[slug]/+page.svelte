<script lang="ts">
  import MainSection from '$lib/components/MainSection.svelte';
  import TOC from '$lib/components/TOC.svelte';

  export let data;
</script>
<div class="flex flex-row flex-grow justify-center p-2 lg:p-0 lg:pr-[300px]">
  {#if data.tocData}
    <TOC data={data.tocData} />
  {/if}
  <!-- min-width: 0 is needed to prevent this element grow bigger than the parent -->
  <div class="flex flex-col justify-center min-w-0">
    {#if data.frontmatter}
      <div class="flex flex-col items-center py-6 gap-3">
        <h1 class="text-4xl font-bold text-center">{data.frontmatter.title}</h1>
        <span>
          {data.date}
          {#if data.frontmatter.editedDate}
            (Edited {data.frontmatter.editedDate})
          {/if}
        </span>
        <span class="bg-sky-300 px-2 py-0.5 rounded-lg shadow-md shadow-emerald-50 border-l-slate-100 text-white">/{data.frontmatter.category}</span>
        <div>
          {#each data.frontmatter.tags as tag}
            <span class="mr-1 first:ml-2 last:mr-0 bg-green-100 px-2 py-0.5 rounded-xl shadow-md">#{tag}</span>
          {/each}
        </div>
      </div>
      <hr class="bg-gray-400 my-4" />
    {/if}
    <MainSection html={data.html} className="post" />
  </div>
</div>
