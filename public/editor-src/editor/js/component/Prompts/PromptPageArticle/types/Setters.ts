import { Layout } from "visual/types/Layout";

//#region SetTitle

export interface SetTitle {
  type: "SetTitle";
  payload: string;
}

export const setTitle = (payload: string): SetTitle => ({
  payload,
  type: "SetTitle"
});
//#endregion

//#region SetLayout
export interface SetLayout {
  type: "SetLayout";
  payload: Layout;
}

export const setLayout = (payload: Layout): SetLayout => ({
  payload,
  type: "SetLayout"
});
//#endregion

//#region SetRules
export interface SetBlog {
  type: "SetBlog";
  payload: string;
}

export const setBlog = (payload: string): SetBlog => ({
  payload,
  type: "SetBlog"
});
//#endregion

export type Setters = SetTitle | SetLayout | SetBlog;
