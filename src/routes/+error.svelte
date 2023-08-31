<script lang="ts">
  import {page} from '$app/stores';
</script>
<div>
  <h1 class="text-5xl text-center p-3 mt-5">{$page.status}</h1>
  <div class="flex justify-center">
    <a href="/" class="text-2xl underline text-blue-500">Go to Home</a>
  </div>
</div>
