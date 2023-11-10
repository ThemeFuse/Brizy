import { SizeType } from "visual/global/Config/types/configs/common";
import { getImageUrl, preloadImage } from "visual/utils/image";
import { WithId } from "visual/utils/options/attributes";
import { AddImageData, Image } from "./types/Image";
import { UploadData } from "./types/UploadData";

export const allowedExtensions = ["jpeg", "jpg", "png", "gif", "svg"];

export const maxId = <T extends WithId<number>>(ts: T[]): number =>
  ts.reduce((id, i) => (i.id > id ? i.id : id), 0);

export const toUploadData = (d: AddImageData): Promise<UploadData> => {
  return new Promise((res, rej) => {
    const { uid, fileName = "" } = d;
    const url = getImageUrl({
      uid,
      fileName,
      sizeType: SizeType.custom
    });

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
