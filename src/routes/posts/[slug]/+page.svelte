<script lang="ts">
  import PostList from '$lib/components/PostList.svelte';
  import {defaultTitle, name} from '$lib/index';
  import {onMount} from 'svelte';

  let {data} = $props();
  onMount(() => {
    return () => {
      // Sveltekit does not revert document title on dismount.
      // See #4.
      document.title = defaultTitle;
    };
  });
</script>
<svelte:head>
  <title>{name}'s blog - page {data.curIndex}</title>
</svelte:head>
<div class="flex flex-row flex-grow justify-center lg:pr-20">
  <PostList posts={data.posts} curIndex={data.curIndex} maxIndex={data.maxIndex} />
</div>
