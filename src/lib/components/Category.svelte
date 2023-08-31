<script lang="ts">
  import {goto} from '$app/navigation';
  export let categoryName: string;
  const onClick = () => goto(`/categories#${categoryName}`);
</script>
<button on:click={onClick}
  class="px-2 py-0.5 rounded-lg shadow-md shadow-emerald-50 border-l-slate-100
    bg-sky-300 text-white hover:bg-sky-500 transition"
>
  /{categoryName}
</button>
