// region SetTitle
import { Layout } from "visual/component/Prompts/common/PromptPage/types";

export interface SetTitle {
  type: "SetTitle";
  payload: string;
}

export const setTitle = (payload: string): SetTitle => ({
  payload,
  type: "SetTitle"
});
// endregion

// region SetLayout
export interface SetLayout {
  type: "SetLayout";
  payload: Layout;
}

export const setLayout = (payload: Layout): SetLayout => ({
  payload,
  type: "SetLayout"
});
// endregion

// region SetIsHomePage
export interface SetIsHomePage {
  type: "SetIsHomePage";
  payload: boolean;
}

export const setIsHomePage = (payload: boolean): SetIsHomePage => ({
  type: "SetIsHomePage",
  payload
});
// endregion

export type Setters = SetTitle | SetLayout | SetIsHomePage;
