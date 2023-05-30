import { getConfig } from "../config";
import { UploadData } from "../types/File";

//#region Common Utils Request & PersistentRequest

export function request(
  url: string,
  params: RequestInit = {}
): Promise<Response> {
  const config = getConfig();

  if (!config) {
    throw new Error("Invalid __CLOUD_ENV__");
  }

  const { token, editorVersion } = config;

  return fetch(url, {
    ...params,
    headers: {
      ...params.headers,
      ...(token ? { "x-auth-user-token": token } : {}),
      "x-editor-version": editorVersion
    }
  });
}

//#endregion

//#region Image

export async function uploadImage(data: {
  base64: string;
  filename: string;
}): Promise<{ uid: string; fileName: string }> {
  const config = getConfig();

  if (!config) {
    throw new Error("Invalid __CLOUD_ENV__");
  }

  const body = new URLSearchParams({
    attachment: data.base64,
    filename: data.filename
  });

  return request(config.api.uploadMediaUrl, {
    method: "POST",
    body
  })
    .then((r) => r.json())
    .then((r) => {
      return {
        uid: r.name,
        fileName: r.filename
      };
    });
}

//#endregion

//#region File
export async function uploadFile(data: {
  filename: string;
  attachment: string;
}): Promise<UploadData> {
  const config = getConfig();
  const { filename, attachment } = data;

  if (!config) {
    throw new Error("Invalid __CLOUD_ENV__");
  }

  return request(config.api.uploadFileUrl, {
    method: "POST",
    body: new URLSearchParams({
      attachment,
      project: config.projectId,
      filename
    })
  })
    .then((r) => r.json())
    .then((value) => value);
}
//#endregion
