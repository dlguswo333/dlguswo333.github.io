import crawlPosts from '$lib/crawlPosts';
import type {PostMetadata, TOCItem} from '$lib/types';

export const load = async () => {
  // Since posts are crawled in time order,
  // I don't need to sort here again.
  const posts = await crawlPosts();
  const tags: {[tag: string]: PostMetadata[]} = {};
  posts.forEach(post => {
    if (!post.tags || !post.tags.length) {
      return;
    }
    post.tags.forEach(tag => {
      if (tags[tag]) {
        tags[tag].push(post);
      } else {
        tags[tag] = [post];
      }
    });
  });
  const sortedTags = Object.keys(tags).sort();

  const tocData: TOCItem[] = sortedTags.map(category => ({
    id: category,
    text: category,
    depth: 1,
  }));

  return {
    tags: sortedTags.map(tag => ({tag, posts: tags[tag]})),
    tocData,
  };
};
