import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import EditorComponent from "../EditorComponent";
import defaultValue from "./defaultValue.json";
import type { State, Value } from "./types";

export class BaseEmbedCode extends EditorComponent<
  Value,
  ComponentsMeta,
  State
> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.EmbedCode {
    return ElementTypes.EmbedCode;
  }
}
