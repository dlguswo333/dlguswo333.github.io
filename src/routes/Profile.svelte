<script lang="ts">
  import {name, email, githubUserName} from '$lib';
  import GithubMark from '$lib/components/GithubMark.svelte';

  const profileImageSrc = `https://github.com/${githubUserName}.png`;
</script>
<aside class="max-w-[300px] hidden mt-10 self-start md:!flex flex-col justify-center items-center p-5">
  <img class="mb-5 rounded-xl border-2 border-slate-200" src={profileImageSrc} alt="profile" width="110" height="110">
  <ul class="[&>li]:p-0.5 [&_span]:inline-flex [&_span]:items-center [&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-b-gray-300 [&>li:not(:last-child)]:pb-1 [&>li:not(:first-child)]:pt-1 [&>li:not(:first-child)]:text-sm whitespace-nowrap">
    <li class="flex justify-center">
      <span>{name}</span>
    </li>
    <li>
      <span>@:</span>
      <a href={`mailto:${email}`} class="text-blue-500 hover:underline">{email}</a>
    </li>
    <li>
      <span><GithubMark />:</span>
      <a href={`https://github.com/${githubUserName}`} class="text-blue-500 hover:underline">Github Link</a>
    </li>
  </ul>
</aside>
