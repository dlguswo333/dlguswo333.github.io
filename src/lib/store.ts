import {writable} from 'svelte/store';

export const activeHeadingIndex = writable<number | null>(null);
