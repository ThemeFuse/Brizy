import { Str } from "@brizy/readers";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { request } from "visual/utils/api";
import { makeUrl, parseJSON } from "../../../common/utils";
import { AccountsResolve, AddAccount, DeleteAccount } from "./type";

type NormalizeAccountsResolve = {
  status: Response["status"];
  data: Array<{ group: string; services: string }> | null;
};

type NormalizeAccounts = (res: AccountsResolve) => NormalizeAccountsResolve;

const normalizeAccounts: NormalizeAccounts = (res) => {
  const { data } = res;

  if (data) {
    return {
      ...res,
      data: data.map((account) => ({
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

export const getAccounts = (
  data: {
    group: string;
    services: string;
  },
  config: ConfigCommon
): Promise<NormalizeAccountsResolve> => {
  const { group } = data;

  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;
  const url = makeUrl(`${api}/accounts`, {
    type: group,
    container: Str.read(containerId) ?? ""
  });

  return request(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    },
    config
  )
    .then((r) => parseJSON<Array<{ type: string }> | null>(r))
    .then(normalizeAccounts);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addAccount: AddAccount = ({ group, service, ...data }, config) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;

  return request(
    `${api}/accounts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        type: group,
        container: containerId,
        data: JSON.stringify(data)
      })
    },
    config
  )
    .then(parseJSON)
    .then((res) => res);
};

export const deleteAccount: DeleteAccount = async (id, config) => {
  const { api } = config.urls ?? {};

  const response = await request(
    `${api}/accounts/${id}`,
    {
      method: "DELETE"
    },
    config
  );

  return { status: response.status };
};
