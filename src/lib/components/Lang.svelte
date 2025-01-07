<script lang="ts">
  interface Props {
    lang: string;
    getIsActive: (lang: string) => boolean;
    url: string;
    marginLeft?: number;
    marginRight?: number;
  }

  let {
    lang,
    getIsActive,
    url,
    marginLeft = 1,
    marginRight = 1,
  }: Props = $props();
</script>
<a
  class={
    `last:mr-0 my-0.5 transition px-2 py-0.5 rounded-md border-2
    bg-lime-100 dark:text-black dark:shadow-green-900
    ${getIsActive(lang) ? 'border-yellow-300 shadow-inner cursor-default bg-lime-50' : 'shadow-md hover:text-white hover:bg-lime-400'}`
  }
  href={url}
  style={`margin-right: ${marginRight * 0.25}rem; margin-left: ${marginLeft * 0.25}rem`}
>
  {lang}
</a>
