import { Obj, Str } from "@brizy/readers";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { mPipe } from "visual/utils/fp";
import { CustomIconOptions } from "visual/utils/icons/types";
import { getPlaceholders } from "../placeholders";

export const makeCustomIconUrl = (options: CustomIconOptions): string => {
  const { pattern } = options;
  const url = pattern.replace(/[{}\s]/g, "");

  const placeholders = getPlaceholders(pattern);

  return placeholders.reduce((acc, placeholder) => {
    const key = placeholder.replace(/[[\]]/g, "");
    const getKeyValue = mPipe(Obj.readKey(key), Str.read);
    const value = getKeyValue(options);

    return value ? acc.replace(placeholder, value) : acc;
  }, url);
};

export const getCustomIconUrl = (
  config: ConfigCommon,
  iconName: string,
  fileName?: string,
  isPreview?: boolean
): string => {
  const { iconUrl, iconPattern, compileIconUrl } = config.api?.customIcon ?? {};

  if (!iconPattern || !iconUrl) {
    return "";
  }

  let baseUrl = iconUrl;

  if (isPreview && compileIconUrl) {
    baseUrl = compileIconUrl;
  }

  const options = {
    baseUrl,
    pattern: iconPattern.original,
    uid: iconName,
    fileName
  };

  return makeCustomIconUrl(options);
};
