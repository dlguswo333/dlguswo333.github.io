<script lang="ts">
  import Category from '$lib/components/Category.svelte';
  import MainSection from '$lib/components/MainSection.svelte';
  import TOC from '$lib/components/TOC.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import {onMount} from 'svelte';
  import {defaultLang, name} from '$lib/index';
  import Lang from '$lib/components/Lang.svelte';
  import {afterNavigate} from '$app/navigation';

  export let data;
  // Since Sveltekit may reuse components, some components may not be destroyed and recreated.
  // But data props change. See: https://github.com/dlguswo333/dlguswo333.github.io/issues/44

  $: postTitle = data.frontmatter?.title;
  $: postLang = data.lang || defaultLang;
  $: postAvailableLangs = data.langs;

  onMount(() => {
    // Update document lang property on mount.
    document.documentElement.lang = postLang;
    return () => {
      // Sveltekit does not revert document title on dismount.
      // See #4.
      document.title = `${name}'s blog`;
      document.documentElement.lang = defaultLang;
    };
  });

  afterNavigate(() => {
    // Update document lang property even in the case the component do not re-mount.
    document.documentElement.lang = postLang;
  });
</script>
<svelte:head>
  <title>{(postTitle ? `${postTitle} : ` : '')}{name}'s blog</title>
</svelte:head>

<div class="flex flex-row flex-grow justify-center p-2 lg:p-0 lg:pr-[300px]">
  {#if data.tocData}
    <TOC data={data.tocData} />
  {/if}
  <!-- min-width: 0 is needed to prevent this element grow bigger than the parent -->
  <div class="flex flex-col justify-center min-w-0 my-10 md:my-15">
    {#if data.frontmatter}
      <div class="max-w-[900px] flex flex-col items-center py-6 gap-3">
        <h1 class="text-4xl font-bold text-center">{postTitle}</h1>
        <span>
          {data.date}
          {#if data.frontmatter.editedDate}
            (Edited {data.frontmatter.editedDate})
          {/if}
        </span>
        {#if data.frontmatter.category}
          <Category categoryName={data.frontmatter.category} />
        {/if}
        <div>
          {#each data.frontmatter.tags as tag, index}
            <Tag tagName={tag} marginLeft={index === 0 ? 2 : 0} marginRight={1} />
          {/each}
        </div>
        {#if postAvailableLangs.length > 1}
          <div>
            🌐
            {#each postAvailableLangs as lang}
              <Lang
                lang={lang}
                getIsActive={(lang) => postLang === lang}
                url={`/post/${data.date.split('-')[0]}/${data.id.replace(postLang, lang)}/`}
              />
            {/each}
          </div>
        {/if}
      </div>
      <hr class="bg-gray-400 my-4" />
    {/if}
    <MainSection html={data.html} tocDataExists={!!data.tocData.length} className="post" />
  </div>
</div>
