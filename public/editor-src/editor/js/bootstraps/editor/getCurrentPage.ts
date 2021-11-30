import Config, { Cloud } from "visual/global/Config";
import {
  getExternalPopups,
  createExternalPopup,
  getPage,
  getCustomerPage
} from "visual/utils/api";
import { PageError } from "visual/utils/errors";
import { IS_PAGE, IS_SINGLE, IS_ARCHIVE } from "visual/utils/env";
import {
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP,
  IS_STORY
} from "visual/utils/models";
import { Page } from "visual/types";
import * as Str from "visual/utils/reader/string";
import { isCustomer } from "visual/global/Config/types/configs/Cloud";

export async function getCurrentPage(): Promise<Page> {
  if (TARGET === "WP") {
    const pageId = Str.read(Config.get("wp").page) ?? "";
    return getPage(pageId);
  } else {
    const config = Config.getAll() as Cloud;

    if (IS_PAGE) {
      const pageId = Str.read(config.page?.id) ?? "";
      return isCustomer(config) ? getCustomerPage(pageId) : getPage(pageId);
    }

    if (IS_SINGLE || IS_ARCHIVE || IS_STORY || IS_INTERNAL_POPUP) {
      const pageId = Str.read(config.page?.id) ?? "";
      return getPage(pageId);
    }

    if (IS_EXTERNAL_POPUP) {
      const popups = await getExternalPopups();
      if (!popups.length) {
        const popupData = {
          project: config.project.id,
          data: null,
          dataVersion: 1,
          status: "draft"
        };

        // eslint-disable-next-line @typescript-eslint/camelcase
        const meta = { is_autosave: 0 };

        try {
          return await createExternalPopup(popupData, meta);
        } catch (e) {
          throw new PageError(`Could not create external popup ${e}`);
        }
      }

      return popups[0];
    }

    throw new Error("unexpected mode");
  }
}
