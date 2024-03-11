import {
  FromElementModel,
  ToElementModel,
  callGetter
} from "visual/component/Options/Type";
import { mPipe, pass, pipe } from "visual/utils/fp";
import * as Json from "visual/utils/reader/json";
import { isObject } from "visual/utils/reader/object";
import { isT, onNullish } from "visual/utils/value";
import { Image, fromRecord } from "./types/Image";

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
