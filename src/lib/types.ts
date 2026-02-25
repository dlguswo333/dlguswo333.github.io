import * as z from 'zod';

export const frontmatterType = z.object({
  title: z.string(),
  toc: z.boolean().nullable(),
  editedDate: z.string().nullable(),
  category: z.string().nullable(),
  tags: z.string().array(),
});

export type Frontmatter = {
  title: string;
  toc: boolean | null;
  editedDate: string | null;
  category: string | null;
  tags: string[];
};

export const postMetadataType = z.object({
  ...frontmatterType.shape,
  summary: z.string().nullable(),
  lang: z.string(),
  date: z.string(),
  id: z.string(),
});

export type PostMetadata = Frontmatter & {
  summary: string | null;
  lang: string;
  date: string;
  id: string;
};

export type TOCItem = {
  text: string;
  depth: number;
  id: string;
};

export type ColorTheme = 'light' | 'dark';

export type HeadingHighlight = {
  top: number;
  bottom: number;
};
