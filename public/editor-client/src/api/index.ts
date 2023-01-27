import { getConfig } from "../config";
import { Project } from "../types/Project";
import { ResponseWithBody } from "../types/Response";

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

export function persistentRequest<T>(
  url: string,
  config: RequestInit = {}
): Promise<ResponseWithBody<T>> {
  return new Promise((resolve, reject) => {
    let failedAttempts = 0;

    const req = (url: string, config: RequestInit) => {
      return request(url, config).then((r) => {
        if (r.status === 500) {
          // >= 500 - server unavailable
          if (failedAttempts <= 5) {
            failedAttempts++;
            setTimeout(() => {
              req(url, config);
            }, 5000 * failedAttempts);
          } else {
            reject(r);
          }
        } else {
          r.json()
            .then((body) => {
              resolve({
                status: r.status,
                ok: r.ok,
                data: body.data
              });
            })
            .catch(reject);
        }
      });
    };

    req(url, config);
  });
}

//#endregion

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

//#region Project

type _Project = Omit<Project, "data">;

export interface APIProject extends _Project {
  data: string;
}

export function updateProject(
  project: APIProject,
  meta: { is_autosave?: 1 | 0 } = {}
): Promise<unknown> {
  const config = getConfig();

  if (!config) {
    throw new Error("Invalid __BRZ_PLUGIN_ENV__");
  }

  const { url: _url, hash, editorVersion, actions } = config;

  const url = makeUrl(_url, {
    action: actions.setProject,
    version: editorVersion,
    hash
  });
  const { is_autosave = 1 } = meta;
  const { data, dataVersion } = project;
  const body = new URLSearchParams({
    data,
    dataVersion: `${dataVersion}`,
    is_autosave: `${is_autosave}`
  });

  return persistentRequest(url, { method: "POST", body });
}

//#endregion
