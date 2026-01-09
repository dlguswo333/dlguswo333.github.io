<script lang="ts">
  import {defaultLang} from '$lib/index';
  import Tag from '$lib/components/Tag.svelte';
  import type {PostMetadata} from '$lib/types';
  import Category from './Category.svelte';

  interface Props {
    posts: PostMetadata[];
  }

  const {posts}: Props = $props();
  let indexLanguage = $derived((posts.find(({lang}) => lang === defaultLang) ?? posts[0]).lang);
  const indexPost = $derived(posts.find(({lang}) => lang === indexLanguage))!;
  const getPostUrl = (post: PostMetadata) => `/post/${post.date.split('-')[0]}/${post.id}/`;
</script>

{#snippet Anchor(href: string, text: string)}
  <a href={href} class="text-sky-500 visited:text-purple-600 hover:brightness-125 active:brightness-150 mr-2">
    {text}
  </a>
{/snippet}

<section
  class={`flex flex-col px-4 py-3 md:py-2 transition border rounded-md hover:bg-teal-50 dark:hover:bg-teal-700/20
    border-gray-200 hover:border-teal-200 dark:border-gray-600 dark:hover:border-teal-600
    shadow-sm hover:shadow-md shadow-gray-300 dark:shadow-gray-900 dark:hover:shadow-teal-900/50`}>
  <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
    <div class="inline-block">
      <h2 class="font-bold text-lg underline">
        {@render Anchor(getPostUrl(indexPost), indexPost.title)}
      </h2>
      {#if posts.length > 1}
        {#each posts as post}
          {#if post.lang !== indexLanguage}
            <h3 class="font-bold text-sm underline">
              {@render Anchor(getPostUrl(post), post.title)}
            </h3>
          {/if}
        {/each}
      {/if}
    </div>
    <div class="text-sm flex flex-row self-stretch md:self-start justify-between items-center">
      <span>
        {indexPost.date}
        {#if indexPost.editedDate}
          (Edit {indexPost.editedDate})
        {/if}
      </span>
      <span class="ml-2">
        {#if posts.length > 1}
          {#each posts as post}
            <button
              class={
                `transition px-2 py-0.5 rounded-md [&:not(:last-child)]:mr-1
               hover:bg-lime-200 active:bg-lime-300 dark:hover:bg-slate-600 dark:active:bg-teal-800
                ${indexLanguage === post.lang ? 'underline' : ''}`
              }
              type="button"
              onclick={() => indexLanguage = post.lang}
            >
              {post.lang}
            </button>
          {/each}
        {:else}
          {indexLanguage}
        {/if}
      </span>
    </div>
  </div>
  <div>
    <span>
      {#if indexPost.category}
        <Category categoryName={indexPost.category} />
      {/if}
      <span>
        {#if indexPost.tags}
          {#each indexPost.tags as tag, index}
            <Tag tagName={tag} marginLeft={index === 0 ? 2 : 0} marginRight={1} />
          {/each}
        {/if}
      </span>
    </span>
  </div>
  {#if indexPost.summary}
    <div class="mt-4" style={'overflow-wrap: anywhere;'}>
      {indexPost.summary}
    </div>
  {/if}
</section>
