import {postBasePath} from '$lib';
import {getHtmlFromMarkdown} from '$lib/markdown.js';
import {error} from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';

export const load = async () => {
  const postFilePath = path.join(postBasePath, 'about.md');
  let rawContent: string | null;
  try {
    rawContent = await fs.readFile(postFilePath, {encoding: 'utf-8'});
  } catch (e) {
    console.error(e);
    error(404);
  }
  try {
    const {root} = await getHtmlFromMarkdown(rawContent, false);
    return {root};
  } catch (e) {
    console.error(e);
    error(500);
  }
};
