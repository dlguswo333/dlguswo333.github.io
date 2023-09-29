import type {ColorTheme} from '$lib/types';

export const getCurrentTheme = () => {
  const storedValue = JSON.parse(localStorage.getItem('color-theme') || '');
  const systemTheme: ColorTheme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  const currentTheme: ColorTheme = storedValue === 'light' || storedValue === 'dark' ? storedValue : systemTheme;
  return currentTheme;
};

const rootElement = document.querySelector('div#root');
const currentTheme = getCurrentTheme();
currentTheme === 'dark' && rootElement?.classList.add('dark');
