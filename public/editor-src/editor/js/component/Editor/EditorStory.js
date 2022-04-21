import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import EditorGlobal from "visual/global/Editor";
import Config from "visual/global/Config";
import { pageBlocksSelector } from "visual/redux/selectors";
import { updateBlocks } from "visual/redux/actions2";

class EditorStory extends Component {
  handlePageChange = ({ items: blocks }, meta) => {
    this.props.reduxDispatch(updateBlocks({ blocks, meta }));
  };

  render() {
    const { PageStory } = EditorGlobal.getComponents();
    const { reduxState, reduxDispatch } = this.props;
    const { pagePreview } = Config.get("urls");

    const items = pageBlocksSelector(reduxState);

    return (
      <Fragment>
        {Boolean(items.length) && (
          <iframe id="brz-ed-home-page" src={pagePreview} />
        )}
        <PageStory
          dbValue={{ items }}
          reduxState={reduxState}
          reduxDispatch={reduxDispatch}
          onChange={this.handlePageChange}
        />
      </Fragment>
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
})(EditorStory);
