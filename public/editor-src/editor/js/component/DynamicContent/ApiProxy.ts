import { getDynamicContent as apiGetDynamicContent } from "visual/utils/api/editor/index-new";
import Config from "visual/global/Config";

type Config = {
  postId: string;
};

export class ApiProxy {
  public static cache = new Map<string, string>();

  public static fetcher = apiGetDynamicContent;

  private static readonly NOT_CACHED = Symbol();

  public static readonly pendingFetches = new Map(); // made public for testing

  public static clearPendingFetchesWhenDone = true; // made for testing

  public static getDynamicContent(
    placeholders: string[],
    config?: Config
  ): Promise<string[]> {
    const r: (string | typeof ApiProxy.NOT_CACHED)[] = new Array(
      placeholders.length
    );
    const toFetch: string[] = [];

    for (let i = 0; i < placeholders.length; i++) {
      const p = placeholders[i];
      const cached = this.cache.get(p);

      if (cached !== undefined) {
        r[i] = cached;
      } else {
        r[i] = this.NOT_CACHED;
        toFetch.push(p);
      }
    }

    if (toFetch.length === 0) {
      return Promise.resolve(r as string[]);
    } else {
      return this.crazyPromiseStuff(toFetch, config).then(r2 => {
        let notCachedIndex = -1;

        for (let i = 0; i < r.length; i++) {
          if (r[i] === this.NOT_CACHED) {
            notCachedIndex++;

            r[i] = r2[notCachedIndex];
            this.cache.set(toFetch[notCachedIndex], r2[notCachedIndex]);
          }
        }

        return r as string[];
      });
    }
  }

  private static crazyPromiseStuff(
    placeholders: string[],
    config?: Config
  ): Promise<string[]> {
    const notInPending = placeholders.filter(p => !this.pendingFetches.has(p));

    if (notInPending.length > 0) {
      const fetch = this.fetcher({
        ...config,
        placeholders: notInPending
      });

      for (let i = 0; i < notInPending.length; i++) {
        const p = notInPending[i];

        this.pendingFetches.set(
          p,
          fetch.then(r => r[i])
        );
      }
    }

    return Promise.all(placeholders.map(p => this.pendingFetches.get(p))).then(
      r => {
        if (this.clearPendingFetchesWhenDone) {
          for (const p of placeholders) {
            this.pendingFetches.delete(p);
          }
        }

        return r;
      }
    );
  }
}
