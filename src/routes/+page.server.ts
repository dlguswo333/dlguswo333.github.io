import {paginationSize} from '$lib';
import crawlPosts from '$lib/crawlPosts';

export const load = async () => {
  const posts = await crawlPosts();
  const curIndex = 1;
  const start = (curIndex - 1) * paginationSize;
  const end = curIndex * paginationSize;
  const paginatedPosts = posts.slice(start, end);
  return {
    posts: paginatedPosts,
    curIndex: curIndex,
    maxIndex: Math.ceil(posts.length / paginationSize),
  };
};
