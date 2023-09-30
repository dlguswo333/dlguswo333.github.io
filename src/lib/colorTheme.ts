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

const rootElement = browser ? document.querySelector('body') : null;
if (browser) {
  const currentTheme = getCurrentTheme();
  rootElement?.classList.add(currentTheme);
}

export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const targetTheme: ColorTheme = currentTheme === 'light' ? 'dark' : 'light';
  rootElement?.classList.remove(currentTheme);
  rootElement?.classList.add(targetTheme);
  localStorage.setItem('color-theme', JSON.stringify(targetTheme));
};
