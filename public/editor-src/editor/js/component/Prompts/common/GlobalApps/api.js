import Config from "visual/global/Config";
import { makeUrl, parseJSON } from "../../common/utils";
import { request2 } from "visual/utils/api/editor";

export function getAccounts(data) {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getAccounts,
    hash: api.hash,
    version,
    ...(data ? data : {})
  });

  return request2(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(res => res);
}

export function addAccount(body) {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.addAccount,
    hash: api.hash,
    version
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  })
    .then(parseJSON)
    .then(res => res);
}

export function deleteAccount(id) {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.deleteAccount,
    hash: api.hash,
    version,
    id
  });

  return request2(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(res => res);
}
