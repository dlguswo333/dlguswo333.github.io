import fs from 'node:fs/promises';
import path from 'node:path';
import {getFrontmatterFromMarkdown, getSummaryFromMarkdown} from './markdown';

type Frontmatter = {
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

const summaryLength = 100;
const postBasePath = './markdown';
export const crawlResultFilePath = './posts.json';
const regex = {
  wholeNumber: /^\d+$/,
  markdownExtension: /\.md$/i,
  postFileNameFormat: /^(\d+)-(\d+)-([a-z]+)-([^.]+)\.md$/,
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
  const [, month, day, lang, postId] = [...regexResult];
  const date = `${year}-${month}-${day}`;
  return {
    date, lang, id: postId,
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

const crawlPosts = async () => {
  const posts = [];
  const postPaths = await getPostPaths();
  for (const postPath of postPaths) {
    posts.push(await crawlPost(postPath));
  }
  return posts;
};

export default crawlPosts;
