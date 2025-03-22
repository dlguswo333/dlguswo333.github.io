import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig, type PluginOption, type WebSocketServer} from 'vite';
import {customEvent} from './src/lib';

/** Handle /posts/[year]/[slug] on markdown file change. */
const handlePostPage = (filePath: string, {ws}: {ws: WebSocketServer}) => {
  const markdownFilePathRegex = /(\d+\/\d+-\d+-[a-z]{2}-[^.]+)\.md$/;
  const matchResult = filePath.match(markdownFilePathRegex);
  if (matchResult === null) {
    return;
  }
  const matchingUrlPath = matchResult[1];
  ws.send({
    type: 'custom',
    event: customEvent.reload,
    data: {path: `/post/${matchingUrlPath}`},
  });
};

// [TODO] Handle /posts.
// [TODO] Handle /about.
const handleMarkdownFileChange = (filePath: string, {ws}: {ws: WebSocketServer}) => {
  handlePostPage(filePath, {ws});
};

const reloadPlugin = (): PluginOption => ({
  name: 'reload',
  configureServer (server) {
    const {ws, watcher} = server;
    watcher.on('change', filePath => {
      if (filePath.endsWith('.md')) {
        handleMarkdownFileChange(filePath, {ws});
      }
    });
  },
});

export default defineConfig({
  plugins: [
    sveltekit(),
    reloadPlugin()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // This specification not needed after migrating to Vite 6.
        // https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
        // https://v5.vite.dev/config/shared-options.html#css-preprocessoroptions
        api: 'modern-compiler',
      },
    },
  },
});
