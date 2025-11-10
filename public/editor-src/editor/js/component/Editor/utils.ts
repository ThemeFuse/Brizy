import { Str } from "@brizy/readers";
import { Config, isWp } from "visual/global/Config";
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
    state.project.data.font === prevState.project.data.font &&
    state.symbols === prevState.symbols
  );
};

export const getPageId = (config: Config): string => {
  if (isWp(config)) {
    return Str.read(config.wp?.page) ?? "";
  }

  return Str.read(config.page?.id) ?? "";
};
