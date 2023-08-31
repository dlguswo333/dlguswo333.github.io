/**
 * This file contains codes directly related to markdown
 * unified, remark, rehype
 */
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import rehypeStringify from 'rehype-stringify';
import rehypePrism from 'rehype-prism-plus';
import yaml from 'yaml';
import type {Root, Content} from 'mdast';
import type {Element} from 'hast';
import type {TOCItem} from './types';
import {maxHeadingDepthInToc} from '$lib';
import {removeXSSCharacters} from '$lib/string';

/** To prevent unintended overlap between heading IDs. */
export const getHeadingPrefix = (index: number) => `${index}-`;
const headingTagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

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
 * Get text from heading node.
 */
const getTextFromHeading = (node: Element) => {
  let text = '';
  node.children.forEach((child) => {
    if (child.type === 'text') {
      text += child.value;
    } else if (child.type === 'element') {
      text += getTextFromHeading(child);
    }
  });
  return text;
};

/**
 * Convert markdown to HTML. Does not include frontmatter.
 */
export const getHtmlFromMarkdown = async (markdown: string, includeToc: boolean) => {
  const compiler = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeMathjax)
    .use(rehypePrism, {showLineNumbers: true})
    .use(rehypeStringify, {allowDangerousHtml: true});

  const headings: TOCItem[] = [];

  const result = compiler.parse(markdown);
  const root = await compiler.run(result);
  if (includeToc) {
    root.children.forEach((child) => {
      if (child.type === 'element') {
        if (headingTagNames.includes(child.tagName)) {
          const headingDepth = Number(child.tagName[1]);
          if (headingDepth > maxHeadingDepthInToc) {
            return;
          }
          const headingText = getTextFromHeading(child);
          // I don't know why but sveltekit thinks '"' chracter is not encoded
          // Falsely report no element with matching id exists. encodeURIComponent does not work.
          // Thus just remove those kinds of characters.
          // There will be no empty id because of heading prefix.
          const headingId = removeXSSCharacters(
            `${getHeadingPrefix(headings.length + 1)}${headingText}`.replaceAll(' ', '-')
          );
          if (child.properties) {
            child.properties.id = headingId;
          } else {
            child.properties = {};
            child.properties.id = headingId;
          }
          headings.push({depth: headingDepth, id: headingId, text: headingText});
        }
      }
    });
  }

  const html = compiler.stringify(root);
  return {html: String(html), tocData: includeToc ? headings : []};
};
