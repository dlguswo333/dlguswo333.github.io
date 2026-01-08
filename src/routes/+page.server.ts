import {paginationSize} from '$lib';
import crawlPosts, {groupPostsByTopic} from '$lib/crawlPosts';

export const load = async () => {
  const groupedPosts = groupPostsByTopic(await crawlPosts());
  const curIndex = 1;
  const start = (curIndex - 1) * paginationSize;
  const end = curIndex * paginationSize;
  const paginatedPosts = groupedPosts.slice(start, end);
  return {
    groupedPosts: paginatedPosts,
    curIndex: curIndex,
    maxIndex: Math.ceil(groupedPosts.length / paginationSize),
  };
};
