import React, { Component, ReactElement } from "react";
import { noop } from "underscore";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import RoundPlus from "visual/component/RoundPlus";
import { rolesHOC } from "visual/component/Roles";
import { setDeviceMode, ActionUpdateUI } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import {
  PromptBlock,
  PromptBlockTemplate
} from "visual/component/Prompts/PromptBlocks/types";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";

type TextsDevice = {
  title: string;
  description: string;
};

type FirstPopupBlockAdderProps = {
  deviceMode: DeviceMode;
  onAddBlock: (data: PromptBlock) => void;
  setDeviceMode: (device: DeviceMode) => void;
};

const getDeviceTexts = (device: DeviceMode): TextsDevice => {
  switch (device) {
    case "desktop": {
      return {
        title: t("START BUILDING YOUR POPUP"),
        description: t("Press the button above to add popup")
      };
    }
    case "tablet": {
      return {
        title: t("SWITCH TO DESKTOP"),
        description: t("Switch to desktop to add popup")
      };
    }
    case "mobile": {
      return {
        title: t("SWITCH TO DESKTOP"),
        description: t("Switch to desktop to add popup")
      };
    }
  }
};

class FirstPopupBlockAdder extends Component<FirstPopupBlockAdderProps> {
  static defaultProps: FirstPopupBlockAdderProps = {
    deviceMode: "desktop",
    onAddBlock: noop,
    setDeviceMode: noop
  };

  handleAddSavedBlock = (data: PromptBlockTemplate): void => {
    const { fonts, blocks, extraFontStyles } = data;

    this.props.onAddBlock({
      fonts,
      extraFontStyles,
      block: blocks[0]
    });
  };

  handleOpen = (): void => {
    const { deviceMode, setDeviceMode, onAddBlock } = this.props;

    if (deviceMode === "desktop") {
      const data: PromptsProps = {
        prompt: "blocks",
        mode: "single",
        props: {
          type: "popup",
          showTemplate: false,
          blocksType: false,
          globalSearch: false,
          onChangeBlocks: onAddBlock,
          onChangeGlobal: onAddBlock,
          onChangeSaved: this.handleAddSavedBlock
        }
      };
      Prompts.open(data);
    } else {
      setDeviceMode("desktop");
    }
  };

  render(): ReactElement {
    const { deviceMode } = this.props;
    const { title, description } = getDeviceTexts(deviceMode);
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

const mapStateToProps = (state: ReduxState): { deviceMode: DeviceMode } => ({
  deviceMode: deviceModeSelector(state)
});

const mapDispatchToProps = (
  dispatch: Dispatch
): { setDeviceMode: (d: DeviceMode) => ActionUpdateUI } => ({
  setDeviceMode: (device: DeviceMode): ActionUpdateUI =>
    dispatch(setDeviceMode(device))
});

export default rolesHOC({
  allow: ["admin"],
  component: connect(mapStateToProps, mapDispatchToProps)(FirstPopupBlockAdder),
  fallbackRender: undefined
});
