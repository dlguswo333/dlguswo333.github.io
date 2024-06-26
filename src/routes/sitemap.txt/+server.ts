import {blogFullUrl} from '$lib';
import crawlPosts from '$lib/crawlPosts';

export const prerender = true;

export async function GET () {
  const postList = await crawlPosts();
  // Refer to src/routes/categories/+page.svelte, 2e139c97
  const getPostFullUrl = ({date, id}: (typeof postList)[number]) =>
    `${blogFullUrl}/post/${date.split('-')[0]}/${id}/`;
  /**
   * Sitemap only provides links to posts.
   * This is because links to the others pages in sitemap did not seem important.
   * This decision can be changed afterward.
   */
  const responseBody = `
    ${postList.map(getPostFullUrl).join('\n')}
  `.trim();
  const responseInit = {
    headers: {
      'Content-Type': 'text/plain',
    },
  };
  return new Response(
    responseBody,
    responseInit
  );
}
