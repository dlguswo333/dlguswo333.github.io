import fs from 'node:fs/promises';
import path from 'node:path';
import {getFrontmatterFromMarkdown, getSummaryFromMarkdown} from './markdown';
import {postBasePath} from '$lib';
import type {Frontmatter, PostMetadata} from './types';
import FileBasedCache from './FileBasedCache';

const summaryLength = 100;
export const crawlPostsCacheFilePath = './.posts.json';
const regex = {
  wholeNumber: /^\d+$/,
  markdownExtension: /\.md$/i,
  postFileNameFormat: /^((\d+)-(\d+)-([a-z]{2})-([^.]+))\.md$/,
} as const;

export const compareStringDesc = (a: string, b: string) => (
  b.localeCompare(a)
);

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

const removeDateLangFromPostId = (id: string) => {
  const regexResult = regex.postFileNameFormat.exec(`${id}.md`);
  if (!regexResult) {
    throw new Error(`${id} does not follow the post file name format!`);
  }
  const idWithoutDateLang = regexResult[5];
  return idWithoutDateLang;
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
  const crawlPostsCache = new FileBasedCache<PostMetadata>(crawlPostsCacheFilePath);
  await crawlPostsCache.initCache();
  const posts = [];

  const postPaths = await getPostPaths();
  for (const postPath of postPaths) {
    const crawledResult = await crawlPostsCache.get(postPath, async () => {
      const crawledResult = await crawlPost(postPath);
      return crawledResult;
    });
    posts.push(crawledResult);
  }
  await crawlPostsCache.rewriteCache();
  return posts;
};

/** Group by topic so that same posts with multi languages are clustered. */
export const groupPostsByTopic = (posts: PostMetadata[]): PostMetadata[][] => {
  const groupedById = Object.groupBy(
    posts,
    (post) => `${post.date}-${removeDateLangFromPostId(post.id)}`
  );
  return Object.values(groupedById).filter(v => v !== undefined);
};

/** Get available language list of the post according to fileNames */
export const getAvailableLanguagesOfPost = async (postFilePath: string): Promise<string[]> => {
  const {date, id} = getDateLangIdFromPostPath(postFilePath);
  const crawledResult = await crawlPosts();
  const idWithoutDateLang = removeDateLangFromPostId(id);
  const matchingPosts = crawledResult.filter((candidate) =>
    date === candidate.date && idWithoutDateLang === removeDateLangFromPostId(candidate.id));
  return matchingPosts.map(({lang}) => lang);
};

export default crawlPosts;
