import * as Option from "visual/component/Options/Type";
import { FromElementModel } from "visual/component/Options/Type";
import { read } from "./types/Post";
import { MValue } from "visual/utils/value";
import { ChoiceWithPermalink } from "./types";

export const defaultValue: MValue<ChoiceWithPermalink> = undefined;

export const fromElementModel: FromElementModel<"internalLink"> = (get) => {
  return read({
    value: get("value"),
    title: get("title"),
    source: get("source") ?? get("linkSource", true) ?? get("source", true)
  });
};

export const toElementModel: Option.ToElementModel<"internalLink"> = (
  values
) => {
  return {
    value: values?.value,
    title: values?.title,
    source: values?.source
  };
};
