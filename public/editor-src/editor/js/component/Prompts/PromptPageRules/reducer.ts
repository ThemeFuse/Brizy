import { Setters } from "./types/Setters";
import { Item, Invalid, Valid } from "./types";
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
    case "SetRules":
      return {
        ...v,
        items: v.items.map(i => ({
          ...i,
          selected: a.payload.includes(i.id.toString())
        })) as [Item, ...Item[]]
      };
    case "SetTitle":
      return { ...v, title: a.payload };
  }
};

export const validate = (v: Invalid): Either<Invalid, Valid> => {
  const { title, items } = v;

  if (!title || !NoEmptyString.is(title)) {
    return left({
      ...v,
      error: t("You must specify a title")
    });
  }

  if (!items.filter(i => i.selected).length) {
    return left({
      ...v,
      error: t("You must be have one selected item")
    });
  }

  return right({
    title,
    items: v.items,
    activeTab: v.activeTab,
    layout: v.layout,
    layouts: v.layouts,
    error: undefined
  });
};

export const reducer = createReducer(setters, validate);
