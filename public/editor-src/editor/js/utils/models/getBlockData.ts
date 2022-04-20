import { findDeep } from "visual/utils/object";
import { Block } from "visual/types";

export const getBlockData = (blocks: Block[], id: string): Block | null => {
  return findDeep(blocks, ({ value }: Block) => value && value._id === id).obj;
};
