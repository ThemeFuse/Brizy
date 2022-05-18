import { WithId } from "visual/utils/options/attributes";

// region Thumbnail
export interface Thumbnail<T> extends WithId<T> {
  __type: "thumbnail";
  payload: string;
}

export const isThumbnail = <T>(v: Item<T>): v is Thumbnail<T> =>
  v.__type === "thumbnail";

export const thumbnail = <T>(id: T, payload: string): Thumbnail<T> => ({
  id,
  payload,
  __type: "thumbnail"
});
// endregion

// region Loading
export interface Loading<T> extends WithId<T> {
  __type: "loading";
}

export const isLoading = <T>(v: Item<T>): v is Loading<T> =>
  v.__type === "loading";

export const loading = <T>(id: T): Loading<T> => ({
  id,
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
