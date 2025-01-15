import * as GalleryItem from "visual/component/Controls/Gallery/types/Item";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { SizeType } from "visual/global/Config/types/configs/common";
import { WithId } from "visual/types/attributes";
import { getImageUrl } from "visual/utils/image";
import { Image } from "./Image";

// region Thumbnail
export interface Thumbnail<T> extends WithId<T> {
  __type: "thumbnail";
  payload: Image;
}

export const isThumbnail = <T>(v: Item<T>): v is Thumbnail<T> =>
  v.__type === "thumbnail";

export const thumbnail = <T>(id: T, payload: Image): Thumbnail<T> => ({
  id,
  payload,
  __type: "thumbnail"
});
// endregion

// region Loading
export interface Loading<T> extends WithId<T> {
  __type: "loading";
  payload: Promise<Image>;
}

export const isLoading = <T>(v: Item<T>): v is Loading<T> =>
  v.__type === "loading";

export const loading = <T>(id: T, payload: Promise<Image>): Loading<T> => ({
  id,
  payload,
  __type: "loading"
});
// endregion

// region Error
export interface Error<T> extends WithId<T> {
  __type: "error";
  payload: string;
}

export const isError = <T>(v: Item<T>): v is Error<T> => v.__type === "error";

export const error = <T>(id: T, payload: string): Error<T> => ({
  id,
  payload,
  __type: "error"
});
// endregion

export type Item<T> = Thumbnail<T> | Loading<T> | Error<T>;

export const toGalleryItem = <T>(
  item: Item<T>,
  config: ConfigCommon
): GalleryItem.Item<T> => {
  switch (item.__type) {
    case "thumbnail": {
      const url =
        getImageUrl(
          {
            uid: item.payload.uid,
            fileName: item.payload.fileName ?? "",
            sizeType: SizeType.custom,
            crop: { iW: 100, iH: 100, cH: 100, cW: 100, oX: 0, oY: 0 }
          },
          config
        ) ?? "";

      return GalleryItem.thumbnail(item.id, url);
    }
    case "loading":
      return GalleryItem.loading(item.id);
    case "error":
      return GalleryItem.error(item.id, item.payload);
  }
};
