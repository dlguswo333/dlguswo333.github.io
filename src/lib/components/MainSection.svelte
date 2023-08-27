<script lang="ts">
  /** Raw html in `string` type */
  export let html: string | null = null;
  /** Additional class to add. */
  export let className: string | null = null;
</script>
<!--
@component
Render raw html in main section.
-->
<main class={`max-w-[900px] w-full py-2 ${className ? className : ''}`}>
  <slot />
  {#if html}
    {@html html}
  {/if}
</main>
