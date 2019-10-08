import React, { Component } from "react";
import { connect } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { updateBlocks } from "visual/redux/actions";

class EditorPage extends Component {
  handlePageChange = ({ items: blocks }, meta) => {
    this.props.reduxDispatch(updateBlocks({ blocks, meta }));
  };

  render() {
    const { Page } = EditorGlobal.getComponents();
    const { reduxState, reduxDispatch } = this.props;
    return (
      <Page
        dbValue={pageDataDraftBlocksSelector(reduxState)}
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
  state.pageBlocks === prevState.pageBlocks &&
  state.currentStyleId === prevState.currentStyleId &&
  state.currentStyle === prevState.currentStyle &&
  state.extraFontStyles === prevState.extraFontStyles &&
  state.fonts === prevState.fonts &&
  state.copiedElement === prevState.copiedElement;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { areStatesEqual }
)(EditorPage);
