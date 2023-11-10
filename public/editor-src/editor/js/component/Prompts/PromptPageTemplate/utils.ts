import { Layout } from "visual/component/Prompts/common/PromptPage/types";
import { MValue } from "visual/utils/value";

export const getShopifyLayout = (layouts: Layout[]): MValue<Layout> =>
  layouts.find((layout) => layout.id === "shopify");
