import { Dictionary } from "visual/types/utils";
import { BatchFetcher } from "./BatchFetcher";
import { DCApiProxy } from "./DCApiProxy";

const mockFn = (): Promise<Dictionary<string[]>> => {
  const mock: Array<string> = [];
  return Promise.resolve({ mock });
};

export const DCApiProxyInstance = new DCApiProxy({
  fetcher: new BatchFetcher(mockFn)
});
