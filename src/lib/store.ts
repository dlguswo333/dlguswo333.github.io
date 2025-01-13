// Global stores go into this file.
// But with Svelte v5, they may be migrated into runes.
// https://svelte.dev/docs/svelte/stores#When-to-use-stores
import {writable, derived} from 'svelte/store';
import type {ColorTheme, HeadingHighlight} from './types';

export const headingHighlight = writable<HeadingHighlight | null>(null);

/** Whether the screen size is small and should show TOC */
export const showTOC = writable(false);

export const tocItemHeight = writable(0);

export const shouldShowTOCButton = writable(false);

export const shouldShowOverlay = derived(showTOC, ($showTOC) => $showTOC);

/** @deprecated Not used anywhere but left for unknown future. */
export const currentTheme = writable<ColorTheme | null>(null);
