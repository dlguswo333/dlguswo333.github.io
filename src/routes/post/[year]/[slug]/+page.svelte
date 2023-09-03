<script lang="ts">
  import Category from '$lib/components/Category.svelte';
  import MainSection from '$lib/components/MainSection.svelte';
  import TOC from '$lib/components/TOC.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import {onMount} from 'svelte';
  import {defaultLang, name} from '$lib/index';

  export let data;
  const postTitle = data.frontmatter?.title;
  const postLang = data.lang || defaultLang;
  onMount(() => {
    document.documentElement.lang = postLang;
    return () => {
      // Sveltekit does not revert document title on dismount.
      // See #4.
      document.title = `${name}'s blog`;
      document.documentElement.lang = defaultLang;
    };
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
  <div class="flex flex-col justify-center min-w-0">
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
      </div>
      <hr class="bg-gray-400 my-4" />
    {/if}
    <MainSection html={data.html} tocDataExists={!!data.tocData.length} className="post" />
  </div>
</div>
