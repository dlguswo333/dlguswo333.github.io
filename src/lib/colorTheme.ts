import type {ColorTheme} from '$lib/types';
import {browser} from '$app/environment';

export const getCurrentTheme = () => {
  const systemTheme: ColorTheme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  try {
    const storedValue = JSON.parse(localStorage.getItem('color-theme') || 'null');
    const currentTheme: ColorTheme = storedValue === 'light' || storedValue === 'dark' ? storedValue : systemTheme;
    return currentTheme;
  } catch {
    return systemTheme;
  }
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
