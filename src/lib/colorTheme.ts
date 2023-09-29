import type {ColorTheme} from '$lib/types';

export const getCurrentTheme = () => {
  const storedValue = JSON.parse(localStorage.getItem('color-theme') || '');
  const systemTheme: ColorTheme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  const currentTheme: ColorTheme = storedValue === 'light' || storedValue === 'dark' ? storedValue : systemTheme;
  return currentTheme;
};

const rootElement = browser ? document.querySelector('div#root') : null;
if (browser) {
const currentTheme = getCurrentTheme();
currentTheme === 'dark' && rootElement?.classList.add('dark');
}

export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const targetTheme: ColorTheme = currentTheme === 'light' ? 'dark' : 'light';
  rootElement?.classList.add(targetTheme);
  localStorage.setItem('color-theme', JSON.stringify(targetTheme));
};
