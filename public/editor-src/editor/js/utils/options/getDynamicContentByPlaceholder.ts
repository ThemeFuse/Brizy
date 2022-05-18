import {
  DynamicContent,
  ConfigDCItem
} from "visual/global/Config/types/DynamicContent";
import { findDeep } from "../object";

export const getDynamicContentByPlaceholder = (
  options: DynamicContent<"wp"> | DynamicContent<"cloud">,
  placeholder: string
): ConfigDCItem | undefined => {
  const option = findDeep(options, (option: ConfigDCItem) => {
    return option.placeholder === placeholder || option.alias === placeholder;
  });

  if (option?.obj) {
    return option.obj;
  }

  return undefined;
};
