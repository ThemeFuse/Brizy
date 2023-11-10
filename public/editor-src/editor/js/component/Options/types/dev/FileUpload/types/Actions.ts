import { Value } from "../types/Value";
import { WithValue } from "./Value";

export interface Upload {
  type: "Upload";
}

export const upload = (): Upload => ({
  type: "Upload"
});

export interface Err {
  type: "Err";
  payload: string;
}

export const errPayload = (payload: string): Err => ({ type: "Err", payload });

export interface Success {
  type: "Success";
  payload: WithValue;
}

export const success = (payload: WithValue): Success => ({
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
