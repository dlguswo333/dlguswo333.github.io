import fs from 'node:fs/promises';
import path from 'node:path';
import {getFrontmatterFromMarkdown, getSummaryFromMarkdown} from './markdown';

type Frontmatter = {
  title: string;
  toc: boolean;
  category: string;
  tags: string[];
}

const summaryLength = 100;
const postBasePath = './markdown';
export const crawlResultFilePath = './posts.json';
const regex = {
  wholeNumber: /^\d+$/,
  markdownExtension: /\.md$/i,
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

export const crawlPost = async (postPath: string) => {
  const postContent = await fs.readFile(postPath, {encoding: 'utf-8'});
  const frontmatter = await getFrontmatterFromMarkdown<Frontmatter>(postContent);
  const summary = await getSummaryFromMarkdown(postContent, summaryLength);
  return {...frontmatter, summary};
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
