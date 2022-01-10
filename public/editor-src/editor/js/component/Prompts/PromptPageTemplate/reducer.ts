import { Setters } from "./types/Setters";
import { Invalid, Valid } from "./types";
import { createReducer } from "visual/component/Prompts/common/states/Classic/reducer";
import {
  Either,
  left,
  right
} from "visual/component/Prompts/common/states/Classic/types/Either";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import { t } from "visual/utils/i18n";

export const setters = (v: Invalid, a: Setters): Invalid => {
  switch (a.type) {
    case "SetLayout":
      return { ...v, layout: a.payload };
    case "SetTitle":
      return { ...v, title: a.payload };
  }
};

export const validate = (v: Invalid): Either<Invalid, Valid> => {
  const { title } = v;

  if (!title || !NoEmptyString.is(title)) {
    return left({
      ...v,
      error: t("You must specify a title")
    });
  }

  return right({
    title,
    activeTab: v.activeTab,
    layout: v.layout,
    layouts: v.layouts,
    error: undefined
  });
};

export const reducer = createReducer(setters, validate);
