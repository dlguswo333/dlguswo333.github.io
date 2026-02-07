<script lang="ts">
  import {getClasses} from '$lib/string';

  interface Props {
    children?: import('svelte').Snippet;
    preProperties?: Record<string, unknown>;
  }
  let preElement: HTMLPreElement;
  let {children, preProperties}: Props = $props();
  let copyResult = $state<boolean | null>(null);

  const getLanguage = () => {
    if (typeof preProperties?.class !== 'string') {
      return undefined;
    }
    const match = preProperties.class.match(/language-(\w+)/);
    if (match === null) {
      return undefined;
    }
    return match[1];
  };
  const language = getLanguage();

  const copy = () => {
    if (copyResult) {
      return;
    }
    try {
      if (!preElement.textContent) {
        throw new Error('Text does not exist');
      }
      navigator.clipboard.writeText(preElement.textContent);
      copyResult = true;
      setTimeout(() => {
        copyResult = false;
      }, 1000);
    } catch {
      alert('Writing to clipboard failed. Please check if your browser supports clipboard.');
    }
  };
</script>
<div class="overflow-hidden border border-gray-300 dark:border-gray-700 rounded-md my-2">
  <div class="border-b border-gray-300 dark:border-gray-700 flex flex-row justify-between px-2 py-1">
    <div class="flex items-center font-mono text-sm">
      {#if language !== undefined}
        {language}
      {/if}
    </div>
    <button onclick={copy} class={getClasses('relative px-2 py-1 rounded-md text-sm bg-slate-100 dark:bg-slate-700 text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-500 active:bg-emerald-300 dark:active:bg-emerald-400', {'text-transparent': !!copyResult})}>
      Copy
      {#if copyResult}
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute w-[100%] h-[100%] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] aspect-square p-1" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="#3d3" />
          <path d="M 20 50 L 40 70 L 80 30 M 20 50 Z" stroke="white" stroke-linecap="round" stroke-width="10" fill="none" />
        </svg>
      {/if}
    </button>
  </div>
  <!-- [NOTE] whitespaces within pre tag are render as-is even the indentations within the tag. -->
  <pre {...preProperties} bind:this={preElement}>{@render children?.()}</pre>
</div>
