import fs from 'node:fs/promises';
import {fileExists} from '$lib/server';
import * as z from 'zod';

/**
 * This class wraps file-related logics with a json format cache file.\
 * If the objective file is newer than the cache,
 * it will execute the getter and renew the cache.\
 * Otherwise, it will return the cached value without executing the getter.
 * - Call `initCache` before using the cache.
 * - Call `get` and the method will fetch from cache, update in-memory cache if needed.
 * - Call `rewriteCache` before the exit.
 */
class FileBasedCache<Value> {
  private cacheFilePath: string;
  private cache: Record<string, {data: Value; crawledTimestamp: number;}>;
  private shouldRewriteCache: boolean;
  private cacheType: z.ZodType<typeof this.cache> | undefined;

  constructor (cacheFilePath: string, valueType?: z.ZodType<Value>) {
    this.cacheFilePath = cacheFilePath;
    this.cache = {};
    this.shouldRewriteCache = false;
    if (valueType) {
      this.cacheType = z.record(z.string(), z.object({data: valueType, crawledTimestamp: z.number()}));
    }
  }

  public async initCache () {
    if (!await fileExists(this.cacheFilePath)) {
      return;
    }
    const cacheFileContent = await fs.readFile(this.cacheFilePath, {encoding: 'utf-8'});
    if (this.cacheType !== undefined) {
      const parseResult = this.cacheType.parse(JSON.parse(cacheFileContent));
      this.cache = parseResult;
    } else {
      const parseResult = JSON.parse(cacheFileContent) as typeof this.cache;
      this.cache = parseResult;
    }
  }

  public async get (filePath: string, getter: (filePath: string) => Promise<Value>): Promise<Value> {
    const fileStat = await fs.stat(filePath);
    if (this.cache[filePath]?.crawledTimestamp >= fileStat.mtimeMs) {
      const {data: value} = this.cache[filePath];
      return value;
    }
    const value = await getter(filePath);
    this.cache[filePath] = {data: value, crawledTimestamp: fileStat.mtimeMs};
    this.shouldRewriteCache = true;
    return value;
  }

  public async rewriteCache () {
    if (!this.shouldRewriteCache) {
      return;
    }
    this.shouldRewriteCache = false;
    if (this.cacheType !== undefined) {
      this.cacheType.parse(this.cache);
    }
    await fs.writeFile(this.cacheFilePath, JSON.stringify(this.cache));
  }
}

export default FileBasedCache;
