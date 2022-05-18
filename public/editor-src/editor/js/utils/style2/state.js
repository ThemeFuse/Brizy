// Style State
import { mRead } from "visual/utils/stateMode";

export function styleState({ v }) {
  return mRead(v.tabsState);
}
