<script lang="ts">
  import {goto} from '$app/navigation';
  export let tagName: string;
  export let marginLeft: number = 1;
  export let marginRight: number = 1;
  const onClick = () => goto(`/tags#${tagName}`);
</script>
<button on:click={onClick}
  class="last:mr-0 bg-green-100 hover:bg-green-400 hover:text-white dark:text-black transition px-2 pl-3 py-0.5 rounded-sm shadow-md shadow-emerald-100 dark:shadow-green-900 my-0.5"
  style={`margin-right: ${marginRight * 0.25}rem; margin-left: ${marginLeft * 0.25}rem; clip-path: polygon(8px 0, 0 50%, 8px 100%, 100% 100%, 100% 0);`}
>
  #{tagName}
</button>
