import { Config, getConfig } from "../config";
import { ScreenshotType } from "../types/Screenshots";
import { MValue } from "../utils/types";
import { urlContainsQueryString } from "../utils/url/urlContainerQueryString";
export const getScreenshotUrl = ({
  _thumbnailSrc,
  type
}: ScreenshotType): string => {
  const config = getConfig();
  const siteUrl = determineScreenshotUrl(type, config);

  return urlContainsQueryString(siteUrl)
    ? `${siteUrl}&${_thumbnailSrc}`
    : `${siteUrl}?${_thumbnailSrc}`;
};

const determineScreenshotUrl = (
  type: string,
  config: MValue<Config>
): string => {
  switch (type) {
    case "normal":
      return config?.api.screenshots.normalScreenshotUrl ?? "";
    case "global":
      return config?.api.screenshots.globalScreenshotUrl ?? "";
    case "saved":
      return config?.api.screenshots.savedScreenshotUrl ?? "";
    case "layout":
      return config?.api.screenshots.layoutScreenshotUrl ?? "";
    default:
      return "";
  }
};
