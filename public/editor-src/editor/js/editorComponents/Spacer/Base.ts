import EditorComponent from "../EditorComponent";
import defaultValue from "./defaultValue.json";
import { Value } from "./types";

export class BaseSpacer extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId() {
    return "Spacer";
  }
}
