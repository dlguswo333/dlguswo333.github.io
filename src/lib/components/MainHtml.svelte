<script lang="ts">
  /** raw html in `string` type */
  export let html: string;
</script>
<!--
@component
Render raw html in main section.
-->
<main class="post max-w-[900px] py-2">
  {@html html}
</main>
