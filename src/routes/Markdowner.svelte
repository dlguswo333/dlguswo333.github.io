<script lang="ts">
  import type {Parent, RootContent} from 'hast';
  import Self from './Markdowner.svelte';
  import SelfSvg from './MarkdownerSvg.svelte';
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
    {#if node.tagName === 'svg'}
      <SelfSvg node={node} />
    {:else}
      <svelte:element this={node.tagName} {...convertHastNodeProperties(node.properties)}>
        {@render Child()}
      </svelte:element>
    {/if}
  {/if}
{:else if 'value' in node}
  {#if node.type !== 'comment'}
    {node.value}
  {/if}
{:else}
  {@render Child()}
{/if}
