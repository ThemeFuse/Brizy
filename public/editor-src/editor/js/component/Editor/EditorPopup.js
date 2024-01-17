import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Root } from "visual/component/Root";
import Config from "visual/global/Config";
import EditorGlobal from "visual/global/Editor";
import { updateBlocks } from "visual/redux/actions2";
import { pageBlocksSelector } from "visual/redux/selectors";
import { areStatesEqual } from "./utils";

class EditorPopup extends Component {
  componentDidMount() {
    document.body.classList.add("brz-ow-hidden", "brz-height--100vh");
  }

  handlePageChange = ({ items: blocks }, meta) => {
    this.props.reduxDispatch(updateBlocks({ blocks, meta }));
  };

  render() {
    const config = Config.getAll();
    const { backgroundPreviewUrl } = config.ui?.popupSettings ?? {};
    const { PagePopup } = EditorGlobal.getComponents();
    const { reduxState, reduxDispatch } = this.props;
    const items = pageBlocksSelector(reduxState);

    return (
      <Fragment>
        {items.length > 0 && backgroundPreviewUrl && (
          <iframe
            id="brz-ed-home-page"
            src={backgroundPreviewUrl}
            title="popup"
          />
        )}
        <Root type="popup">
          <PagePopup
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
})(EditorPopup);
