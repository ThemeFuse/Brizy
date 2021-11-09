import _ from "underscore";
import { isPlaceholderStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config, { Cloud } from "visual/global/Config";
import { objectToQueryString, isAbsoluteUrl } from "visual/utils/url";

export type Options = {
  iW: number;
  iH: string | number;
};

export const getFilter = (options: Options): string => {
  const roundedOptions = _.mapObject(options, val =>
    typeof val === "number" ? Math.round(val) : val
  );

  return objectToQueryString(roundedOptions);
};

export default function imageUrl(
  src: string,
  options: Options = {
    iW: 5000,
    iH: "any"
  }
): string | null {
  if (isAbsoluteUrl(src) || isPlaceholderStr(src)) {
    return src;
  }

  if (src) {
    const filter = getFilter(options);
    return [Config.get("urls").image, filter, src].join("/");
  }

  return null;
}

export function svgUrl(src: unknown): string | null {
  if (src) {
    return [Config.get("urls").image, "original", src].join("/");
  }

  return null;
}

export function imageSpecificSize(src: string, size: string): string {
  const config = Config.getAll() as Cloud;
  const { urls } = config;
  return [urls.image, size, src].join("/");
}
