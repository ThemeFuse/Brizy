import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import EditorComponent from "../EditorComponent";
import defaultValue from "./defaultValue.json";
import { Value } from "./types";

export class BaseSpacer extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.Spacer {
    return ElementTypes.Spacer;
  }
}
