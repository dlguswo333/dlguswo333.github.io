<script lang="ts">
  import MainSection from '$lib/components/MainSection.svelte';
  import Profile from '../Profile.svelte';

  let {data} = $props();
</script>
<div class="flex flex-row flex-grow justify-center p-2 lg:p-0 lg:pr-[300px]">
  <Profile />
  <MainSection html={data.html} className="post" />
</div>
