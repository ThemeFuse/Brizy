import Config from "visual/global/Config";
import { makeUrl, parseJSON } from "../../../common/utils";
import { request2 } from "visual/utils/api";
import { AccountsResolve, AddAccount, DeleteAccount } from "./type";

type NormalizeAccountsResolve = {
  status: Response["status"];
  data: Array<{ group: string; services: string }> | null;
};

type NormalizeAccounts = (res: AccountsResolve) => NormalizeAccountsResolve;

const normalizeAccounts: NormalizeAccounts = res => {
  const { data } = res;

  if (data) {
    return {
      ...res,
      data: data.map(account => ({
        ...account,
        group: account.type,
        services: account.type
      }))
    };
  } else {
    return {
      ...res,
      data: null
    };
  }
};

export const getAccounts = ({
  group,
  services // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  group: string;
  services: string;
}): Promise<NormalizeAccountsResolve> => {
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
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addAccount: AddAccount = ({ group, service, ...data }) => {
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
};

export const deleteAccount: DeleteAccount = id => {
  const { api } = Config.get("urls");

  return request2(`${api}/accounts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(res => res);
};
