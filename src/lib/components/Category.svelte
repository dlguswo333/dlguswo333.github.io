<script lang="ts">
  import {goto} from '$app/navigation';
  interface Props {
    categoryName: string;
  }

  let {categoryName}: Props = $props();
  const onClick = () => goto(`/categories#${categoryName}`);
</script>
<button onclick={onClick}
  class="px-2 py-0.5 rounded-lg shadow-md shadow-emerald-800/30 border-l-slate-100
    bg-sky-300 text-white hover:bg-sky-500 dark:shadow-emerald-900 transition"
>
  /{categoryName}
</button>
