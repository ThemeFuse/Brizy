import { get } from "es-toolkit/compat";
import { ElementModelType } from "visual/component/Elements/Types";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { checkValue2 } from "visual/utils/checkValue";
import { isModel } from "visual/utils/models";
import { findDeep } from "visual/utils/object";

// This function create a full path from [uid of element]
// To ["items", 0, "value"] to element
export const createFullModelPath = (
  model: ElementModelType,
  path: string[]
): string[] => {
  const [uid, ..._path] = path;

  const block = findDeep(model, (v: unknown) => {
    if (isModel(v)) {
      return v.value._id === uid;
    }
  });

  if (block.path) {
    return [...block.path, "value", ..._path];
  }

  return path;
};

export const getComponentId = (
  component: EditorArrayComponent,
  itemIndex: number
): string | null => {
  const element = component.getDBValue()[itemIndex];

  let elementId = get(element, ["value", "_id"]);

  const type = checkValue2(ElementTypes)(get(element, "type"));

  if (!type) {
    return null;
  }

  if ([ElementTypes.Wrapper, ElementTypes.Cloneable].includes(type)) {
    elementId = get(element, ["value", "items", 0, "value", "_id"]) ?? null;
  }

  return elementId;
};
