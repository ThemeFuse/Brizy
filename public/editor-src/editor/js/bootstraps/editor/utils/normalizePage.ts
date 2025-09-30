import { set } from "es-toolkit/compat";
import { produce } from "immer";
import { EditorMode, isPopup } from "visual/providers/EditorModeProvider";
import { PageCommon } from "visual/types/Page";
import { setIds } from "visual/utils/models";
import { BlockRecord } from "visual/utils/reader/globalBlocks";
import { isNullish } from "visual/utils/value";

const defaultTriggers = [{ id: "pageLoad", active: true, value: "1" }];

export function normalizePage(
  page: PageCommon,
  globalBlocks: BlockRecord,
  editorMode: EditorMode
): PageCommon {
  if (isPopup(editorMode)) {
    return produce(page, (draft) => {
      if (isNullish(page.data.triggers)) {
        draft.data.triggers = defaultTriggers;
      }

      draft.data.items = draft.data.items.filter(
        (item) => item.type !== "GlobalBlock" || item.value._id in globalBlocks
      );
    });
  }
  const items = setIds(page.data.items, {
    keepExistingIds: true
  });

  return set(page, "data.items", items);
}
