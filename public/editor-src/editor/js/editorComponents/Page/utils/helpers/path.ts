import produce from "immer";
import { ElementModelType } from "visual/component/Elements/Types";
import { FromTo } from "../types";
import { createFullModelPath } from "visual/utils/models";

export const normalizeFromTo = (
  model: ElementModelType,
  fromTo: FromTo
): FromTo => {
  return produce(fromTo, (draft) => {
    if ("itemPath" in draft.from) {
      draft.from.itemPath = createFullModelPath(model, draft.from.itemPath);
    }

    if ("containerPath" in draft.from) {
      draft.from.containerPath = createFullModelPath(
        model,
        draft.from.containerPath
      );
    }

    if ("itemPath" in draft.to) {
      draft.to.itemPath = createFullModelPath(model, draft.to.itemPath);
    }

    if ("containerPath" in draft.to) {
      draft.to.containerPath = createFullModelPath(
        model,
        draft.to.containerPath
      );
    }
  });
};
