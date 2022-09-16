import Config from "visual/global/Config";

export const apiUrl: string = Config.get("urls")?.api;
export const paginationData = {
  page: 1,
  count: 300,
  orderBy: undefined,
  order: undefined
} as const;
