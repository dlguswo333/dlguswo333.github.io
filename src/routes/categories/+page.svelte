<script lang="ts">
  import MainSection from '$lib/components/MainSection.svelte';

  export let data;
</script>
<div class="flex flex-row flex-grow justify-center p-2 lg:p-0">
  <MainSection>
    {#each data.categories as {category, posts}}
      <section class="mb-8 w-full">
        <h1 id={category} class="text-3xl font-bold pb-2 mb-3 border-b-2 scroll-mt-[50px]">
          {category}
        </h1>
        <ul>
          {#each posts as post}
            <li class="flex flex-col md:flex-row justify-between md:items-center px-2 border-2 rounded-md border-transparent hover:border-gray-200">
              <a href={`/post/${post.date.split('-')[0]}/${post.id}/`}
                class="text-cyan-400 visited:text-purple-600 max-w-full py-1 text-ellipsis whitespace-nowrap overflow-hidden">
                {post.title}
              </a>
              <div class="flex-grow" />
              <span class="basis-[fit-content] whitespace-nowrap">
                {#if post.editedDate}
                  (E. {post.editedDate})
                {/if}
                {post.date}
              </span>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </MainSection>
</div>
