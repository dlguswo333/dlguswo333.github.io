<script lang="ts">
  import '../app.css';
  import Profile from './Profile.svelte';
  import PostList from '$lib/PostList.svelte';

  export let data;
</script>
<div class="flex flex-row flex-grow justify-center lg:pr-20">
  <Profile />
  <PostList posts={data.posts} />
  <!-- Placeholder element -->
  <div class="max-w-[300px]" />
</div>
