import Config from "visual/global/Config";
import { getPage, getCustomerPage } from "visual/utils/api";
import { getCurrentPageId } from "./getCurrentPageId";
import { Page } from "visual/types";
import { isWp } from "visual/global/Config/types/configs/WP";
import { isCustomer, isCMS } from "visual/global/Config/types/configs/Cloud";

export async function getCurrentPage(): Promise<Page> {
  const pageId = getCurrentPageId();
  const config = Config.getAll();

  if (isWp(config)) {
    return getPage(pageId);
  }

  if (isCMS(config) && isCustomer(config)) {
    return getCustomerPage(pageId);
  }

  return getPage(pageId);
}
