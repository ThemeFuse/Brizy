import QuickLRU from "quick-lru";
import { MValue } from "visual/utils/value";
import { DCApiProxyConfig, DCApiProxyFetcher } from "./types";

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
