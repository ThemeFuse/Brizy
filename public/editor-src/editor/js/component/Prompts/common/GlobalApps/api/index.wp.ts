import { Str } from "@brizy/readers";
import { WP } from "visual/global/Config";
import { request } from "visual/utils/api/index.wp";
import { makeUrl, parseJSON } from "../../../common/utils";
import { AddAccount, DeleteAccount, GetAccount } from "./type";

export const getAccounts: GetAccount = (data, config) => {
  const { api } = (config as WP).wp;
  const version = config.editorVersion;
  const url = makeUrl(api.url, {
    action: Str.read(api.getAccounts) ?? "",
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

export const addAccount: AddAccount = (body, config) => {
  const { api } = (config as WP).wp;
  const version = config.editorVersion;
  const url = makeUrl(api.url, {
    action: Str.read(api.addAccount) ?? "",
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

export const deleteAccount: DeleteAccount = (id, config) => {
  const { api } = (config as WP).wp;
  const version = config.editorVersion;
  const url = makeUrl(api.url, {
    action: Str.read(api.deleteAccount) ?? "",
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
