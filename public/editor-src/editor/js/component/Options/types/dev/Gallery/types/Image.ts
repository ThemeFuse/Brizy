import { readWithParser } from "visual/utils/reader/readWithParser";
import { mPipe } from "visual/utils/fp";
import { prop } from "visual/utils/object/get";
import * as Str from "visual/utils/string/specs";
import { IsEqual } from "visual/utils/types/Eq";

export interface Image {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromRecord = readWithParser<Record<any, any>, Image>({
  name: mPipe(prop("name"), Str.read)
});

export const eq: IsEqual<Image> = (a, b) => a.name === b.name;
