<script lang="ts">
  export let lang: string;
  export let getIsActive: (lang: string) => boolean;
  export let url: string;
  export let marginLeft: number = 1;
  export let marginRight: number = 1;
  console.log(lang, url);
// const onClick = () => goto(url);
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
