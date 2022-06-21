import { WithId } from "visual/utils/options/attributes";
import { Image } from "./Image";
import { UploadData } from "visual/utils/image/uploadImage";
import * as GalleryItem from "visual/component/Controls/Gallery/types/Item";
import { imageUrl } from "visual/utils/image";

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
  payload: Promise<UploadData>;
}

export const isLoading = <T>(v: Item<T>): v is Loading<T> =>
  v.__type === "loading";

export const loading = <T>(
  id: T,
  payload: Promise<UploadData>
): Loading<T> => ({
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

export const toGalleryItem = <T>(item: Item<T>): GalleryItem.Item<T> => {
  switch (item.__type) {
    case "thumbnail":
      return GalleryItem.thumbnail(
        item.id,
        imageUrl(item.payload.name, { iW: 100, iH: 100 }) ?? ""
      );
    case "loading":
      return GalleryItem.loading(item.id);
    case "error":
      return GalleryItem.error(item.id, item.payload);
  }
};
