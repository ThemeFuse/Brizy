import { PageCommon } from "visual/types";

//#region Page

export const readPageData = (page: PageCommon): PageCommon => {
  return page.data ? page : { ...page, data: { items: [] } };
};

//#endregion
