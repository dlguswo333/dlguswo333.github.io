import {writable, derived} from 'svelte/store';
import type {ColorTheme} from './types';

export const activeHeadingIndex = writable<number | null>(null);

export const showTOC = writable(false);

export const shouldShowTOCButton = writable(false);

export const shouldShowOverlay = derived(showTOC, ($showTOC) => $showTOC);

export const currentTheme = writable<ColorTheme | null>(null);
