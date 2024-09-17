import type { ElementModel } from "visual/component/Elements/Types";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { ViewType } from "../Form2Steps/types";
import type { MultiStep } from "../types";
import type { WithClassName } from "visual/types/attributes";

export interface Value extends ElementModel {
  iconName: string;
  iconType: string;
}

export interface Props extends WithClassName {
  renderType: string;
  labelType: string;
  placeholder: boolean;
  multistep: MultiStep;
  viewType: ViewType;
  totalCount: number;
  activeStep: number;
  active: boolean;
  count: number;
  toolbarExtendFields: ToolbarItemType;
  onActiveChange: VoidFunction;
}
