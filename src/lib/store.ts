import {writable, derived} from 'svelte/store';

export const activeHeadingIndex = writable<number | null>(null);

export const showTOC = writable(false);

export const shouldShowTOCButton = writable(false);

export const shouldShowOverlay = derived(showTOC, ($showTOC) => $showTOC);
