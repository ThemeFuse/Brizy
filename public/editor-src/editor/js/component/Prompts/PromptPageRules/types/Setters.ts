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

// region SetRules
export interface SetRules {
  type: "SetRules";
  payload: string[];
}

export const setRules = (payload: string[]): SetRules => ({
  payload,
  type: "SetRules"
});
// endregion

export type Setters = SetTitle | SetLayout | SetRules;
