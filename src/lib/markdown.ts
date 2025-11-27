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
import rehypeRaw from 'rehype-raw';
import rehypeMathjax from 'rehype-mathjax';
import rehypeStringify from 'rehype-stringify';
import rehypePrism from 'rehype-prism-plus';
import rehypeGithubAlert from 'rehype-github-alert';
import yaml from 'yaml';
import type {Root as MdastRoot, RootContent as MdastRootContent} from 'mdast';
import type {Element, Parent, Root as HastRoot, RootContent as HastRootContent, Properties} from 'hast';
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
  const visit = (node: MdastRootContent | MdastRoot) => {
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
  const compiler = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (root: MdastRoot) => {
      visit(root);
    });
  const root = compiler.parse(markdown);
  compiler.run(root);

  return summary as string | null;
};

/**
 * Extract frontmatter from markdown.
 */
export const getFrontmatterFromMarkdown = async <T>(markdown: string) => {
  let frontmatter = null;
  await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (root: MdastRoot) => {
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
    .use(rehypeGithubAlert)
    .use(rehypeRaw) // rehype-raw better come as the last.
    .use(() => (root: HastRoot) => {
      visitConvertHastNodePropertiesIntoHtml(root);
    })
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
          // unifiedjs converts double quotes into &#x22; (XML character entity)
          // while Sveltekit converts into &quot; (HTML entity)
          // On actual browsers they work fine,
          // but SvelteKit does not detect and discern one from the other;
          // thus it emits errors that elements with same ids cannot be found while building.
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

  return {tocData: includeToc ? headings : [], root};
};

const visitConvertHastNodePropertiesIntoHtml = (node: Parent | HastRootContent) => {
  if ('tagName' in node) {
    node.properties = convertHastNodePropertiesIntoHtml(node.properties);
  }
  if ('children' in node) {
    for (const child of node.children) {
      visitConvertHastNodePropertiesIntoHtml(child);
    }
  }
};

/** Convert hast node properties into html compatible. */
const convertHastNodePropertiesIntoHtml = (properties: Properties) => {
  const converted: Properties = {};
  for (const [key, val] of Object.entries(properties)) {
    if (key === 'className') {
      converted['class'] = (val as string[]).join(' ');
    } else {
      /** [NOTE] Some keys need to be transformed carefully. */
      const map: Record<string, string> = {
        'xLinkHref': 'href',
        'xmlnsXLink': 'xmlns',
        'viewBox': 'viewBox',
      } as const;
      converted[map[key] ?? key.replace(/([A-Z])/g, '-$1').toLowerCase()] = val;
    }
  }
  return converted;
};
