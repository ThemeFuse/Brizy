import { fromRecord, Image } from "./types/Image";
import {
  callGetter,
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { mPipe, pass, pipe } from "visual/utils/fp";
import * as Json from "visual/utils/reader/json";
import { isT, onNullish } from "visual/utils/value";
import { isObject } from "visual/utils/reader/object";

export const defaultValue: Image[] = [];
export const fromElementModel: FromElementModel<"gallery-dev"> = pipe(
  mPipe(callGetter("value"), Json.read, pass(Array.isArray), (vs): Image[] =>
    vs
      .filter(isObject)
      .map(fromRecord)
      .filter(isT)
  ),
  onNullish<Image[]>([])
);
export const toElementModel: ToElementModel<"gallery-dev"> = v => ({
  value: JSON.stringify(v)
});
