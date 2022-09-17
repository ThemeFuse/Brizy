// Style State
import { ElementModel } from "visual/component/Elements/Types";
import { mRead } from "visual/utils/stateMode";

export function styleState({ v }: { v: ElementModel }): string {
  return mRead(v.tabsState);
}
