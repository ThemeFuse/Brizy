import { produce } from "immer";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { PageCommon } from "visual/types";
import { isPopup } from "visual/utils/models";
import { isNullish } from "visual/utils/value";

const defaultTriggers = [{ id: "pageLoad", active: true, value: "1" }];

export function normalizePage(
  page: PageCommon,
  config: ConfigCommon
): PageCommon {
  if (isPopup(config) && isNullish(page.data.triggers)) {
    return produce(page, (draft) => {
      draft.data.triggers = defaultTriggers;
    });
  }

  return page;
}
