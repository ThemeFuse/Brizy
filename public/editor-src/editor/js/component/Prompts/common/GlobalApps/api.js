import Config from "visual/global/Config";
import { makeRequest } from "../../common/utils";

export function getAccounts(data) {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "GET",
    url: api.url,
    queryParams: {
      action: api.getAccounts,
      hash: api.hash,
      ...(data ? data : {})
    }
  });
}

export function addAccount(body) {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "POST",
    url: api.url,
    queryParams: {
      action: api.addAccount,
      hash: api.hash
    },
    body: JSON.stringify(body)
  });
}

export function updateAccount(body) {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "POST",
    url: api.url,
    queryParams: {
      action: api.updateAccount,
      hash: api.hash
    },
    body: JSON.stringify(body)
  });
}

export function deleteAccount(id) {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "DELETE",
    url: api.url,
    queryParams: {
      action: api.deleteAccount,
      hash: api.hash,
      id
    }
  });
}
