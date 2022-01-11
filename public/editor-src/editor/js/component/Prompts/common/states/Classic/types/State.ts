import { Tabs } from "visual/component/Prompts/common/PromptPage/types";

export interface St {
  activeTab: Tabs;
  error: string | undefined;
}

interface Base<I extends string, T> {
  type: I;
  payload: T;
}

// region Loading
interface LoadingPayload {
  activeTab: Tabs;
}
export type Loading = Base<"Loading", LoadingPayload>;

export const loading = (payload: LoadingPayload): Loading => ({
  payload,
  type: "Loading"
});
// endregion

// region Err
export interface ErrPayload extends LoadingPayload {
  message: string;
}

export type Err = Base<"Err", ErrPayload>;

export const err = (payload: ErrPayload): Err => ({
  type: "Err",
  payload
});
// endregion

// region Ready
export type Ready<T extends St> = Base<"Ready", T>;

export const ready = <T extends St>(payload: T): Ready<T> => ({
  payload,
  type: "Ready"
});
// endregion

// region Saving
export type Saving<T> = Base<"Saving", T>;

export const saving = <T>(payload: T): Saving<T> => ({
  payload,
  type: "Saving"
});
// endregion

// region Canceling
export type Canceling<T> = Base<"Canceling", T>;

export const canceling = <T>(payload: T): Canceling<T> => ({
  payload,
  type: "Canceling"
});
// endregion

// region Canceled
export type Canceled<T> = Base<"Canceled", T>;

export const canceled = <T>(payload: T): Canceled<T> => ({
  payload,
  type: "Canceled"
});
// endregion

export type State<Invalid extends St, Valid> =
  | Loading
  | Err
  | Ready<Invalid>
  | Saving<Valid>
  | Canceling<Invalid>
  | Canceled<Invalid>;
