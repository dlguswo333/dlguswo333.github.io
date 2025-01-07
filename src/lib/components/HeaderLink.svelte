<script lang="ts">
  interface Props {
    href: string;
    text: string;
    isActive: boolean;
  }

  let {href, text, isActive}: Props = $props();
</script>
<a href={href} class={
  `h-8 flex items-center justify-center mr-2 last:mr-1 px-1 py-0.5 rounded dark:active:bg-cyan-900 active:bg-cyan-50
   [@media(hover:hover)]:[@media(pointer:fine)]:hover:bg-gray-200 [@media(hover:hover)]:[@media(pointer:fine)]:dark:hover:bg-slate-600
   [@media(hover:hover)]:[@media(pointer:fine)]:dark:hover:text-white
   ${isActive ? 'bg-sky-100 dark:bg-sky-900' : ''}`}>
  {text}
</a>
