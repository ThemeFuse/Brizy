import React from "react";
import { connect } from "react-redux";
import RoundPlus from "visual/component/RoundPlus";
import Prompts from "visual/component/Prompts";
import { rolesHOC } from "visual/component/Roles";
import { setDeviceMode } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";

const textsByDeviceMode = {
  desktop: {
    title: t("START BUILDING YOUR PAGE"),
    description: t("Press the button above to add blocks")
  },
  tablet: {
    title: t("SWITCH TO DESKTOP"),
    description: t("Switch to desktop to add blocks")
  },
  mobile: {
    title: t("SWITCH TO DESKTOP"),
    description: t("Switch to desktop to add blocks")
  }
};

class FirstBlockAdder extends React.Component {
  handleOpen = () => {
    const { deviceMode, dispatch, onAddBlock, onAddTemplate } = this.props;

    if (deviceMode === "desktop") {
      Prompts.open({
        prompt: "blocks",
        mode: "single",
        props: {
          type: "normal",
          onChangeBlocks: onAddBlock,
          onChangeGlobal: onAddBlock,
          onChangeSaved: onAddTemplate,
          onChangeTemplate: onAddTemplate
        }
      });
    } else {
      dispatch(setDeviceMode("desktop"));
    }
  };

  render() {
    const { deviceMode } = this.props;
    const { title, description } = textsByDeviceMode[deviceMode];
    const roundPlusProps = {
      icon:
        deviceMode === "mobile" || deviceMode === "tablet"
          ? "nc-desktop"
          : null,
      className:
        deviceMode === "mobile" || deviceMode === "tablet"
          ? "floating-action-button--icon"
          : null
    };

    return (
      <div className="brz-ed-wrap-block-wrap brz-ed-wrap-block-wrap--first">
        <div className="brz-ed-wrap-block-empty-page" onClick={this.handleOpen}>
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
  deviceMode: deviceModeSelector(state)
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default rolesHOC({
  allow: ["admin"],
  component: connect(stateToProps, mapDispatchToProps, undefined, {
    forwardRef: true
  })(FirstBlockAdder)
});
