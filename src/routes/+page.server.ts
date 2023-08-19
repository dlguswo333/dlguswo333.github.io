import crawlPosts from '$lib/crawlPosts';
import {getCurrentPaginationIndex} from '$lib/server';

const paginationSize = 10;

export const load = async ({url}) => {
  const posts = await crawlPosts();
  const curIndex = getCurrentPaginationIndex(url);
  const start = (curIndex - 1) * paginationSize;
  const end = curIndex * paginationSize;
  const paginatedPosts = posts.slice(start, end);
  return {
    posts: paginatedPosts,
    curIndex: curIndex,
    maxIndex: Math.ceil(posts.length / paginationSize),
  };
};
