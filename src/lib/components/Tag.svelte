<script lang="ts">
  import {goto} from '$app/navigation';
  export let tagName: string;
  export let marginLeft: number = 1;
  export let marginRight: number = 1;
  const onClick = () => goto(`/tags#${tagName}`);
</script>
<button on:click={onClick}
  class="last:mr-0 bg-green-100 hover:bg-green-400 hover:text-white dark:text-black transition px-2 py-0.5 rounded-xl shadow-md dark:shadow-green-900 my-0.5"
  style={`margin-right: ${marginRight * 0.25}rem; margin-left: ${marginLeft * 0.25}rem`}
>
  #{tagName}
</button>
