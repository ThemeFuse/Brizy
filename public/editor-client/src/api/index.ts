import { getConfig } from "../config";

//#region Common Utils Request & PersistentRequest
export function request(
  url: string,
  config: RequestInit = {}
): Promise<Response> {
  // will see later if we'll have to hardcode
  // some settings into config like we do for brizy cloud
  // In WP referer must be root window not iframe
  const { fetch } = window.parent || window;
  return fetch(url, config);
}

export const makeUrl = (
  baseUrl: string,
  params: Record<string, string> = {}
): string => {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
};

export function getClasses(): Promise<unknown> {
  const { url: _url, hash, getSymbols, editorVersion } = getConfig();
  const url = makeUrl(_url, {
    action: getSymbols,
    version: editorVersion,
    hash,
  });

  return request(url, { method: "GET" });
}
