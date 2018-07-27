import React from "react";
import _ from "underscore";
import { connect } from "react-redux";
import UIState from "visual/global/UIState";
import RoundPlus from "visual/component-new/RoundPlus";
import { rolesHOC } from "visual/component-new/Roles";
import { setDeviceMode } from "visual/redux/actionCreators";
import { t } from "visual/utils/i18n";

const textsByDeviceMode = {
  desktop: {
    title: t("START BUILDING YOUR PAGE"),
    description: t("Press the button above to add blocks")
  },
  mobile: {
    title: t("SWITCH TO DESKTOP"),
    description: t("Switch to desktop to add blocks")
  }
};

class FirstBlockAdder extends React.Component {
  static defaultProps = {
    onAddBlock: _.noop
  };

  handleClick = () => {
    const { deviceMode, blocks, onAddBlock, dispatch } = this.props;

    if (deviceMode === "desktop") {
      UIState.set("prompt", {
        prompt: "blocks",
        onAddBlock
      });
    } else {
      dispatch(setDeviceMode("desktop"));
    }
  };

  render() {
    const { deviceMode } = this.props;
    const { title, description } = textsByDeviceMode[deviceMode];
    const roundPlusProps = {
      icon: deviceMode === "mobile" ? "nc-desktop" : null,
      className: deviceMode === "mobile" ? "floating-action-button--icon" : null
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
  component: connect(stateToProps, mapDispatchToProps)(FirstBlockAdder)
});
