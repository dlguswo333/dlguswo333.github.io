import crawlPosts from '$lib/crawlPosts';
import {error} from '@sveltejs/kit';

const paginationSize = 10;

const getCurrentPaginationIndex = (url: URL) => {
  const {pathname} = url;
  if (pathname === '/') {
    return 1;
  }
  const result = /$\/posts\/(\d+)/.exec(pathname);
  if (!result) {
    throw error(404);
  }
  const paginationNumber = Number([...result][1]);
  if (Number.isNaN(paginationNumber) ||
    Number.isInteger(paginationNumber)
  ) {
    throw error(404);
  }
  return paginationNumber;
};

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
