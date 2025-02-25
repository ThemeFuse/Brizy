import { PageCommon } from "visual/types/Page";

//#region Page

export const readPageData = (page: PageCommon): PageCommon => {
  return page.data ? page : { ...page, data: { items: [] } };
};

//#endregion
