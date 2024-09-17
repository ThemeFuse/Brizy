import { or } from "fp-utilities";
import * as Option from "visual/component/Options/Type";
import type { Value } from "visual/component/Options/types/dev/PromptAddPopup/types";
import { pipe } from "visual/utils/fp";
import { read as readString } from "visual/utils/reader/string";
import { readPopups } from "./utils";

export const defaultValue: Value = {
  value: "",
  popups: []
};

export const fromElementModel: Option.FromElementModel<"promptAddPopup"> = (
  get
) => ({
  value: readString(get("value")) ?? defaultValue.value,
  popups:
    pipe(
      or(
        (k: string) => get(k),
        (k: string) => get(k, true)
      ),
      readPopups
    )("popups") ?? defaultValue.popups
});

export const toElementModel: Option.ToElementModel<"promptAddPopup"> = (
  value
) => ({
  value: value.value,
  popups: value.popups
});
