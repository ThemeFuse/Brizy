import React, { Component } from "react";
import { connect } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import { pageDataSelector } from "visual/redux/selectors";
import { updatePage } from "visual/redux/actions";

class EditorPage extends Component {
  handlePageChange = (pageValue, meta) => {
    this.props.reduxDispatch(updatePage({ data: pageValue, meta }));
  };

  render() {
    const { Page } = EditorGlobal.getComponents();
    const { reduxState, reduxDispatch } = this.props;

    return (
      <Page
        dbValue={pageDataSelector(reduxState)}
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
  state.page === prevState.page &&
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
