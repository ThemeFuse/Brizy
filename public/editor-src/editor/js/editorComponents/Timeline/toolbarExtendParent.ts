import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { Value } from "./index";

export const getItems: GetItems<Value> = () => {
  return [
    { id: "horizontalAlign", type: "toggle-dev", disabled: true, choices: [] }
  ];
};
