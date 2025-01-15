import { mPipe, optional } from "fp-utilities";
import {
  AddImageData,
  Image
} from "visual/component/Options/types/dev/Gallery/types/Image";
import { UploadData } from "visual/component/Options/types/dev/Gallery/types/UploadData";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { SizeType } from "visual/global/Config/types/configs/common";
import { WithId } from "visual/types/attributes";
import { getImageUrl, preloadImage } from "visual/utils/image";
import { prop } from "visual/utils/object/get";
import * as Num from "visual/utils/reader/number";
import { readWithParser } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/reader/string";

export const allowedExtensions = ["jpeg", "jpg", "png", "gif", "svg", "webp"];

export const maxId = <T extends WithId<number>>(ts: T[]): number =>
  ts.reduce((id, i) => (i.id > id ? i.id : id), 0);

export const toUploadData = (
  d: AddImageData,
  config: ConfigCommon
): Promise<UploadData> => {
  return new Promise((res, rej) => {
    const { uid, fileName = "" } = d;
    const url = getImageUrl(
      {
        uid,
        fileName,
        sizeType: SizeType.custom
      },
      config
    );

    preloadImage(url)
      .then(({ width, height }) => {
        res({ uid, fileName, width, height });
      })
      .catch(rej);
  });
};

export const toInitialStructure = (
  v: {
    id: number;
    payload: Image;
  }[]
): Image[] =>
  v.map(({ id, payload }) => ({
    id,
    ...payload
  }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromRecord = readWithParser<Record<any, any>, Image>({
  uid: mPipe(prop("uid"), Str.read),
  fileName: optional(mPipe(prop("fileName"), Str.read)),
  width: mPipe(prop("width"), Num.read),
  height: mPipe(prop("height"), Num.read)
});
