import type {ColorTheme} from '$lib/types';

const storedValue = JSON.parse(localStorage.getItem('color-theme') || '');
const systemTheme: ColorTheme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
const theme: ColorTheme = storedValue === 'light' || storedValue === 'dark' ? storedValue : systemTheme;
const rootElement = document.querySelector('div#root');
theme === 'dark' && rootElement?.classList.add('dark');
