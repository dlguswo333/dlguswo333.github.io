import fs from 'node:fs/promises';
import path from 'node:path';
import {getFrontmatterFromMarkdown, getSummaryFromMarkdown} from './markdown';
import {postBasePath} from '$lib';

export type Frontmatter = {
  title: string;
  toc: boolean | null;
  editedDate: string | null;
  category: string | null;
  tags: string[];
}

type PostMetadata = Frontmatter & {
  summary: string | null;
  lang: string;
  date: string;
  id: string;
}

type CachedPostMetadata = PostMetadata & {
  crawledTimestamp: number;
}

const summaryLength = 100;
export const crawlResultFilePath = './.posts.json';
const regex = {
  wholeNumber: /^\d+$/,
  markdownExtension: /\.md$/i,
  postFileNameFormat: /^((\d+)-(\d+)-([a-z]+)-([^.]+))\.md$/,
} as const;

export const compareStringDesc = (a: string, b: string) => (
  b.localeCompare(a)
);

const fileExists = async (filePath: string) => {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
};

export const getPostPaths = async () => {
  const postPaths = [];
  const yearFolders = (await fs.readdir(postBasePath, {recursive: true, withFileTypes: true}))
    .filter(entry => entry.isDirectory() && regex.wholeNumber.test(entry.name))
    .sort((a, b) => compareStringDesc(a.name, b.name));
  for (const yearFolder of yearFolders) {
    const yearPath = path.join(postBasePath, yearFolder.name);
    const postFiles = (await fs.readdir(yearPath, {recursive: false, withFileTypes: true}))
      .filter(entry => entry.isFile() && regex.markdownExtension.test(entry.name))
      .sort((a, b) => compareStringDesc(a.name, b.name));
    for (const postFile of postFiles) {
      const postPath = path.join(yearPath, postFile.name);
      postPaths.push(postPath);
    }
  }
  return postPaths;
};

/**
 * Get date, language and post ID from the given post path.
 */
export const getDateLangIdFromPostPath = (postPath: string) => {
  const paths = postPath.split(path.sep);
  const year = paths[paths.length - 2];
  const regexResult = regex.postFileNameFormat.exec(paths[paths.length - 1]);
  if (!regexResult) {
    throw new Error(`${postPath} does not folllow the post file name format!`);
  }
  const [, fileName, month, day, lang] = [...regexResult];
  const date = `${year}-${month}-${day}`;
  return {
    date, lang, id: fileName,
  };
};

export const crawlPost = async (postPath: string): Promise<PostMetadata> => {
  const postContent = await fs.readFile(postPath, {encoding: 'utf-8'});
  const frontmatter = await getFrontmatterFromMarkdown<Frontmatter>(postContent);
  const summary = await getSummaryFromMarkdown(postContent, summaryLength);
  const extraMetadata = getDateLangIdFromPostPath(postPath);
  if (!frontmatter) {
    throw new Error(`${postPath}'s frontmatter is empty!`);
  }
  if (!frontmatter.title) {
    throw new Error(`${postPath}'s title is empty!`);
  }
  if (!frontmatter.toc) {
    frontmatter.toc = null;
  }
  if (!frontmatter.editedDate) {
    frontmatter.editedDate = null;
  }
  if (!frontmatter.category) {
    frontmatter.category = null;
  }
  if (!frontmatter.tags) {
    throw new Error(`${postPath}'s tag is empty! Specify '[]' if the post does not have any tag.`);
  }
  return {
    ...frontmatter, ...extraMetadata, summary,
  };
};

const crawlPosts = async (): Promise<PostMetadata[]> => {
  let cachedPosts: { [postPath: string]: CachedPostMetadata } = {};
  let rewriteCacheFile = false;
  if (await fileExists(crawlResultFilePath)) {
    const cacheFileContent = await fs.readFile(crawlResultFilePath, {encoding: 'utf-8'});
    cachedPosts = JSON.parse(cacheFileContent) as {[k: string]: CachedPostMetadata};
  }
  const posts = [];
  const postPaths = await getPostPaths();
  for (const postPath of postPaths) {
    const fileStat = await fs.stat(postPath);
    if (cachedPosts[postPath]?.crawledTimestamp >= fileStat.mtimeMs) {
      const {crawledTimestamp: _, ...clonedPost} = {...cachedPosts[postPath]};
      posts.push(clonedPost);
      continue;
    }
    rewriteCacheFile = true;
    const crawledResult = await crawlPost(postPath);
    posts.push(crawledResult);
    cachedPosts[postPath] = {...crawledResult, crawledTimestamp: fileStat.mtimeMs};
  }
  if (rewriteCacheFile) {
    await fs.writeFile(crawlResultFilePath, JSON.stringify(cachedPosts));
  }
  return posts;
};

export default crawlPosts;
