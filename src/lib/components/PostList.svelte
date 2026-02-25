<script lang="ts">
  import type {PostMetadata} from '$lib/types';
  import MainSection from './MainSection.svelte';
  import Pagination from './Pagination.svelte';
  import PostCard from './PostCard.svelte';

  interface Props {
    groupedPosts: PostMetadata[][];
    curIndex: number;
    maxIndex: number;
  }

  let {groupedPosts, curIndex, maxIndex}: Props = $props();
</script>
<MainSection className="flex flex-col items-center pb-3">
  <ul class="py-4">
    {#each groupedPosts as posts (posts)}
      <li class="mb-5 last:mb-0 px-4">
        <PostCard posts={posts} />
      </li>
    {/each}
  </ul>
  <Pagination curIndex={curIndex} maxIndex={maxIndex} maxDisplaySize={6}
    getHref={(num) => num === 1 ? '/' : `/posts/${num}/`}
  />
</MainSection>
