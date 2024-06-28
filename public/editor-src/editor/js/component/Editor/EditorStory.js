import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Root } from "visual/component/Root";
import Config from "visual/global/Config";
import EditorGlobal from "visual/global/Editor";
import { updateBlocks } from "visual/redux/actions2";
import { pageBlocksSelector } from "visual/redux/selectors";
import { areStatesEqual } from "./utils";

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
        {items.length > 0 && (
          <iframe id="brz-ed-home-page" src={pagePreview} title="story" />
        )}
        <Root type="story">
          <PageStory
            dbValue={{ items }}
            reduxState={reduxState}
            reduxDispatch={reduxDispatch}
            onChange={this.handlePageChange}
          />
        </Root>
      </Fragment>
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
})(EditorStory);
