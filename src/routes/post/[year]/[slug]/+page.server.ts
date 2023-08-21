import {postBasePath} from '$lib';
import {getDateLangIdFromPostPath, type Frontmatter} from '$lib/crawlPosts';
import {getFrontmatterFromMarkdown, getHtmlFromMarkdown} from '$lib/markdown.js';
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
    const html = await getHtmlFromMarkdown(rawContent);
    const {date, lang} = getDateLangIdFromPostPath(postFilePath);
    const frontmatter = await getFrontmatterFromMarkdown<Frontmatter>(rawContent);
    return {html, frontmatter, date, lang};
  } catch (e) {
    console.error(e);
    throw error(500);
  }
};
