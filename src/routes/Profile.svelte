<script lang="ts">
  import {name, email, githubUserName} from '$lib';
  const profileImageSrc = `https://github.com/${githubUserName}.png`;
</script>
<aside class="max-w-[300px] hidden mt-10 self-start md:!flex flex-col justify-center items-center p-5">
  <img class="mb-5 rounded-xl border-2 border-slate-200" src={profileImageSrc} alt="profile" width="110" height="110">
  <ul class="[&>li]:p-0.5 [&_label]:inline-flex [&_label]:items-center [&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-b-gray-300 [&>li:not(:last-child)]:pb-1 [&>li:not(:first-child)]:pt-1 [&>li:not(:first-child)]:text-sm whitespace-nowrap">
    <li class="flex justify-center">
      <span>{name}</span>
    </li>
    <li>
      <label for="profile-email">@:</label>
      <a href={`mailto:${email}`} id="profile-email" class="text-blue-500">{email}</a>
    </li>
    <li>
      <label for="profile-github"><img class="inline h-4 w-4" src="/github-mark.svg" alt="github-mark">:</label>
      <a href={`https://github.com/${githubUserName}`} id="profile-github" class="text-blue-500">Github Link</a>
    </li>
  </ul>
</aside>
