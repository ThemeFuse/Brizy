import { produce } from "immer";
import { EditorMode, isPopup } from "visual/providers/EditorModeProvider";
import { PageCommon } from "visual/types/Page";
import { isNullish } from "visual/utils/value";

const defaultTriggers = [{ id: "pageLoad", active: true, value: "1" }];

export function normalizePage(
  page: PageCommon,
  editorMode: EditorMode
): PageCommon {
  if (isPopup(editorMode) && isNullish(page.data.triggers)) {
    return produce(page, (draft) => {
      draft.data.triggers = defaultTriggers;
    });
  }

  return page;
}
