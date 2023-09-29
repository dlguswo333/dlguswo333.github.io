export type Frontmatter = {
  title: string;
  toc: boolean | null;
  editedDate: string | null;
  category: string | null;
  tags: string[];
}

export type PostMetadata = Frontmatter & {
  summary: string | null;
  lang: string;
  date: string;
  id: string;
}

export type CachedPostMetadata = PostMetadata & {
  crawledTimestamp: number;
}

export type TOCItem = {
  text: string;
  depth: number;
  id: string;
};

export type ColorTheme = 'light' | 'dark';
