/**
 * This file contains codes directly related to markdown
 * unified, remark, rehype
 */
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify';
import rehypePrism from 'rehype-prism-plus';
import yaml from 'yaml';
import type {Root, Content} from 'mdast';

/**
 * Extract summary from markdown.
 */
export const getSummaryFromMarkdown = async (markdown: string, targetLength: number) => {
  let summary: string | null = null;
  const visit = (node: Content) => {
    if (summary && summary.length >= targetLength) {
      return;
    }
    if (node.type === 'heading' || node.type === 'yaml') {
      // No need to visit these nodes recursively.
      return;
    }
    if (node.type === 'text' || node.type === 'inlineCode') {
      const text = node.value.trim();
      if (text) {
        summary = summary === null ? text : `${summary} ${text}`;
      }
    }
    if (!('children' in node)) {
      return;
    }
    node.children.forEach(visit);
  };
  await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (root: Root) => {
      root.children.forEach(visit);
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return summary as string | null;
};

/**
 * Extract frontmatter from markdown.
 */
export const getFrontmatterFromMarkdown = async <T> (markdown: string) => {
  let frontmatter = null;
  await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (root: Root) => {
      const [yamlNode] = root.children.filter(node => /^yaml$/i.test(node.type));
      if (!('value' in yamlNode)) {
        return;
      }
      const yamlContent = yamlNode.value;
      frontmatter = yaml.parse(yamlContent);
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return frontmatter as T | null;
};

/**
 * Convert markdown to HTML. Does not include frontmatter.
 */
export const getHtmlFromMarkdown = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(markdown);

  const html = String(result);
  return html;
};
