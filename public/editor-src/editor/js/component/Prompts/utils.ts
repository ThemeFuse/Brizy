import { Shopify } from "visual/global/Config/types/configs/Cloud";
import { Layout } from "visual/component/Prompts/common/PromptPage/types";

export const getChoices = (config: Shopify): Layout[] => {
  return config.templates.map(({ id }) => ({
    title: id,
    id: id
  }));
};
