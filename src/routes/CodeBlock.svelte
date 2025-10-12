<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
    preProperties?: Record<string, unknown>;
  }
  let preElement: HTMLPreElement;
  let {children, preProperties}: Props = $props();
  const copy = () => {
    try {
      if (!preElement.textContent) {
        throw new Error('Text does not exist');
      }
      navigator.clipboard.writeText(preElement.textContent);
    } catch {
      alert('Writing to clipboard failed. Please check if your browser supports clipboard.');
    }
  };
</script>
<div class="overflow-hidden border border-gray-300 dark:border-gray-700 rounded-md my-2">
  <div class="border-b border-gray-300 dark:border-gray-700 flex flex-row justify-between px-2 py-1">
    <div class="w-0 h-0"></div>
    <button onclick={copy} class="px-2 py-1 rounded-md text-sm bg-slate-100 dark:bg-slate-700 text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-500 active:bg-emerald-300 dark:active:bg-emerald-400">Copy</button>
  </div>
  <!-- [NOTE] whitespaces within pre tag are render as-is even the indentations within the tag. -->
  <pre {...preProperties} bind:this={preElement}>{@render children?.()}</pre>
</div>
