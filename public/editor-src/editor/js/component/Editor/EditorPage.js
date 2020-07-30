import React, { Component } from "react";
import { connect } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import {
  pageDataDraftBlocksSelector
  // globalBlocksPositionsSelector
} from "visual/redux/selectors";
import { updateBlocks } from "visual/redux/actions2";

class EditorPage extends Component {
  handlePageChange = ({ items: blocks }, meta) => {
    this.props.reduxDispatch(updateBlocks({ blocks, meta }));
  };

  render() {
    const { Page } = EditorGlobal.getComponents();
    const { reduxState, reduxDispatch } = this.props;

    // const positions = globalBlocksPositionsSelector(reduxState);
    const pageData = pageDataDraftBlocksSelector(reduxState);

    // console.clear();
    // console.group();
    // pageData.items.map(({ type, value, blockId }) => {
    //   if (type === "GlobalBlock" && positions[value._id]) {
    //     const { align, top, bottom } = positions[value._id];
    //     const cutGlobalBlockId = value._id.substr(0, 4);
    //     if (align === "top") {
    //       console.log(
    //         `%c${cutGlobalBlockId}...%c align - %c${align}:%c top - %c${top}%c, bottom - ${bottom}`,
    //         "color: #3870ED;",
    //         null,
    //         "color: #bada55;font-weight:bold;",
    //         null,
    //         "color: #bada55;font-weight:bold;",
    //         null
    //       );
    //     } else {
    //       console.log(
    //         `%c${cutGlobalBlockId}...%c align - %c${align}%c: top - ${top}, bottom - %c${bottom}`,
    //         "color: #3870ED;",
    //         null,
    //         "color: #bada55;font-weight:bold;",
    //         null,
    //         "color: #bada55;font-weight:bold;"
    //       );
    //     }
    //   } else {
    //     console.log(`${blockId} - Simple block`);
    //   }
    // });
    // console.groupEnd();

    return (
      <Page
        dbValue={pageData}
        reduxState={reduxState}
        reduxDispatch={reduxDispatch}
        onChange={this.handlePageChange}
      />
    );
  }
}

const mapStateToProps = state => ({
  reduxState: state
});
const mapDispatchToProps = dispatch => ({
  reduxDispatch: dispatch
});

const areStatesEqual = (state, prevState) =>
  state.blocksOrder === prevState.blocksOrder &&
  state.blocksData === prevState.blocksData &&
  state.globalBlocks === prevState.globalBlocks &&
  state.currentStyleId === prevState.currentStyleId &&
  state.currentStyle === prevState.currentStyle &&
  state.extraFontStyles === prevState.extraFontStyles &&
  state.fonts === prevState.fonts &&
  state.copiedElement === prevState.copiedElement;

export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual
})(EditorPage);
