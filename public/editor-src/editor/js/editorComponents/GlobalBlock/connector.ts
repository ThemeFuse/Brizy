import { connect } from "react-redux";
import {
  defaultFontSelector,
  fontsSelector,
  globalBlocksAssembled2Selector,
  pageSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";

const mapStateToProps = (state: ReduxState) => ({
  globalBlocks: globalBlocksAssembled2Selector(state),
  page: pageSelector(state),
  fonts: fontsSelector(state),
  defaultFont: defaultFontSelector(state)
});

export const connector = connect(mapStateToProps);
