import { Obj, Str } from "@brizy/readers";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { mPipe } from "visual/utils/fp";
import { CustomIconOptions } from "visual/utils/icons/types";
import { getPlaceholders } from "../placeholders";

export const makeCustomIconUrl = (options: CustomIconOptions): string => {
  const { pattern } = options;

  const placeholders = getPlaceholders(pattern);

  const url = placeholders.reduce((acc, placeholder) => {
    const key = placeholder.replace(/[[\]]/g, "");
    const getKeyValue = mPipe(Obj.readKey(key), Str.read);
    const value = getKeyValue(options);

    return value ? acc.replace(placeholder, value) : acc;
  }, pattern);

  return url.replace(/[{}\s]/g, "");
};

export const getCustomIconUrl = (
  config: ConfigCommon,
  iconName: string,
  fileName?: string
): string => {
  const { iconUrl, iconPattern } = config.api?.customIcon ?? {};

  if (!iconPattern || !iconUrl) {
    return "";
  }

  const options = {
    pattern: iconPattern.original,
    baseUrl: iconUrl,
    uid: iconName,
    fileName
  };

  return makeCustomIconUrl(options);
};
