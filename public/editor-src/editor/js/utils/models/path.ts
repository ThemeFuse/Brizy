import { ElementModel } from "visual/component/Elements/Types";
import { isModel } from "visual/utils/models";
import { findDeep } from "visual/utils/object";

// This function create a full path from [uid of element]
// To ["items", 0, "value"] to element
export const createFullModelPath = (
  model: ElementModel,
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
