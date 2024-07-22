import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { Image } from "visual/component/Options/types/dev/Gallery/types/Image";
import { mPipe, pass, pipe } from "visual/utils/fp";
import { callGetter } from "visual/utils/options/utils/wrap";
import * as Json from "visual/utils/reader/json";
import { isObject } from "visual/utils/reader/object";
import { isT, onNullish } from "visual/utils/value";
import { fromRecord } from "./utils";

export const defaultValue: Image[] = [];
export const fromElementModel: FromElementModel<"gallery"> = pipe(
  mPipe(callGetter("value"), Json.read, pass(Array.isArray), (vs): Image[] =>
    vs.filter(isObject).map(fromRecord).filter(isT)
  ),
  onNullish<Image[]>(defaultValue)
);
export const toElementModel: ToElementModel<"gallery"> = (v) => ({
  value: JSON.stringify(v)
});
