import React, { Component } from "react";
import { connect } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { updateBlocks } from "visual/redux/actions2";

class EditorPage extends Component {
  handlePageChange = ({ items: blocks }, meta) => {
    this.props.reduxDispatch(updateBlocks({ blocks, meta }));
  };

  render() {
    const { Page } = EditorGlobal.getComponents();
    const { reduxState, reduxDispatch } = this.props;
    const pageData = pageDataDraftBlocksSelector(reduxState);

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
  state.fonts === prevState.fonts &&
  state.copiedElement === prevState.copiedElement;

export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual
})(EditorPage);
