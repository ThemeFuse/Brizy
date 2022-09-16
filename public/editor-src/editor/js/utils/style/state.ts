// Style State
import { ElementModel } from "visual/component/Elements/Types";
import { mRead, State } from "visual/utils/stateMode";

export function styleState({ v }: { v: ElementModel; state: State }): string {
  return mRead(v.tabsState);
}
