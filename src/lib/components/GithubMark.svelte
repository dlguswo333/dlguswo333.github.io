<script lang="ts">
  import {currentTheme as themeStore} from '$lib/store';

  export let className: string | null = null;

  const getGithubImgSrc = (currentTheme: typeof $themeStore) => {
    return currentTheme === 'dark' ? '/github-mark-white.svg' : '/github-mark.svg';
  };
  let githubImgSrc = getGithubImgSrc($themeStore);
  $: githubImgSrc = getGithubImgSrc($themeStore);
</script>
<img class={'inline h-4 w-4' + (className ? (' ' + className) : '')} src={githubImgSrc} alt="github-mark">
