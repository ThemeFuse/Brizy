import { Item } from "./Item";
import { UploadData } from "./UploadData";

// region Add
export interface Add {
  type: "Add";
  payload: Promise<UploadData>[];
}

export const add = (payload: Add["payload"]): Add => ({
  type: "Add",
  payload
});
// endregion

// region Set
interface Set {
  type: "Set";
  payload: Item<number>[];
}

export const set = (payload: Set["payload"]): Set => ({
  type: "Set",
  payload
});
// endregion

// region Remove
export interface Remove {
  type: "Remove";
  payload: number;
}

export const remove = (payload: Remove["payload"]): Remove => ({
  type: "Remove",
  payload
});
// endregion

// region Sort
export interface Sort {
  type: "Sort";
  payload: {
    from: number;
    to: number;
  };
}

export const sort = (payload: Sort["payload"]): Sort => ({
  type: "Sort",
  payload
});
// endregion

// region FetchSuccess
export interface FetchSuccess {
  type: "FetchSuccess";
  payload: {
    id: number;
    data: UploadData;
  };
}

export const fetchSuccess = (
  payload: FetchSuccess["payload"]
): FetchSuccess => ({
  type: "FetchSuccess",
  payload
});
// endregion

// region FetchError
export interface FetchError {
  type: "FetchError";
  payload: {
    id: number;
    message: string;
  };
}

export const fetchError = (payload: FetchError["payload"]): FetchError => ({
  type: "FetchError",
  payload
});
// endregion

export type Actions = Add | Set | Remove | Sort | FetchSuccess | FetchError;
