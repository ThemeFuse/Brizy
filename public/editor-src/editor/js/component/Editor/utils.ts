import { ReduxState } from "visual/redux/types";
import { Config } from "visual/global/Config";
import { EditorType } from "./types";
import { isPopup, isStory } from "visual/utils/models";

export const areStatesEqual = (
  state: ReduxState,
  prevState: ReduxState
): boolean => {
  return (
    state.blocksOrder === prevState.blocksOrder &&
    state.blocksData === prevState.blocksData &&
    state.globalBlocks === prevState.globalBlocks &&
    state.fonts === prevState.fonts &&
    state.project.data.font === prevState.project.data.font
  );
};

export function getRenderType(config: Config): EditorType {
  if (isPopup(config)) {
    return "popup";
  }

  if (isStory(config)) {
    return "story";
  }

  return "basic";
}
