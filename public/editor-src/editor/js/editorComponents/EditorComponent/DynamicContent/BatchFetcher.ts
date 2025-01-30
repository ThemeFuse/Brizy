import { Dictionary } from "visual/types/utils";
import { GetDynamicContent } from "visual/utils/api/types";
import { DCApiProxyConfig, DCApiProxyFetcher, Options } from "./types";

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
