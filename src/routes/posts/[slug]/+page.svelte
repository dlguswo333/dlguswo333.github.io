<script lang="ts">
  import PostList from '$lib/components/PostList.svelte';

  let {data} = $props();
</script>
<div class="flex flex-row flex-grow justify-center lg:pr-20">
  <PostList posts={data.posts} curIndex={data.curIndex} maxIndex={data.maxIndex} />
</div>
