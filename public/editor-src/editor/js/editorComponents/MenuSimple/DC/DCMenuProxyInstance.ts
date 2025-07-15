import { getMenuSimpleDynamicContent } from "visual/utils/api";
import { BatchFetcher } from "../../EditorComponent/DynamicContent/BatchFetcher";
import { DCApiProxy } from "../../EditorComponent/DynamicContent/DCApiProxy";

export const DCMenuProxyInstance = new DCApiProxy({
  fetcher: new BatchFetcher(getMenuSimpleDynamicContent())
});
