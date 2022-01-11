import { Tabs } from "visual/component/Prompts/common/PromptPage/types";

export enum ActionTypes {
  FetchError = "FetchError",
  FetchSuccess = "FetchSuccess",
  Save = "Save",
  SaveError = "SaveError",
  SaveSuccess = "SaveSuccess",
  Cancel = "Cancel",
  Canceled = "Canceled",
  SwitchTab = "SwitchTab"
}

// region FetchError
export interface FetchError {
  type: ActionTypes.FetchError;
}

export const fetchError = (): FetchError => ({ type: ActionTypes.FetchError });
// endregion

// region FetchSuccess
export interface FetchSuccess<T> {
  type: ActionTypes.FetchSuccess;
  payload: T;
}

export const fetchSuccess = <T>(payload: T): FetchSuccess<T> => ({
  type: ActionTypes.FetchSuccess,
  payload
});
// endregion

// region Save

export interface Save {
  type: ActionTypes.Save;
}

export const save = (): Save => ({ type: ActionTypes.Save });
// endregion

// region SaveError
export interface SaveError {
  type: ActionTypes.SaveError;
}

export const saveError = (): SaveError => ({ type: ActionTypes.SaveError });
// endregion

// region SaveSuccess
export interface SaveSuccess {
  type: ActionTypes.SaveSuccess;
}

export const saveSuccess = (): SaveSuccess => ({
  type: ActionTypes.SaveSuccess
});
// endregion

// region SwitchTab
export interface SwitchTab {
  type: ActionTypes.SwitchTab;
  payload: Tabs;
}

export const switchTab = (payload: SwitchTab["payload"]): SwitchTab => ({
  payload,
  type: ActionTypes.SwitchTab
});
// endregion

// region Cancel
export interface Cancel {
  type: ActionTypes.Cancel;
}

export const cancel = (): Cancel => ({
  type: ActionTypes.Cancel
});
// endregion

// region Canceled
export interface Canceled {
  type: ActionTypes.Canceled;
}

export const canceled = (): Canceled => ({
  type: ActionTypes.Canceled
});
// endregion

export type Actions<T> =
  | FetchError
  | FetchSuccess<T>
  | Save
  | SaveError
  | SaveSuccess
  | SwitchTab
  | Cancel
  | Canceled;

export type PublicActions = Save | SwitchTab | Cancel;
