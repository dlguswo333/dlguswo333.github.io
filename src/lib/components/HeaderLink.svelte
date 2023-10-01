<script lang="ts">
  export let href: string;
  export let text: string;
</script>
<a href={href} class="h-8 flex items-center justify-center mr-2 last:mr-1 px-1 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 dark:hover:text-white">
  {text}
</a>
