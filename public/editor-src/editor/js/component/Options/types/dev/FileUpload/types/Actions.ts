import { UploadData, Value } from "../types/Value";

export interface Upload {
  type: "Upload";
  payload: File;
}

export const upload = (payload: File): Upload => ({ type: "Upload", payload });

export interface Err {
  type: "Err";
  payload: string;
}

export const err = (payload: string): Err => ({ type: "Err", payload });

export interface Success {
  type: "Success";
  payload: UploadData;
}

export const success = (payload: UploadData): Success => ({
  type: "Success",
  payload
});

export interface Remove {
  type: "Remove";
}

export const remove = (): Remove => ({ type: "Remove" });

export interface Reset {
  type: "Reset";
  payload: Value;
}

export const reset = (payload: Value): Reset => ({ type: "Reset", payload });

export type Actions = Upload | Err | Success | Remove | Reset;
