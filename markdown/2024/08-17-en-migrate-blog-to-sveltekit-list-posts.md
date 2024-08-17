---
layout: post
toc: true
title: "Let's Migrate Github Blog to Sveltekit: List Posts"
category: ["Programming"]
tags: [migrate-blog-to-sveltekit, web, svelte, sveltekit, javascript]
author:
  - 이현재
---

![postcards](/img/08-17-en-migrate-blog-to-sveltekit-list-posts/postcards.png)

There will be more than one or two posts in my blog.
That means I should list the posts to users to encourage them to read what I've written.
Listing posts is an important feature in blog services. If they don't feel good
or not function well, people would not spend time reading on my blog.

# Post Card Layout
Each post card should notify readers with meangingful information,
such as title, category, summary and extra.
The current card layout is like this:
```text
┌──────────────────────────┐
│title            date lang│
│category tag              │
│summary                   │
└──────────────────────────┘
```

Don't forget there is also invisible information we need: the URL, in other words: `id`.

To generate the card means to crawl the markdown file and extract the information.
- id
- title
- date
- lang
- category
- tag
- summary

Let's see how we can ***crawl*** markdown files and get the information we need.

# Crawl Algorithms
## Post Folder Structure
First, let's look at the folder structure where the post files are located.

```text
lib/post ─┬─ yyyy ─┬─ mm-dd-lang1-post-name1.md
          │        └─ mm-dd-lang2-post-name1.md
          └─ yyyy ─── mm-dd-lang1-post-name2.md
```

Notice that post files are grouped by their creation year.
There is no objective reason for doing so, it's just my personal preference
to sort things by their year.
If there is not a single depth it will be a mess with too many files in a single directory.
On the other hand being too fine-grained also ruins the point of grouping.
So I needed an adequate criteria and I chose the creation year,
one of the most discrete and evident criteria.

And there can be posts which are written in different languages.
I wanted them to have similar file names but they cannot be exactly the same.
So I ended up including language code in post file names.
I tell you that this is my preference and everyone's preference may vary.
You can choose your own rule as long as it pleases you.

Let's go back to the crawling.
We can extract three pieces from the file structure.
- id
- date
- lang

`id`, URL must be unique across all the post files,
and we can make use of paths to get the unique ids.
Each blog post on my blog has the following unique id structure.
```js
{year}/{lang}/{post-name}
```

## Parse Markdown
We need the remaining pieces of information and they can be obtained by parsing markdown files.
I wrote yaml codes at the start of markdown files and included properties of the posts,
title, category, and tag.
This kind of yaml syntaxes in front of markdown files are called `frontmatters`.

```yaml
title: "Let's Migrate Github Blog to Sveltekit: List Posts"
category: ["Programming"]
tags: [migrate-blog-to-sveltekit, web, svelte, sveltekit, javascript]
```
<br>

Parsing markdown files can be achieved with `unified`, one of the most biggest
ecosystem of parsing and transpiling markdown in Javascript.
It has a number of plugins which help parse markdown files.
For instance we can get the frontmatters with the following code.
Notice the inlined plugin to parse and extract the frontmatters from AST.
```ts
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
```
<br>

Summary can be obtained in a similar way by adding a plugin where you extract text nodes only.

After parsing markdown files, we obtained the remaining information
and are ready to get the post list.

- title
- category
- tag
- summary

## Crawling Steps
Now we have all the information we need. Let's see how to concatenate those
to generate the list of post cards.

Of course, the posts should be sorted in time descending order:
newer posts first, older posts last.

1. First, sort year folders in alphabetical descending order.
2. For each year folder, again, sort files based on their names in alphabetical descending order.
3. Read contents of each post and parse to get the information.
4. Save the results into an array.
5. Use the information to render the list of posts.

# Cache Crawl Results
Reading files is a famous bottleneck in computer system. Reading post files is no exception.
s I will build into static pages (using `prerender` option of Sveltekit)
it will not be that critical, but it might be going to affect my workflows.

