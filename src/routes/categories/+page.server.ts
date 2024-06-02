import crawlPosts from '$lib/crawlPosts';
import type {PostMetadata, TOCItem} from '$lib/types';

export const load = async () => {
  // Since posts are crawled in time order,
  // I don't need to sort here again.
  const posts = await crawlPosts();
  const categories: {[category: string]: PostMetadata[]} = {};
  posts.forEach(post => {
    if (!post.category) {
      return;
    }
    if (categories[post.category]) {
      categories[post.category].push(post);
    } else {
      categories[post.category] = [post];
    }
  });
  const sortedCategories = Object.keys(categories).sort();

  const tocData: TOCItem[] = sortedCategories.map(category => ({
    id: category,
    text: category,
    depth: 1,
  }));

  return {
    categories: sortedCategories.map(category => ({category, posts: categories[category]})),
    tocData,
  };
};
