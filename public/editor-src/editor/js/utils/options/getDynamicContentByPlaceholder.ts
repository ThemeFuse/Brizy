import { Config as TConfig, ConfigDCItem, DCTypes } from "visual/types";
import { findDeep } from "../object";

type Options = TConfig["dynamicContent"];

export const getDynamicContentByPlaceholder = (
  options: Options,
  type: DCTypes,
  placeholder: string
): ConfigDCItem | undefined => {
  const option = findDeep(options, (option: ConfigDCItem) => {
    return option.placeholder === placeholder || option.alias === placeholder;
  });

  if (option?.obj) {
    return option.obj;
  }
};
