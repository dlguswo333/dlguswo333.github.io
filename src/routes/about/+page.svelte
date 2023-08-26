<script lang="ts">
  import Profile from '../Profile.svelte';

  export let data;
</script>
<div class="flex flex-row flex-grow justify-center p-2 lg:p-0 lg:pr-[300px]">
  <Profile />
  <main class="post max-w-[900px] py-2">
    {@html data.html}
  </main>
</div>
