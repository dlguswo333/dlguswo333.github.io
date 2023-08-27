<script lang="ts">
  import type {PostMetadata} from '$lib/types';

  export let post: PostMetadata;
</script>

<section
  class={'flex flex-col border-2 rounded-md border-gray-30 transition px-4 py-2 hover:border-teal-400 hover:bg-teal-50'}>
  <div class="flex flex-row items-center justify-between mb-1">
    <span>
      <a href={`/post/${post.date.split('-')[0]}/${post.id}`} class="text-cyan-400 visited:text-purple-600">
        <h1 class="inline-block font-bold text-lg mr-2 underline">{post.title}</h1>
      </a>
    </span>
    <span class="text-sm">
      {post.date}
      {#if post.editedDate}
        (E. {post.editedDate})
      {/if}
    </span>
  </div>
  <div class="flex flex-row justify-between">
    <span>
      {#if post.category}
        <span class="bg-sky-300 px-2 py-0.5 rounded-lg shadow-md shadow-emerald-50 border-l-slate-100 text-white">/{post.category}</span>
      {/if}
      <span>
        {#if post.tags}
          {#each post.tags as tag}
            <span class="mr-1 first:ml-2 last:mr-0 bg-green-100 px-2 py-0.5 rounded-xl shadow-md">#{tag}</span>
          {/each}
        {/if}
      </span>
    </span>
    <span>{post.lang}</span>
  </div>
  {#if post.summary}
    <div class="mt-4">
      {post.summary}
    </div>
  {/if}
</section>
