<script lang="ts">
  import Profile from './Profile.svelte';
  import PostList from '$lib/components/PostList.svelte';

  let {data} = $props();
</script>
<div class="flex flex-row flex-grow justify-center lg:pr-[300px]">
  <Profile />
  <PostList posts={data.posts} curIndex={data.curIndex} maxIndex={data.maxIndex} />
  <!-- Placeholder element -->
  <div class="max-w-[300px]"></div>
</div>
