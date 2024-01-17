import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { Props, Value } from "./index";

export const getItems: GetItems<Value, Props> = () => {
  return [
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] }
  ];
};
