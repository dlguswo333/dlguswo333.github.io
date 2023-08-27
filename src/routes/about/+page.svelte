<script lang="ts">
  import MainHtml from '$lib/components/MainHtml.svelte';
  import Profile from '../Profile.svelte';

  export let data;
</script>
<div class="flex flex-row flex-grow justify-center p-2 lg:p-0 lg:pr-[300px]">
  <Profile />
  <MainHtml html={data.html} />
</div>
