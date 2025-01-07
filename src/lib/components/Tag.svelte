<script lang="ts">
  import {goto} from '$app/navigation';
  interface Props {
    tagName: string;
    marginLeft?: number;
    marginRight?: number;
  }

  let {tagName, marginLeft = 1, marginRight = 1}: Props = $props();
  const onClick = () => goto(`/tags#${tagName}`);
</script>
<button onclick={onClick}
  class="last:mr-0 bg-green-100 hover:bg-green-400 hover:text-white dark:text-black transition px-2 pl-3 py-0.5 rounded-sm shadow-md shadow-emerald-100 dark:shadow-green-900 my-0.5"
  style={`margin-right: ${marginRight * 0.25}rem; margin-left: ${marginLeft * 0.25}rem; clip-path: polygon(8px 0, 0 50%, 8px 100%, 100% 100%, 100% 0);`}
>
  #{tagName}
</button>
