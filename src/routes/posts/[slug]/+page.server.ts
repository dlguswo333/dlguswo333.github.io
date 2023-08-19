import {paginationSize} from '$lib';
import crawlPosts from '$lib/crawlPosts';
import {error} from '@sveltejs/kit';

export const load = async ({params}) => {
  const posts = await crawlPosts();
  const curIndex = Number(params.slug);
  if (Number.isNaN(curIndex) || !Number.isInteger(curIndex) || curIndex <= 0) {
    throw error(404);
  }
  const start = (curIndex - 1) * paginationSize;
  const end = curIndex * paginationSize;
  const paginatedPosts = posts.slice(start, end);
  return {
    posts: paginatedPosts,
    curIndex: curIndex,
    maxIndex: Math.ceil(posts.length / paginationSize),
  };
};
