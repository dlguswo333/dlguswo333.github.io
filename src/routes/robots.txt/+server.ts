import {blogFullUrl} from '$lib';

export const prerender = true;

const responseBody = `
User-agent: *
Allow: /
Sitemap: ${blogFullUrl}/sitemap.txt
`.trim();
const responseInit = {
  headers: {
    'Content-Type': 'text/plain',
  },
};

export async function GET () {
  return new Response(
    responseBody,
    responseInit
  );
}
