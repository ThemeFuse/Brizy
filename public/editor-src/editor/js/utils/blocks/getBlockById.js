import { getStore } from "visual/redux/store";
import { pageBlocksSelector } from "visual/redux/selectors";

export function getBlockById(id) {
  const blocks = pageBlocksSelector(getStore().getState());

  return blocks.find(block => block.value._id === id);
}
