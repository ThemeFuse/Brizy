import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import EditorComponent from "../EditorComponent";
import defaultValue from "./defaultValue.json";
import { Value } from "./types";

export class BaseProgressBar extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.ProgressBar {
    return ElementTypes.ProgressBar;
  }
}
