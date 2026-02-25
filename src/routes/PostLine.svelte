<script lang="ts">
  import {resolve} from '$app/paths';
  import type {PostMetadata} from '$lib/types';
  let {post}: {post: PostMetadata} = $props();
</script>
<li class="flex flex-col md:flex-row justify-between md:items-center px-2 border-2 rounded-md border-transparent hover:border-gray-200 dark:hover:border-gray-600">
  <a href={resolve(`/post/${post.date.split('-')[0]}/${post.id}/`)}
    class="text-sky-500 visited:text-purple-600 hover:underline active:brightness-150 max-w-full py-1 text-ellipsis whitespace-nowrap overflow-hidden">
    {post.title}
  </a>
  <div class="flex-grow"></div>
  <span class="basis-[fit-content] whitespace-nowrap">
    {#if post.editedDate}
      (E. {post.editedDate})
    {/if}
    {post.date}
  </span>
</li>
