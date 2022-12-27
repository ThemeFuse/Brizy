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

// export function getClasses(): Promise<unknown> {
//   const { url: _url, hash, getSymbols, editorVersion } = getConfig();
//   const url = makeUrl(_url, {
//     action: getSymbols,
//     version: editorVersion,
//     hash,
//   });
//
//   return request(url, { method: "GET" });
// }

//#region Image

export const getImageUid = async (id: string): Promise<{ uid: string }> => {
  const config = getConfig();

  if (!config) {
    throw new Error("Invalid __BRZ_PLUGIN_ENV__");
  }

  const { pageId, url, hash, editorVersion, actions } = config;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: actions.getMediaUid,
    post_id: pageId,
    attachment_id: id
  });

  const r = await request(url, {
    method: "POST",
    body
  });

  const rj = await r.json();

  if (rj.success) {
    return rj.data;
  } else {
    throw rj;
  }
};

//#endregion
