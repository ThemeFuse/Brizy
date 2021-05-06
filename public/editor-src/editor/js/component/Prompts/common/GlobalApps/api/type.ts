import { Response } from "visual/utils/api/response";

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
}) => Promise<Response>;

export type DeleteAccount = (id: string) => Promise<Response>;
