import Config from "visual/global/Config";
import { isStory } from "visual/utils/models";
import { State, states as _states } from "visual/utils/stateMode";

export const states: State[] = isStory(Config.getAll())
  ? _states().filter((s) => s !== "hover")
  : _states();
