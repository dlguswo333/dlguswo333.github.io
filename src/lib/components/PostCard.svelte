<script lang="ts">
  import Tag from '$lib/components/Tag.svelte';
  import type {PostMetadata} from '$lib/types';
  import Category from './Category.svelte';

  export let post: PostMetadata;
</script>

<section
  class={'flex flex-col border-2 rounded-md transition px-4 py-2 border-gray-300 hover:border-teal-400 hover:bg-teal-50 dark:border-gray-400 dark:hover:bg-teal-900 dark:hover:border-teal-500'}>
  <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-1">
    <span>
      <a href={`/post/${post.date.split('-')[0]}/${post.id}/`} class="text-sky-500 visited:text-purple-600">
        <h1 class="inline-block font-bold text-lg mr-2 underline">{post.title}</h1>
      </a>
    </span>
    <span class="text-sm flex flex-row self-stretch justify-between">
      <span class="">
        {post.date}
        {#if post.editedDate}
          (E. {post.editedDate})
        {/if}
      </span>
      <span class="ml-2">
        {post.lang}
      </span>
    </span>
  </div>
  <div>
    <span>
      {#if post.category}
        <Category categoryName={post.category} />
      {/if}
      <span>
        {#if post.tags}
          {#each post.tags as tag, index}
            <Tag tagName={tag} marginLeft={index === 0 ? 2 : 0} marginRight={1} />
          {/each}
        {/if}
      </span>
    </span>
  </div>
  {#if post.summary}
    <div class="mt-4" style={'overflow-wrap: anywhere;'}>
      {post.summary}
    </div>
  {/if}
</section>
