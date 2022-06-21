import { ReduxState } from "visual/redux/types";

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
