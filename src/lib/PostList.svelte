<script lang="ts">
  import type crawlPosts from '$lib/crawlPosts';
  import Postcard from './PostCard.svelte';

  export let posts: Awaited<ReturnType<typeof crawlPosts>>;
</script>
<main class="max-w-[1000px]">
  <ul class="py-4">
    {#each posts as post}
      <li class="mb-5 last:mb-0 px-4">
        <Postcard post={post} />
      </li>
    {/each}
  </ul>
</main>
