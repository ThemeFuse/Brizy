import produce from "immer";
import Config from "visual/global/Config";
import { makeUrl, parseJSON } from "../../../common/utils";
import { request2 } from "visual/utils/api/editor";

const normalizeAccounts = res => {
  return produce(res, draft => {
    draft.data = draft.data.map(account => ({
      ...account,
      group: account.type,
      services: account.type
    }));
  });
};

export function getAccounts({ group }) {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const url = makeUrl(`${api}/accounts`, {
    type: group,
    container: containerId
  });

  return request2(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(normalizeAccounts);
}

/* eslint-disable no-unused-vars */
export function addAccount({ group, service, ...data }) {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      type: group,
      container: containerId,
      data: JSON.stringify(data)
    })
  })
    .then(parseJSON)
    .then(res => res);
}
/* eslint-enabled no-unused-vars */

export function deleteAccount(id) {
  const { api } = Config.get("urls");

  return request2(`${api}/accounts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(({ status, body: data }) => ({ status, data }));
}
