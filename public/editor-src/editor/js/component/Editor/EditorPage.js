import React, { Component } from "react";
import { connect } from "react-redux";
import { DraggableOverlay } from "visual/component/DraggableOverlay";
import { Root } from "visual/component/Root";
import EditorGlobal from "visual/global/Editor";
import { updateBlocks } from "visual/redux/actions2";
import { pageDataDraftBlocksSelector } from "visual/redux/selectors";
import { areStatesEqual } from "./utils";

class EditorPage extends Component {
  handlePageChange = ({ items: blocks }, meta) => {
    this.props.reduxDispatch(updateBlocks({ blocks, meta }));
  };

  render() {
    const { Page } = EditorGlobal.getComponents();
    const { reduxState, reduxDispatch } = this.props;
    const pageData = pageDataDraftBlocksSelector(reduxState);

    return (
      <Root>
        <Page
          dbValue={pageData}
          reduxState={reduxState}
          reduxDispatch={reduxDispatch}
          onChange={this.handlePageChange}
        />
        <DraggableOverlay />
      </Root>
    );
  }
}

const mapStateToProps = (state) => ({
  reduxState: state
});
const mapDispatchToProps = (dispatch) => ({
  reduxDispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual
})(EditorPage);
