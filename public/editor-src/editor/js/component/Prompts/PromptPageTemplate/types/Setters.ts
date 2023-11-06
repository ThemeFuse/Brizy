// region SetTitle
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
  payload: string;
}

export const setLayout = (payload: string): SetLayout => ({
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
