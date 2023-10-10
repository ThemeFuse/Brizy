import { PageCommon } from "visual/types";

export const readPageData = (page: PageCommon): PageCommon => {
  return page.data ? page : { ...page, data: { items: [] } };
};
