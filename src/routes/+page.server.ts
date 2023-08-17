import crawlPosts from '$lib/crawlPosts';

export const load = async () => {
  return {posts: await crawlPosts()};
};
