import {error} from '@sveltejs/kit';
import {readdir} from 'fs/promises';
import {imageSizeFromFile} from 'image-size/fromFile';
import {rootPath} from 'get-root-path';
import {join as joinPath} from 'path';
import fs from 'node:fs/promises';
import FileBasedCache from './FileBasedCache';
import z from 'zod';

const imageSizeCacheFilePath = './.images.json';

export const fileExists = async (filePath: string) => {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
};

export const getCurrentPaginationIndex = (url: URL) => {
  const {pathname} = url;
  if (pathname === '/') {
    return 1;
  }
  const result = /$\/posts\/(\d+)/.exec(pathname);
  if (!result) {
    error(404);
  }
  const paginationNumber = Number([...result][1]);
  if (Number.isNaN(paginationNumber) ||
    !Number.isInteger(paginationNumber) ||
    paginationNumber <= 0
  ) {
    error(404);
  }
  return paginationNumber;
};

export const getImageSize = async (imgPath: string): Promise<{width: number; height: number}> => {
  const {width, height} = await imageSizeFromFile(imgPath);
  return {
    width, height,
  };
};

/**
 * Get all image sizes inside the image folder.
 * Returns an object with the keys of `img.src` (e.g. `'/img/a/b.jpg': {width: 1, height: 1}`).\
 * [NOTE] This function relies on specific setups, such as image folder path.
 * Related logics may malfunction if such setups change.
 */
export const getImageSizes = async () => {
  const imageSizeCache = new FileBasedCache(
    imageSizeCacheFilePath,
    z.object({width: z.int().positive(), height: z.int().positive()})
  );
  await imageSizeCache.initCache();
  const supportedFormats = ['webp', 'png', 'jpeg', 'jpg', 'svg'];
  const staticFolderPath = joinPath(rootPath, 'static');
  const imageFolderPath = joinPath(staticFolderPath, 'img');
  const files = await readdir(imageFolderPath, {recursive: true, withFileTypes: true});
  const imageFiles = files
    .filter((file) => file.isFile())
    .filter((file) => supportedFormats.includes(file.name.toLowerCase().split('.')[1]));
  const result: Record<string, Awaited<ReturnType<typeof getImageSize>>> = {};
  for (const imageFile of imageFiles) {
    const imagePath = joinPath(imageFile.parentPath, imageFile.name);
    const imageSize = await imageSizeCache.get(imagePath, async () => await getImageSize(imagePath));
    const imageSrc = imagePath.replace(staticFolderPath, '');
    if (!imageSrc) {
      throw new Error('Could not get image src');
    }
    result[imageSrc] = imageSize;
  }
  await imageSizeCache.rewriteCache();
  return result;
};
