import { VariationId } from "../../../types/Variation";

// region SetQuantity
export interface SetQuantity {
  type: "SetQuantity";
  payload: number;
}

export const setQuantity = (payload: SetQuantity["payload"]): SetQuantity => ({
  type: "SetQuantity",
  payload
});
// endregion

// region SetVariation
export interface SetVariation {
  type: "SetVariation";
  payload: VariationId;
}

export const setVariation = (
  payload: SetVariation["payload"]
): SetVariation => ({
  type: "SetVariation",
  payload
});
// endregion

// region Submit
export interface Submit {
  type: "Submit";
}

export const submit = (): Submit => ({
  type: "Submit"
});
// endregion

// region SubmitErr
export interface SubmitErr {
  type: "SubmitErr";
  payload: {
    code: number;
    message: string;
  };
}

export const submitErr = (payload: SubmitErr["payload"]): SubmitErr => ({
  type: "SubmitErr",
  payload
});
// endregion

// region SubmitSuccess
export interface SubmitSuccess {
  type: "SubmitSuccess";
}

export const submitSuccess = (): SubmitSuccess => ({
  type: "SubmitSuccess"
});
// endregion

export type Actions =
  | SetQuantity
  | SetVariation
  | Submit
  | SubmitErr
  | SubmitSuccess;
