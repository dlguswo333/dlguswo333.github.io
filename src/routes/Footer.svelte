<script>
  import {blogRepositoryLink, name} from '$lib';
  import GithubMark from '$lib/components/GithubMark.svelte';
</script>
<footer class="p-2 py-5 text-sm flex gap-1 flex-col md:flex-row items-center justify-between border-t border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-[#2c3039]">
  <div>
    © 2021~2024 {name}; All rights reserved.
  </div>
  <div class="flex items-center">
    <a class="inline-flex items-center" href={blogRepositoryLink}>
      <GithubMark className="mr-1" hoverable={true} />
    </a>
    Built with Sveltekit.
  </div>
</footer>
