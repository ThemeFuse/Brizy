import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isStory } from "visual/utils/models";
import { State, states as _states } from "visual/utils/stateMode";

export const getStates = (config: ConfigCommon): State[] =>
  isStory(config) ? _states().filter((s) => s !== "hover") : _states();
