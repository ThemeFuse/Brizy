import { optional, parse } from "fp-utilities";
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
import { isNotClonedFromGallery } from "./utils";

const fromRecord = parse<Record<string, unknown>, Value>({
  id: mPipe(prop("_id"), Str.read),
  uid: mPipe(prop("imageSrc"), Str.read),
  fileName: optional(mPipe(prop("imageFileName"), Str.read)),
  width: mPipe(prop("imageWidth"), Num.read),
  height: mPipe(prop("imageHeight"), Num.read)
});

export const defaultValue: Value[] = [];
export const fromElementModel: FromElementModel<"gallery-for-gallery"> = pipe(
  mPipe(callGetter("value"), pass(Array.isArray), (vs): Value[] => {
    return vs
      .filter(isObject)
      .filter(isNotClonedFromGallery)
      .map((v) => v.value)
      .filter(isObject)
      .map(fromRecord)
      .filter(isT);
  }),
  onNullish<Image[]>([])
);
export const toElementModel: ToElementModel<"gallery-for-gallery"> = (
  value: Array<Value | Image>
) => ({ option: value });
