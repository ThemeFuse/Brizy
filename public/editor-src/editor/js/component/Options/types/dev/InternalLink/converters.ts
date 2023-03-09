import { FromElementModel } from "visual/component/Options/Type";
import { MValue } from "visual/utils/value";
import {
  Post,
  read
} from "visual/component/Options/types/dev/InternalLink/types/Post";
import * as Option from "visual/component/Options/Type";

export const defaultValue: MValue<Post> = undefined;

export const fromElementModel: FromElementModel<"internalLink-dev"> = get =>
  read({
    id: get("value"),
    title: get("title")
  });

export const toElementModel: Option.ToElementModel<"internalLink-dev"> = values => {
  return {
    value: values?.id,
    title: values?.title
  };
};
