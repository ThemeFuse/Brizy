import React from "react";
import _ from "underscore";
import { connect } from "react-redux";
import UIState from "visual/global/UIState";
import RoundPlus from "visual/component/RoundPlus";
import { rolesHOC } from "visual/component/Roles";
import { setDeviceMode } from "visual/redux/actions";
import { t } from "visual/utils/i18n";
import { getBlocksConfig } from "./utils";

const textsByDeviceMode = {
  desktop: {
    title: t("START BUILDING YOUR PAGE"),
    description: t("Press the button above to add blocks")
  },
  tablet: {
    title: "SWITCH TO DESKTOP",
    description: "Switch to desktop to add blocks"
  },
  mobile: {
    title: t("SWITCH TO DESKTOP"),
    description: t("Switch to desktop to add blocks")
  }
};

class FirstBlockAdder extends React.Component {
  static defaultProps = {
    onAddBlocks: _.noop
  };

  handleClick = () => {
    const { deviceMode, blocks, onAddBlocks, dispatch } = this.props;

    if (deviceMode === "desktop") {
      UIState.set("prompt", {
        prompt: "blocks",
        blocksConfig: getBlocksConfig(),
        onAddBlocks
      });
    } else {
      dispatch(setDeviceMode("desktop"));
    }
  };

  render() {
    const { deviceMode } = this.props;
    const { title, description } = textsByDeviceMode[deviceMode];
    const roundPlusProps = {
      icon: deviceMode === "mobile" || deviceMode === "tablet" ? "nc-desktop" : null,
      className: deviceMode === "mobile" || deviceMode === "tablet" ? "floating-action-button--icon" : null
    };

    return (
      <div className="brz-ed-wrap-block-wrap brz-ed-wrap-block-wrap--first">
        <div
          className="brz-ed-wrap-block-empty-page"
          onClick={this.handleClick}
        >
          <div className="brz-ed-wrap-block-empty-page-heading">{title}</div>
          <RoundPlus {...roundPlusProps} />
          <div className="brz-ed-wrap-block-empty-page-heading2">
            {description}
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  deviceMode: state.ui.deviceMode
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default rolesHOC({
  allow: ["admin"],
  component: connect(
    stateToProps,
    mapDispatchToProps
  )(FirstBlockAdder)
});
