import { parse } from "fp-utilities";
import {
  FromElementModel,
  ToElementModel,
  callGetter
} from "visual/component/Options/Type";
import { mPipe, pass, pipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { prop } from "visual/utils/object/get";
import { isObject } from "visual/utils/reader/object";
import * as Str from "visual/utils/string/specs";
import { isT, onNullish } from "visual/utils/value";
import { Image } from "../Gallery/types/Image";
import { Value } from "./index";

const fromRecord = parse<Record<string, unknown>, Value>({
  id: mPipe(prop("_id"), Str.read),
  name: mPipe(prop("imageSrc"), Str.read),
  fileName: mPipe(prop("fileName"), Str.read),
  width: mPipe(prop("imageWidth"), Num.read),
  height: mPipe(prop("imageHeight"), Num.read)
});

export const defaultValue: Value[] = [];
export const fromElementModel: FromElementModel<"gallery-for-gallery-dev"> =
  pipe(
    mPipe(callGetter("value"), pass(Array.isArray), (vs): Value[] => {
      return vs
        .filter(isObject)
        .map((v) => v.value)
        .filter(isObject)
        .map(fromRecord)
        .filter(isT);
    }),
    onNullish<Image[]>([])
  );
export const toElementModel: ToElementModel<"gallery-for-gallery-dev"> = (
  value: Array<Value | Image>
) => ({ option: value });
