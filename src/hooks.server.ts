import {defaultLang} from '$lib';
import type {Handle} from '@sveltejs/kit';

// server Hooks do not run on client side navigation,
// thus be careful to correctly set lang field on client side navigation.
const getLangFromPathname = (pathname: string) => {
  const postPathNameFormat = /^\/post\/\d+\/\d+-\d+-([a-z]{2})-([^/]+)\/?$/;
  const regexResult = postPathNameFormat.exec(pathname);
  if (!regexResult) {
    return defaultLang;
  }
  const lang = [...regexResult][1] || defaultLang;
  return lang;
};

// Refer https://kit.svelte.dev/docs/hooks
export const handle: Handle = ({event, resolve}) => {
  return resolve(event, {
    transformPageChunk: ({html}) => {
      const lang = getLangFromPathname(event.url.pathname);
      return html.replace('%lang%', lang);
    },
  });
};
