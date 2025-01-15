import QuickLRU from "quick-lru";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Dictionary } from "visual/types/utils";
import { getDynamicContent as apiGetDynamicContent } from "visual/utils/api";
import { GetDynamicContent } from "visual/utils/api/types";
import { MValue } from "visual/utils/value";

export interface DCApiProxyConfig {
  postId: string;
  cache?: boolean;
  globalConfig: ConfigCommon;
}

interface DCApiProxyFetcher {
  getDC(placeholders: string[], config: DCApiProxyConfig): Promise<string[]>;
}

interface Options {
  waitTime?: number;
}

export class BatchFetcher implements DCApiProxyFetcher {
  private readonly fetcher: GetDynamicContent;

  private readonly waitTime: number;

  private promise: Promise<Dictionary<string[]>> | undefined;
  private promiseResolve: ((value: unknown) => void) | undefined;

  private timeoutId = 0;

  private count = 0;
  private requestMapper = new Map<number, number[]>();
  private buffer = new Map<string, Map<string, number>>();

  constructor(fetcher: GetDynamicContent, options?: Options) {
    const { waitTime = 2000 } = options ?? {};
    this.fetcher = fetcher;
    this.waitTime = waitTime;
  }

  getDC(placeholders: string[], config: DCApiProxyConfig): Promise<string[]> {
    if (!this.promise) {
      this.promise = new Promise((res) => {
        this.promiseResolve = res;
      }).then(() => {
        const placeholders: Dictionary<string[]> = {};

        for (const [postId, placeholdersMap] of this.buffer.entries()) {
          placeholders[postId] = Array.from(placeholdersMap.keys());
        }

        this.buffer.clear();
        this.promise = undefined;

        return this.fetcher({ placeholders, config: config.globalConfig });
      });
    }

    const postId = config.postId;
    const requestId = this.count;
    const buffer = this.buffer.get(postId) ?? new Map<string, number>();
    const requestMapper = this.requestMapper.get(requestId) ?? [];

    placeholders.forEach((p) => {
      const index = buffer.get(p);

      if (index === undefined) {
        const index = buffer.size;
        buffer.set(p, index);
        requestMapper.push(index);
      } else {
        requestMapper.push(index);
      }
    });

    this.buffer.set(postId, buffer);
    this.requestMapper.set(requestId, requestMapper);
    this.count++;

    clearTimeout(this.timeoutId);
    if (this.promiseResolve) {
      this.timeoutId = window.setTimeout(this.promiseResolve, this.waitTime);
    } else {
      throw new Error("should not get here");
    }

    return this.promise.then((dc) => {
      const dc_ = dc[postId];
      const requestMapper = this.requestMapper.get(requestId);

      this.requestMapper.delete(requestId);

      if (dc_ === undefined || requestMapper === undefined) {
        return new Array(100).fill("");
      }

      return requestMapper.map((index) => dc_[index] ?? "");
    });
  }
}

export class DCApiProxy {
  private fetcher: DCApiProxyFetcher;

  private cache: QuickLRU<string, string>;

  private readonly useCache: boolean;

  private readonly cacheMaxSize: number;

  constructor({
    fetcher,
    useCache = true,
    cacheLvl1MaxSize = 500
  }: {
    fetcher: DCApiProxyFetcher;
    useCache?: boolean;
    cacheLvl1MaxSize?: number;
    cacheLvl2MaxSize?: number;
  }) {
    this.fetcher = fetcher;
    this.useCache = useCache;
    this.cacheMaxSize = cacheLvl1MaxSize;

    // if the this.cache could be undefined, then
    // the callers would be forced to use optional chaining
    // when wanting do something with it (ApiProxy.cache?.{method})
    this.cache = new QuickLRU({
      maxSize: this.useCache ? this.cacheMaxSize : 1
    });
  }

  private static makeCacheKey(
    placeholder: string,
    config: DCApiProxyConfig
  ): string {
    return `${config.postId}-${placeholder}`;
  }

  public getFromCache(
    placeholder: string,
    config: DCApiProxyConfig
  ): MValue<string> {
    return this.cache.get(DCApiProxy.makeCacheKey(placeholder, config));
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public setInCache(
    placeholder: string,
    value: string,
    config: DCApiProxyConfig
  ): void {
    this.cache.set(DCApiProxy.makeCacheKey(placeholder, config), value);
  }

  // public cache

  public getDC(
    placeholders: string[],
    config: DCApiProxyConfig
  ): Promise<string[]> {
    if (placeholders.length === 0) {
      return Promise.resolve([]);
    }

    const allCached =
      this.useCache &&
      placeholders.every((p) => this.getFromCache(p, config) !== undefined);

    if (allCached) {
      return Promise.resolve(
        // it was verified above that the cache has everything needed
        placeholders.map((p) => this.getFromCache(p, config) as string)
      );
    } else {
      return this.fetcher.getDC(placeholders, config).then((r) => {
        if (
          this.useCache &&
          (config.cache ?? true) &&
          placeholders.length === r.length
        ) {
          for (let i = 0; i < placeholders.length; i++) {
            this.setInCache(placeholders[i], r[i], config);
          }
        }

        return r;
      });
    }
  }
}

export const DCApiProxyInstance = new DCApiProxy({
  fetcher: new BatchFetcher(apiGetDynamicContent())
});
