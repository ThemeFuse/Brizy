import {
  ElementModel,
  ElementModelType2,
  ElementProps
} from "visual/component/Elements/Types";
import { ToolbarExtend } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Translation } from "visual/utils/i18n/t";
import { Literal } from "visual/utils/types/Literal";
import { FormInputTypesName } from "./types";
import { Active } from "./types/type";

export interface Props extends ElementProps {
  labelType: "inside" | "outside";
  placeholder: boolean;
  showPlaceholder: boolean;
  className: string;
  selectClassName: string;
  toolbarExtendLabel: ToolbarItemType;
  toolbarExtendSelect: ToolbarExtend;
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
  value: string | null;
  defaultValue: string | null;
  activeRadio: number | null;
  active: Active;
  fileSizeErrorMessage: string;
  fileTypeErrorMessage: string;
  numberMinMessage: string;
  numberMaxMessage: string;
  placeholder?: string;
  label?: string;
}

export interface InputTypeChoice {
  title: string;
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

export interface MatchTypeToNameProps {
  componentType: Literal;
  t: Translation;
}
