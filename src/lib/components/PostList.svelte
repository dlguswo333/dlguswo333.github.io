<script lang="ts">
  import type {PostMetadata} from '$lib/types';
  import MainSection from './MainSection.svelte';
  import Pagination from './Pagination.svelte';
  import Postcard from './PostCard.svelte';

  export let posts: PostMetadata[];
  export let curIndex: number;
  export let maxIndex: number;
</script>
<MainSection className="flex flex-col items-center pb-3">
  <ul class="py-4">
    {#each posts as post}
      <li class="mb-5 last:mb-0 px-4">
        <Postcard post={post} />
      </li>
    {/each}
  </ul>
  <Pagination curIndex={curIndex} maxIndex={maxIndex} maxDisplaySize={6}
    getHref={(num) => num === 1 ? '/' : `/posts/${num}/`}
  />
</MainSection>
