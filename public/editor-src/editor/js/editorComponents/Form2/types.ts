import type {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";

export type MultiStep = "on" | "off";

export interface Value extends ElementModel {
  multistep: MultiStep;
  items: ElementModelType2[];
  customCSS: string;
}

export interface State {
  active: number;
}

export interface Errors {
  minNumError?: string;
  maxNumError?: string;
  fileMaxSizeError?: string;
  fileTypeError?: string;
}

export interface DoneResponse {
  success?: boolean;
}

export interface DataValue {
  name: string;
  required: boolean;
  type: string;
  label: string;
  value: string;
  maxSize: number;
  extensions: string;
}

export enum MessageStatus {
  Success = "success",
  Error = "error",
  Empty = "empty"
}

export interface ResponseMessages {
  [MessageStatus.Success]: string;
  [MessageStatus.Error]: string;
  [MessageStatus.Empty]: string;
}

export interface GetFormMessageData {
  status: MessageStatus;
  form: HTMLFormElement | null;
  text?: string;
}

export interface AllFormData {
  data: Partial<DataValue>[];
  formData: FormData;
}

export type BoxResizerParams = () => {
  points: ["centerLeft", "centerRight"];
  restrictions: {
    width: {
      "%": { min: 5; max: 100 };
    };
  };
};
