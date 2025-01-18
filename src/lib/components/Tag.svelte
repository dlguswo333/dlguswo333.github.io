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
  class="my-0.5 last:mr-0 bg-transparent rounded-sm overflow-hidden"
  style:margin-left={`${marginLeft * 0.25}rem`}
  style:margin-right={`${marginRight * 0.25}rem`}
  style:filter="drop-shadow(0px 2px 3px rgb(100 140 120 / .5))"
>
  <div class="bg-green-100 hover:bg-green-400 hover:text-white dark:text-black transition px-2 pl-3 py-0.5"
    style:clip-path="polygon(8px 0, 0 50%, 8px 100%, 100% 100%, 100% 0)"
  >
    #{tagName}
  </div>
</button>
