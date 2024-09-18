import {
  ElementProps,
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import { FormInputTypesName } from "./types";
import { Literal } from "visual/utils/types/Literal";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export interface Props extends ElementProps {
  labelType: string;
  placeholder: boolean;
  showPlaceholder: boolean;
  className: string;
  selectClassName: string;
  toolbarExtendLabel: ToolbarItemType;
}

export interface Error {
  fileMaxSizeError?: string;
  fileTypeError?: string;
  minNumError?: string;
  maxNumError?: string;
}

export interface Value extends Omit<ElementModel, "items"> {
  _id: string;
  type: FormInputTypesName;
  items: ElementModelType2[];
  customFieldName: string;
  value: { value: string };
  fileSizeErrorMessage: string;
  fileTypeErrorMessage: string;
  numberMinMessage: string;
  numberMaxMessage: string;
}

export interface InputTypeChoice {
  title: FormInputTypesName;
  value: Literal;
}

export interface InputType {
  componentTitle: FormInputTypesName;
  componentType: Literal;
}

export enum FormInput {
  Text = "Text",
  Email = "Email",
  Number = "Number",
  Paragraph = "Paragraph",
  Select = "Select",
  Radio = "Radio",
  Checkbox = "Checkbox",
  Date = "Date",
  Url = "Url",
  Time = "Time",
  FileUpload = "FileUpload",
  Hidden = "Hidden",
  Tel = "Tel",
  Password = "Password"
}
