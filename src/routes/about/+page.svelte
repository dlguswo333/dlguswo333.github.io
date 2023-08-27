<script lang="ts">
  import MainSection from '$lib/components/MainSection.svelte';
  import Profile from '../Profile.svelte';

  export let data;
</script>
<div class="flex flex-row flex-grow justify-center p-2 lg:p-0 lg:pr-[300px]">
  <Profile />
  <MainSection html={data.html} className="post" />
</div>