Thus, I thought caching crawl results into a single JSON format file.
However, caching something means finding out obsolete data and refreshing;
guranteeing the **up-to-date** data is crucial in cache system.

1. Get all the post files in the post path.
2. For each post file:
  - Find cached data for the file.
  - If the data exists and is up to date, recycle the cache.
  - Otherwise, crawl the post file and cache it.

Last modified timestamp of files can be used for this purpose.
When I was caching a post file, I recorded the last modified of the post file.
And when I was going to decide whether I can reuse the cache,
I compared the last modified date of the file with the cached date.


```json
{
  "2023/01-02-....md": {
    "...": "...",
    "crawledTimestamp": 1692285497596
  },
  "2024/05-23-....md": {
    "...": "...",
    "crawledTimestamp": 1695985897596
  }
}
```

In Node.JS, you can run `fs.stat` and get `stats.mtimeMs` to get the last modified timestamp.
<https://nodejs.org/docs/latest-v18.x/api/fs.html#statsmtimems>

I compared performance with and without the cache systems in development (`vite dev`),
and surprisingly, with just 13 post files, the difference was huge.
I called `curl` on the list of posts url 5 times in a row and measured `time_total` to get index.html.

|         Attempt          | Millisecond |
| :----------------------  | ----------: |
|       w/o cache #1       | `1982`      |
|       w/o cache #2       | `183`       |
|       w/o cache #3       | `163`       |
|       w/o cache #4       | `163`       |
|       w/o cache #5       | `148`       |
| w/ cache #1 (Cold start) | `2121`      |
|       w/ cache #2        | `20`        |
|       w/ cache #3        | `18`        |
|       w/ cache #4        | `17`        |
|       w/ cache #5        | `16`        |


# Pagination
![post-pagination](/img/08-17-en-migrate-blog-to-sveltekit-list-posts/post-pagination.png)

Pagination is an important feature of listing items.
It prevents pages from having too long height and helps users see less to focus.<br>
First, I decided pagninated post list url to be `posts/{1,2,...}`,
To render each page, I created a `+page.server.ts` file at `src/routes/posts/[slug]`.
That way I can get the pagination index number from the url with `Number(params.slug)`.

Then I prepare the whole list of posts, and sliced them into length of 10,
and returned the paginated posts, current index, and the max index.
```ts
const start = (curIndex - 1) * paginationSize;
const end = curIndex * paginationSize;
const paginatedPosts = posts.slice(start, end);
return {
  posts: paginatedPosts,
  curIndex: curIndex,
  maxIndex: Math.ceil(posts.length / paginationSize),
};
```
<br>

![post-pagination-blueprint-1](/img/08-17-en-migrate-blog-to-sveltekit-list-posts/post-pagination-blueprint-1.png)

By the way, you must have seen this pagination from numerous services.
It shows the current page with highlight,
and several pages before the current and also pages after the current.
But I wanted to show the first and the last page always and I did it.

![post-pagination-blueprint-2](/img/08-17-en-migrate-blog-to-sveltekit-list-posts/post-pagination-blueprint-2.png)

I defined a variable of an array which stores page numbers and
contains `1` (the first index) at the beginning.
And at the end of the logic I add the last page index if it has not already been added.
```ts
const maxDisplaySize = 5;
const displayIndices: number[] = [1];
//
// At this line I need to add page numbers
// between the first and the last one
//
if (displayIndices[displayIndices.length - 1] !== maxIndex) {
  displayIndices.push(maxIndex);
}
```
<br>

At the comments in the middle of the codes, I should add page indices around the current page number,
as long as the array `displayIndices` length does not exceed `maxDisplaySize`.
Notice that this range should should be centered around the current index.
Then we should assign half the remaining length to the former and the other to the latter.
The code is not perfect, but it gets the job done.
```ts
const displayIndices: number[] = [1];
const start = Math.max(2, curIndex - Math.floor(maxDisplaySize / 2));
for (let i = start;i <= Math.min(maxIndex, start + maxDisplaySize - 3);++i) {
  displayIndices.push(i);
}
if (displayIndices[displayIndices.length - 1] !== maxIndex) {
```
