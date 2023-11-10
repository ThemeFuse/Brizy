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
    case "SetTitle":
      return { ...v, title: a.payload };
    case "SetIsHomePage":
      return { ...v, isHomePage: a.payload };
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

  const { activeTab, layout, layouts, isHomePage } = v;

  return right({
    title,
    activeTab,
    layout,
    layouts,
    isHomePage,
    error: undefined
  });
};

export const reducer = createReducer(setters, validate);
