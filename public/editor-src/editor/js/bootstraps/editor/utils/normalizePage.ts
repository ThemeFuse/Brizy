import { set } from "es-toolkit/compat";
import { produce } from "immer";
import { EditorMode, isPopup } from "visual/providers/EditorModeProvider";
import { PageCommon } from "visual/types/Page";
import { setIds } from "visual/utils/models";
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
  const items = setIds(page.data.items, {
    keepExistingIds: true
  });

  return set(page, "data.items", items);
}
