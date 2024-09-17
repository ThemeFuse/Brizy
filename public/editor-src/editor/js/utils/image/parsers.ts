import { mPipe, optional } from "fp-utilities";
import {
  CropData,
  ImagePatterns
} from "visual/global/Config/types/configs/common";
import { readWithParser } from "visual/utils/reader/readWithParser";
import { Num, Str, Obj } from "@brizy/readers";

export const parseCropData = mPipe(
  Obj.read,
  readWithParser<Record<string, unknown>, CropData>({
    iW: mPipe(Obj.readKey("iW"), Num.read),
    iH: mPipe(Obj.readKey("iH"), (v) => Num.read(v) ?? "any"),
    oX: optional(mPipe(Obj.readKey("oX"), Num.read)),
    oY: optional(mPipe(Obj.readKey("oY"), Num.read)),
    cW: optional(mPipe(Obj.readKey("cW"), Num.read)),
    cH: optional(mPipe(Obj.readKey("cH"), Num.read))
  })
);

export const parseImagePatterns = mPipe(
  Obj.read,
  readWithParser<Record<string, unknown>, ImagePatterns>({
    full: mPipe(Obj.readKey("full"), Str.read),
    split: mPipe(Obj.readKey("split"), Str.read),
    original: mPipe(Obj.readKey("original"), Str.read)
  })
);
