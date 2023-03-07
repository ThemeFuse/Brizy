import { createReducer } from "visual/component/Prompts/common/states/Classic/reducer";
import {
  Either,
  left,
  right
} from "visual/component/Prompts/common/states/Classic/types/Either";
import { t } from "visual/utils/i18n";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import { Invalid, Valid } from "./types";
import { Setters } from "./types/Setters";

export const setters = (v: Invalid, a: Setters): Invalid => {
  switch (a.type) {
    case "SetLayout":
      return { ...v, layout: a.payload };
    case "SetBlog":
      return {
        ...v,
        selected: v.items.find((i) => i.id === a.payload) ?? v.selected
      };
    case "SetTitle":
      return { ...v, title: a.payload };
  }
};

export const validate = (v: Invalid): Either<Invalid, Valid> => {
  const { title, selected } = v;

  if (!title || !NoEmptyString.is(title)) {
    return left({
      ...v,
      error: t("You must specify a title")
    });
  }

  if (!selected) {
    return left({
      ...v,
      error: t("You must have one selected item")
    });
  }

  return right({
    title,
    items: v.items,
    selected: selected,
    activeTab: v.activeTab,
    layout: v.layout,
    layouts: v.layouts,
    error: undefined
  });
};

export const reducer = createReducer(setters, validate);
