<script lang="ts">
  import {blogRepositoryLink, name} from '$lib';
  import GithubMark from '$lib/components/GithubMark.svelte';
  const startYear = 2021;
  const endYear = new Date().getFullYear();
</script>
<footer class="p-2 py-5 text-sm flex gap-1 flex-col md:flex-row items-center justify-between border-t border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-[#2c3039]">
  <div>
    © {startYear}-{endYear} {name}; All rights reserved.
  </div>
  <div class="flex items-center">
    <a class="inline-flex items-center" href={blogRepositoryLink} title="Go to blog repository">
      <GithubMark className="mr-1" hoverable={true} />
    </a>
    Built with Sveltekit.
  </div>
</footer>
