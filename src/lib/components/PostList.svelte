<script lang="ts">
  import type crawlPosts from '$lib/crawlPosts';
  import Pagination from './Pagination.svelte';
  import Postcard from './PostCard.svelte';

  export let posts: Awaited<ReturnType<typeof crawlPosts>>;
  export let curIndex: number;
  export let maxIndex: number;
</script>
<main class="max-w-[900px] flex flex-col items-center pb-3">
  <ul class="py-4">
    {#each posts as post}
      <li class="mb-5 last:mb-0 px-4">
        <Postcard post={post} />
      </li>
    {/each}
  </ul>
  <Pagination curIndex={curIndex} maxIndex={maxIndex} maxDisplaySize={6}
    getHref={(num) => num === 1 ? '/' : `/posts/${num}`}
  />
</main>
