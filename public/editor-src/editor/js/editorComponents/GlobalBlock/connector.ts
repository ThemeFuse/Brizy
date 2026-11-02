import { connect } from "react-redux";
import {
  defaultFontSelector,
  fontsSelector,
  globalBlocksAssembled2Selector,
  menuDataSelector,
  pageSelector
} from "visual/redux/selectors";
import type { ReduxState } from "visual/redux/types";

const mapStateToProps = (state: ReduxState) => ({
  globalBlocks: globalBlocksAssembled2Selector(state),
  page: pageSelector(state),
  fonts: fontsSelector(state),
  defaultFont: defaultFontSelector(state),
  menuData: menuDataSelector(state)
});

export const connector = connect(mapStateToProps);
