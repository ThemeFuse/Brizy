// Style State
import type { ElementModel } from "visual/component/Elements/Types";
import { mRead, type State } from "visual/utils/stateMode";

export function styleState({ v }: { v: ElementModel; state: State }): string {
  return mRead(v.tabsState);
}
