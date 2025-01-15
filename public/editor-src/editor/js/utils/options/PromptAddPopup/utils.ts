import { mPipe, optional, or, parseStrict } from "fp-utilities";
import { Block } from "visual/types";
import { pipe } from "visual/utils/fp";
import { readWithItemReader } from "visual/utils/reader/array";
import { read as readNum } from "visual/utils/reader/number";
import { readKey, read as readObj } from "visual/utils/reader/object";
import { read as readStr } from "visual/utils/reader/string";
import { Reader } from "visual/utils/reader/types";
import { throwOnNullish } from "visual/utils/value";

const readMeta = parseStrict<Record<string, unknown>, Block["meta"]>({
  _thumbnailSrc: pipe(
    readKey("_thumbnailSrc"),
    readStr,
    throwOnNullish("Invalid _thumbnailSrc")
  ),
  _thumbnailHeight: pipe(
    readKey("_thumbnailHeight"),
    readNum,
    throwOnNullish("Invalid _thumbnailHeight")
  ),
  _thumbnailWidth: pipe(
    readKey("_thumbnailWidth"),
    readNum,
    throwOnNullish("Invalid _thumbnailWidth")
  ),
  _thumbnailTime: or(pipe(readKey("_thumbnailTime"), readNum), () => Date.now())
});

const popupDataParser = parseStrict<Record<string, unknown>, Block>({
  blockId: pipe(readKey("blockId"), readStr, throwOnNullish("Invalid blockId")),
  type: pipe(readKey("type"), readStr, throwOnNullish("Invalid type")),
  value: readKey("value"),
  meta: optional(mPipe(readKey("meta"), readObj, readMeta))
});

export const readPopups: Reader<Block[]> = (popup: unknown) => {
  try {
    return readWithItemReader(mPipe(readObj, popupDataParser))(popup);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
    return undefined;
  }
};

interface PopupData {
  linkPopup: string;
  linkPopupPopups: Block[];
}

interface OldPopupModel {
  linkPopup: string;
  popups: Block[];
}

export const popupToOldModel = ({
  linkPopup,
  linkPopupPopups
}: PopupData): OldPopupModel => ({
  linkPopup,
  popups: linkPopupPopups
});
