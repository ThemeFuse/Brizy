import { IS_STORY } from "visual/utils/models";
import { State, states as _states } from "visual/utils/stateMode";

export const states: State[] = IS_STORY
  ? _states().filter(s => s !== "hover")
  : _states();
