<script>
  import {blogRepositoryLink, name} from '$lib';
</script>
<footer class="p-2 py-5 text-sm flex gap-1 flex-col md:flex-row items-center justify-between border-t border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-[#2c3039]">
  <div>
    ©️ 2021~2023 {name}; All rights reserved.
  </div>
  <div class="flex items-center">
    <a class="inline-flex items-center" href={blogRepositoryLink}>
      <img class="inline h-4 w-4 mr-1" src="/github-mark.svg" alt="github-mark">
    </a>
    Built with Sveltekit.
  </div>
</footer>
