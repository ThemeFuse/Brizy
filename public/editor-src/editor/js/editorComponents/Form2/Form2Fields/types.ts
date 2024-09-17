import type { ElementModel } from "visual/component/Elements/Types";
import type { MultiStep } from "visual/editorComponents/Form2/types";

export interface Value extends ElementModel {
  labelType: string;
  placeholder: string;
}

export interface Props {
  labelType: string;
  placeholder: string;
  multistep: MultiStep;
  active: boolean;
}
