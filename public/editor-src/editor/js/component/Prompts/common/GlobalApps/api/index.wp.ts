import Config from "visual/global/Config";
import { request } from "visual/utils/api/index.wp";
import { makeUrl, parseJSON } from "../../../common/utils";
import { AddAccount, DeleteAccount, GetAccount } from "./type";

export const getAccounts: GetAccount = (data) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getAccounts,
    hash: api.hash,
    version,
    ...(data ? data : {})
  });

  return request(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((r) => parseJSON<Array<{ group: string; services: string }>>(r));
};

export const addAccount: AddAccount = (body) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.addAccount,
    hash: api.hash,
    version
  });

  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  })
    .then(parseJSON)
    .then((res) => res);
};

export const deleteAccount: DeleteAccount = (id) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.deleteAccount,
    hash: api.hash,
    version,
    id
  });

  return request(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then((res) => res);
};
