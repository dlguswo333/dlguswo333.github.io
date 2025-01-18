<script lang="ts">
  import Tag from '$lib/components/Tag.svelte';
  import type {PostMetadata} from '$lib/types';
  import Category from './Category.svelte';

  interface Props {
    post: PostMetadata;
  }

  let {post}: Props = $props();
</script>

<section
  class={`flex flex-col px-4 py-2 transition border rounded-md hover:bg-teal-50 dark:hover:bg-teal-700/20
    border-gray-200 hover:border-teal-200 dark:border-gray-600 dark:hover:border-teal-600
    shadow-sm hover:shadow-md shadow-gray-300 dark:shadow-gray-900 dark:hover:shadow-teal-900/50`}>
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
