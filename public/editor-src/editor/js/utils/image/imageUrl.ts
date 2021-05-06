import _ from "underscore";
import { isPlaceholderStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config from "visual/global/Config";
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
  imageSrc: unknown,
  options: Options = {
    iW: 5000,
    iH: "any"
  }
): string | null {
  if (imageSrc) {
    const filter = getFilter(options);
    return [Config.get("urls").image, filter, imageSrc].join("/");
  }

  return null;
}

export function svgUrl(src: unknown): string | null {
  if (src) {
    return [Config.get("urls").image, "original", src].join("/");
  }

  return null;
}

export function imageUrl2(imageSrc: string, options?: Options): string {
  return isAbsoluteUrl(imageSrc) || isPlaceholderStr(imageSrc)
    ? imageSrc
    : imageUrl(imageSrc, options) ?? "";
}
