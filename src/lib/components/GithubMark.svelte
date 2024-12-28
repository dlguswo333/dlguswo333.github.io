<script lang="ts">
  export let className: string | null = null;
</script>
<img class={'inline dark:hidden h-4 w-4' + (className ? (' ' + className) : '')} src='/github-mark.svg' alt="github-mark">
<img class={'hidden dark:inline h-4 w-4' + (className ? (' ' + className) : '')} src='/github-mark-white.svg' alt="github-mark">
