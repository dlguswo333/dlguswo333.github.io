import {postBasePath} from '$lib';
import {getAvailableLanguagesOfPost, getDateLangIdFromPostPath} from '$lib/crawlPosts';
import {getFrontmatterFromMarkdown, getHtmlFromMarkdown} from '$lib/markdown.js';
import type {Frontmatter} from '$lib/types';
import {error} from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';
import type {PageServerLoad} from './$types';
import {getImageSizes} from '$lib/server';

export const load: PageServerLoad = async ({params}) => {
  const {year, slug} = params;
  if (year === undefined || slug === undefined) {
    error(404);
  }
  const postFilePath = `${path.join(postBasePath, year, slug)}.md`;
  let rawContent: string | null;
  try {
    rawContent = await fs.readFile(postFilePath, {encoding: 'utf-8'});
  } catch (e) {
    console.error(e);
    error(404);
  }
  try {
    const {date, lang, id} = getDateLangIdFromPostPath(postFilePath);
    const frontmatter = await getFrontmatterFromMarkdown<Frontmatter>(rawContent);
    const {root, tocData} = await getHtmlFromMarkdown(rawContent, !!frontmatter?.toc);
    const langs = await getAvailableLanguagesOfPost(postFilePath);
    const imageSizes = await getImageSizes();
    return {root, frontmatter, date, lang, id, tocData, langs, imageSizes};
  } catch (e) {
    console.error(e);
    error(500);
  }
};
