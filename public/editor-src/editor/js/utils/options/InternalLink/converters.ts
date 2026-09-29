import { or } from "fp-utilities";
import type * as Option from "visual/component/Options/Type";
import type { FromElementModel } from "visual/component/Options/Type";
import type { ChoiceWithPermalink } from "visual/component/Options/types/dev/InternalLink/types";
import type { MValue } from "visual/utils/value";
import { read } from "./utils";

export const defaultValue: MValue<ChoiceWithPermalink> = {
  value: "",
  title: "",
  source: ""
};

export const fromElementModel: FromElementModel<"internalLink"> = (get) =>
  read({
    value: get("value") ?? defaultValue.value,
    title: get("title") ?? defaultValue.title,
    source: or(
      () => get("source"),
      () => get("linkSource", true),
      () => get("source", true),
      () => defaultValue.source
    )()
  });

export const toElementModel: Option.ToElementModel<"internalLink"> = (
  values
) => {
  return {
    value: values?.value,
    title: values?.title,
    source: values?.source
  };
};
