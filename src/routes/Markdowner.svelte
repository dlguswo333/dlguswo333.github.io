<script lang="ts">
  import type {Parent, RootContent} from 'hast';
  import Self from './Markdowner.svelte';

  interface Props {
    node: Parent | RootContent;
  }
  const {node}: Props = $props();
</script>

{#snippet Child()}
  {#if 'children' in node}
    {#each node.children as child}
      <Self node={child} />
    {/each}
  {/if}
{/snippet}

{#if node.type === 'raw' && 'value' in node && typeof node.value === 'string'}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html node.value}
{:else if 'tagName' in node}
  <svelte:element this={node.tagName} {...node.properties}>{@render Child()}</svelte:element>
{:else if 'value' in node}
  {node.value}
{:else}
  {@render Child()}
{/if}
