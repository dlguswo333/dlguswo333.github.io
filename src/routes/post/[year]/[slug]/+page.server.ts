import {postBasePath} from '$lib';
import {getAvailableLanguagesOfPost, getDateLangIdFromPostPath} from '$lib/crawlPosts';
import {getFrontmatterFromMarkdown, getHtmlFromMarkdown} from '$lib/markdown.js';
import type {Frontmatter} from '$lib/types';
import {error} from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';

export const load = async ({params}) => {
  const {year, slug} = params;
  const postFilePath = `${path.join(postBasePath, year, slug)}.md`;
  let rawContent: string | null;
  try {
    rawContent = await fs.readFile(postFilePath, {encoding: 'utf-8'});
  } catch (e) {
    console.error(e);
    throw error(404);
  }
  try {
    const {date, lang} = getDateLangIdFromPostPath(postFilePath);
    const frontmatter = await getFrontmatterFromMarkdown<Frontmatter>(rawContent);
    const {html, tocData} = await getHtmlFromMarkdown(rawContent, !!frontmatter?.toc);
    const langs = getAvailableLanguagesOfPost(postFilePath);
    return {html, frontmatter, date, lang, tocData, langs};
  } catch (e) {
    console.error(e);
    throw error(500);
  }
};
