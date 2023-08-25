<script lang="ts">
  import TOC from '$lib/TOC.svelte';

  export let data;
</script>
<div class="flex flex-row flex-grow justify-center">
  {#if data.tocData}
    <div class="">
      <TOC data={data.tocData} />
    </div>
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
    <main class="post max-w-[1000px] py-2">
      {@html data.html}
    </main>
  </div>
</div>
