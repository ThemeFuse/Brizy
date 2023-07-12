import { Layout } from "visual/component/Prompts/common/PromptPage/types";
import { Shopify } from "visual/global/Config/types/configs/Cloud";
import { capitalize } from "visual/utils/string";

export const getChoices = (config: Shopify): Layout[] => {
  return config.templates.map(({ id }) => ({
    title: capitalize(id),
    id: id
  }));
};
