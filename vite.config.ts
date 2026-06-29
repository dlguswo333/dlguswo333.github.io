import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig, type PluginOption, type WebSocketServer} from 'vite';
import {customEvent} from './src/lib';
import type {ReloadPayloadData} from '$lib/types';

const MARKDOWN_FILE_PATH_REGEX = /(\d+\/\d+-\d+-[a-z]{2}-[^.]+)\.md$/;
const ABOUT_MARKDOWN_FILE_PATH_REGEX = /about\.md$/;

/** Handle /posts/[year]/[slug] on markdown file change. */
const handlePostPage = (filePath: string, {ws}: {ws: WebSocketServer}) => {
  const matchResult = filePath.match(MARKDOWN_FILE_PATH_REGEX);
  if (matchResult === null) {
    return;
  }
  const matchingUrlPath = matchResult[1];
  ws.send({
    type: 'custom',
    event: customEvent.reload,
    data: {paths: [{path: `/post/${matchingUrlPath}`, exact: false}]} satisfies ReloadPayloadData,
  });
};

/** Handle /posts/[number] on markdown file change. Reload all since it may affect the entire list.  */
const handlePostsPage = (filePath: string, {ws}: {ws: WebSocketServer}) => {
  const matchResult = filePath.match(MARKDOWN_FILE_PATH_REGEX);
  if (matchResult === null) {
    return;
  }
  ws.send({
    type: 'custom',
    event: customEvent.reload,
    data: {paths: [{path: '/posts', exact: false}, {path: '/', exact: true}]} satisfies ReloadPayloadData,
  });
};

/** Handle /about on markdown file change. */
const handleAboutPage = (filePath: string, {ws}: {ws: WebSocketServer}) => {
  const matchResult = filePath.match(ABOUT_MARKDOWN_FILE_PATH_REGEX);
  if (matchResult === null) {
    return;
  }
  ws.send({
    type: 'custom',
    event: customEvent.reload,
    data: {paths: [{path: '/about', exact: false}]} satisfies ReloadPayloadData,
  });
};

const handleMarkdownFileChange = (filePath: string, {ws}: {ws: WebSocketServer}) => {
  handlePostPage(filePath, {ws});
  handlePostsPage(filePath, {ws});
  handleAboutPage(filePath, {ws});
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
  build: {
    target: 'es2018',
  },
});
