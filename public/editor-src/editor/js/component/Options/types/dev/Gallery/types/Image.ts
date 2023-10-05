import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { prop } from "visual/utils/object/get";
import { readWithParser } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/string/specs";
import { IsEqual } from "visual/utils/types/Eq";

export interface Image {
  uid: string;
  fileName: string;
  width: number;
  height: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromRecord = readWithParser<Record<any, any>, Image>({
  uid: mPipe(prop("uid"), Str.read),
  fileName: mPipe(prop("fileName"), Str.read),
  width: mPipe(prop("width"), Num.read),
  height: mPipe(prop("height"), Num.read)
});

export const eq: IsEqual<Image> = (a, b) =>
  a.uid === b.uid && a.width === a.width && a.height === a.height;
