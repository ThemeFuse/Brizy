import { parseQueryString } from ".";

export const getUrlQueryParam = (
  url: string,
  param: string
): string | undefined => {
  if (url && param) {
    return parseQueryString(url.split("?")[1])?.[param];
  }

  return undefined;
};
