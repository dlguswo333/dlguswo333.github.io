<script lang="ts">
  import {toggleTheme} from '$lib/colorTheme';
  const description = 'Toggle color theme';
</script>
<button type="button" title={description} aria-label={description}
  class='group'
  onclick={() => {
    toggleTheme();
  }}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
    class="h-8 w-8 transition dark:hidden">
    <rect x="3" y="3" width="94" height="94" stroke-width="6" rx="16" ry="16"
      class='stroke-black fill-none group-hover:fill-gray-700'/>
    <path d="M 50 20 A 30 30 0 1 1 24.02 65 A 30 30 1 0 0 50 20 Z" stroke-linecap="round" class="fill-none stroke-black group-hover:fill-yellow-300 group-hover:stroke-none" stroke-width="6" />
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
    class="h-8 w-8 transition hidden dark:block">
    <rect x="3" y="3" width="94" height="94" stroke-width="6" rx="16" ry="16"
      class='stroke-gray-400 fill-none group-hover:fill-gray-50'/>
    <circle cx="50" cy="50" r="20" class="stroke-gray-400 fill-none group-hover:stroke-none group-hover:fill-amber-500" stroke-width="6" />
    <line x1="8" y1="50" x2="22" y2="50" class="stroke-gray-400 group-hover:stroke-amber-500" stroke-width="6" />
    <line x1="8" y1="50" x2="22" y2="50" class="stroke-gray-400 group-hover:stroke-amber-500" stroke-width="6" transform="rotate(45, 50, 50)" />
    <line x1="8" y1="50" x2="22" y2="50" class="stroke-gray-400 group-hover:stroke-amber-500" stroke-width="6" transform="rotate(90, 50, 50)" />
    <line x1="8" y1="50" x2="22" y2="50" class="stroke-gray-400 group-hover:stroke-amber-500" stroke-width="6" transform="rotate(135, 50, 50)" />
    <line x1="8" y1="50" x2="22" y2="50" class="stroke-gray-400 group-hover:stroke-amber-500" stroke-width="6" transform="rotate(180, 50, 50)" />
    <line x1="8" y1="50" x2="22" y2="50" class="stroke-gray-400 group-hover:stroke-amber-500" stroke-width="6" transform="rotate(225, 50, 50)" />
    <line x1="8" y1="50" x2="22" y2="50" class="stroke-gray-400 group-hover:stroke-amber-500" stroke-width="6" transform="rotate(270, 50, 50)" />
    <line x1="8" y1="50" x2="22" y2="50" class="stroke-gray-400 group-hover:stroke-amber-500" stroke-width="6" transform="rotate(315, 50, 50)" />
  </svg>
</button>
