import { getDynamicContent as apiGetDynamicContent } from "visual/utils/api";
import { BatchFetcher } from "./BatchFetcher";
import { DCApiProxy } from "./DCApiProxy";

export const DCApiProxyInstance = new DCApiProxy({
  fetcher: new BatchFetcher(apiGetDynamicContent())
});
