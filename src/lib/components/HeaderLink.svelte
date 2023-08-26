<script lang="ts">
  export let href: string;
  export let text: string;
</script>
<a href={href} class="h-8 flex items-center justify-center mr-2 last:mr-1 px-1 py-0.5 rounded-s hover:bg-gray-200">
  {text}
</a>
