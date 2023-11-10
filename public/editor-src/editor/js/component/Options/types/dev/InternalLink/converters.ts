import { FromElementModel } from "visual/component/Options/Type";
import * as Option from "visual/component/Options/Type";
import { read } from "visual/component/Options/types/dev/InternalLink/types/Post";
import { MValue } from "visual/utils/value";
import { ChoiceWithPermalink } from "./types";

export const defaultValue: MValue<ChoiceWithPermalink> = undefined;

export const fromElementModel: FromElementModel<"internalLink-dev"> = (get) => {
  return read({
    value: get("value"),
    title: get("title")
  });
};

export const toElementModel: Option.ToElementModel<"internalLink-dev"> = (
  values
) => {
  return {
    value: values?.value,
    title: values?.title
  };
};
