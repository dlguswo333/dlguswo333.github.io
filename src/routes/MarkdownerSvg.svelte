<!-- [NOTE] SVG needs to be rendered with special option in Svelte. -->
<svelte:options namespace="svg" />
<script lang="ts">
  import type {Parent, RootContent} from 'hast';
  import Self from './MarkdownerSvg.svelte';
  import {convertHastNodeProperties} from '$lib/markdown';

  interface Props {
    node: Parent | RootContent;
  }
  const {node}: Props = $props();
  const voidElements = ['br', 'hr', 'img', 'input', 'link'];
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
  {#if voidElements.includes(node.tagName)}
    <svelte:element this={node.tagName} {...convertHastNodeProperties(node.properties)} />
  {:else}
    <svelte:element this={node.tagName} {...convertHastNodeProperties(node.properties)}>
      {@render Child()}
    </svelte:element>
  {/if}
{:else if 'value' in node}
  {node.value}
{:else}
  {@render Child()}
{/if}
