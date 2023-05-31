import { WithValue } from "visual/component/Options/types/dev/FileUpload/types/Value";

export interface Empty {
  type: "Empty";
}

export const empty = (): Empty => ({ type: "Empty" });

export interface WithFile {
  type: "WithFile";
  file: WithValue;
}

export const withFile = (file: WithValue): WithFile => ({
  type: "WithFile",
  file
});

export interface Loading {
  type: "Loading";
}

export const loading = (): Loading => ({
  type: "Loading"
});

export interface Err {
  type: "Err";
  message: string;
}

export const err = (message: string): Err => ({ type: "Err", message });

export type State = Empty | WithFile | Loading | Err;
