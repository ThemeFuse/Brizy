import { parseQueryString } from ".";

export const getUrlQueryParam = (
  url: string,
  param: string
): string | undefined => {
  if (url && param) {
    if (url.includes("/shorts/")) {
      const videoId = url.split("/shorts/")[1];
      return videoId ? videoId.split("?")[0] : undefined;
    }

    return parseQueryString(url.split("?")[1])?.[param];
  }

  return undefined;
};
