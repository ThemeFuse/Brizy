import { Response } from "visual/utils/api/response";
import { ResponseWithBody } from "visual/component/Prompts/common/utils/Request";

export type AccountsResolve = {
  status: Response["status"];
  data: Array<{ type: string }> | null;
};

export type GetAccount = (data: {
  group: string;
  service: string;
}) => Promise<Array<{ group: string; services: string }>>;

export type AddAccount = (data: {
  group: string;
  service: string;
  [apiKey: string]: string;
}) => Promise<ResponseWithBody<unknown>>;

export type DeleteAccount = (id: string) => Promise<ResponseWithBody<unknown>>;
