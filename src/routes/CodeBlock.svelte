<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
    preProperties?: Record<string, unknown>;
  }
  let preElement: HTMLPreElement;
  let {children, preProperties}: Props = $props();
  const copy = () => {
    try {
      navigator.clipboard.writeText(preElement.textContent);
    } catch {
      alert('Writing to clipboard failed. Please check if your browser supports clipboard.');
    }
  };
</script>
<div class="border border-black rounded-md">
  <div class="border-b border-black flex flex-row justify-between px-2 py-1">
    <div class="w-0 h-0"></div>
    <button onclick={copy} class="px-2 py-1 rounded-md text-sm bg-slate-100 dark:bg-slate-700 text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-500 active:bg-emerald-300 dark:active:bg-emerald-400">Copy</button>
  </div>
  <!-- [NOTE] whitespaces within pre tag are render as-is even the indentations within the tag. -->
  <pre {...preProperties} bind:this={preElement}>{@render children?.()}</pre>
</div>
