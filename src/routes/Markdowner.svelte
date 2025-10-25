<script lang="ts">
  import type {Parent, RootContent} from 'hast';
  import Self from './Markdowner.svelte';
  import SelfSvg from './MarkdownerSvg.svelte';
  import {getHtmlAttributes} from '$lib/string';
  import CodeBlock from './CodeBlock.svelte';

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
    {#if node.tagName === 'img'}
      <img {...node.properties} />
    {:else}
      <svelte:element this={node.tagName} {...node.properties} />
    {/if}
  {:else}
    {#if node.tagName === 'svg'}
      <SelfSvg node={node} />
    {:else if node.tagName === 'style'}
      <!-- [workaround]
        Svelte preprocessor tries to parse style tag for no reason; need to obfuscate it.
        https://github.com/sveltejs/svelte-preprocess/issues/507
      -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html '<styl' + `e ${getHtmlAttributes(node.properties)}>${node.children.map(child => child.type === 'text' ? child.value : '')}</styl` + 'e>'}
    {:else if node.tagName === 'pre'}
      <CodeBlock preProperties={node.properties}>
        {@render Child()}
      </CodeBlock>
    {:else}
      <svelte:element this={node.tagName} {...node.properties}>
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
