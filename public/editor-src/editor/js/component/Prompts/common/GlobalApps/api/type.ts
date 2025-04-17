import { ResponseWithBody } from "visual/component/Prompts/common/utils/Request";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Response } from "visual/utils/api/response";

export type AccountsResolve = {
  status: Response["status"];
  data: Array<{ type: string }> | null;
};

export type GetAccount = (
  data: {
    group: string;
    service: string;
  },
  config: ConfigCommon
) => Promise<ResponseWithBody<Array<{ group: string; services: string }>>>;

export type AddAccount = (
  data: {
    group: string;
    service: string;
    [apiKey: string]: string;
  },
  config: ConfigCommon
) => Promise<ResponseWithBody<unknown>>;

export type DeleteAccount = (
  id: string,
  config: ConfigCommon
) => Promise<{ status: number }>;
