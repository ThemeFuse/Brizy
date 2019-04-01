import React from "react";
import { connect } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import UIState from "visual/global/UIState";
import HotKeys from "visual/component/HotKeys";
import LeftSidebar from "visual/component/LeftSidebar";
import BottomPanel from "visual/component/BottomPanel";
import Portal from "visual/component/Portal";
import Prompts from "visual/component/Prompts";
import { updatePage } from "visual/redux/actionCreators";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.parentWindowDocument = window.parent.document;
  }

  handlePageChange = pageValue => {
    const updateData = { data: pageValue };

    this.props.reduxDispatch(updatePage(updateData));
  };

  handleKeyDown() {
    UIState.set("prompt", {
      prompt: "key-helper"
    });
  }

  renderPage() {
    const { Page } = EditorGlobal.getComponents();
    const { reduxState, reduxDispatch } = this.props;

    return (
      <Page
        dbValue={reduxState.page.data}
        reduxState={reduxState}
        reduxDispatch={reduxDispatch}
        onChange={this.handlePageChange}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderPage()}
        <Portal node={this.parentWindowDocument.body}>
          <LeftSidebar />
        </Portal>
        <Portal node={this.parentWindowDocument.body}>
          <BottomPanel />
        </Portal>
        <Portal node={this.parentWindowDocument.body}>
          <Prompts />
        </Portal>
        <HotKeys
          keyNames={["ctrl+/", "cmd+/", "right_cmd+/"]}
          id="key-helper-editor"
          onKeyDown={this.handleKeyDown}
        />
      </React.Fragment>
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
  state.page === prevState.page &&
  state.globals === prevState.globals &&
  state.copiedElement === prevState.copiedElement;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual
  }
)(Editor);
