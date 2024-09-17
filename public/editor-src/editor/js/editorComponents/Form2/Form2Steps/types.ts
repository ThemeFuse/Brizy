import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { MultiStep } from "../types";
import type { WithClassName } from "visual/types/attributes";

export enum ViewType {
  None = "none",
  Text = "text",
  Icon = "icon",
  Number = "number",
  Progress = "progressBar",
  NumberText = "number-text",
  IconText = "icon-text"
}

export interface Props extends WithClassName {
  viewType: ViewType;
  activeStep: number;
  labelType: string;
  placeholder: boolean;
  multistep: MultiStep;
  toolbarExtendFields: ToolbarItemType;
  onActiveChange: (index: number) => void;
}

export type StylesProps = Pick<Props, "viewType">;
