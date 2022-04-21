import { Block } from "visual/types";
import { ElementModel } from "visual/component/Elements/Types";
import { findDeep } from "visual/utils/object";

// This function create a full path from [uid of element]
// To ["items", 0, "value"] to element
export const createFullModelPath = (
  model: ElementModel,
  path: string[]
): string[] => {
  const [uid, ..._path] = path;

  const block = findDeep(
    model,
    ({ value }: Block) => value && value._id === uid
  );

  if (block.path) {
    return [...block.path, "value", ..._path];
  }

  return path;
};
