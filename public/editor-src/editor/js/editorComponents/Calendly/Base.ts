import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import EditorComponent from "../EditorComponent";
import defaultValue from "./defaultValue.json";
import { Props, Value } from "./types";

export class BaseCalendly extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.Calendly {
    return ElementTypes.Calendly;
  }
}
