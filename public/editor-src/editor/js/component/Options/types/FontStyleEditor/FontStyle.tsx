import classnames from "classnames";
import React, { Component, ReactNode } from "react";
import { connect } from "react-redux";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorIcon from "visual/component/EditorIcon";
import Toolbar, { hideToolbar } from "visual/component/Toolbar";
import { setDeviceMode } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import { getFontById } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { NORMAL } from "visual/utils/stateMode";
import { FontStyleProps, FontStyleState, Styles } from "./types";
import { optionValueToModel } from "./utils";

const animateClassName = "brz-ed-option__font-style-editor--animate";
const mapDevice = (device: ReduxState) => ({
  deviceMode: deviceModeSelector(device)
});
const mapDispatch = { setDeviceMode };

const connector = connect(mapDevice, mapDispatch);

class FontStyle extends Component<FontStyleProps, FontStyleState> {
  state: FontStyleState = {
    device: "desktop",
    active: false
  };

  handleToolbarOpen = (): void => {
    this.setState({ active: true });
  };

  handleToolbarClose = (): void => {
    this.setState({ active: false });
  };

  handleTextChange = (text: string): void => {
    this.props.onChange({ title: text });
  };

  handleDelete = (): void => {
    hideToolbar();
    this.props.onChange({ deleted: true });
  };

  dvv = (key: string, device: DeviceMode) => {
    const v = this.props;

    return defaultValueValue({ v, key, device, state: NORMAL });
  };

  getSampleStyle(): React.CSSProperties {
    const { deviceMode, fontFamily, fontFamilyType } = this.props;

    const _fontWeight = this.dvv("fontWeight", deviceMode);

    const sampleStyle = {
      fontFamily: getFontById({ family: fontFamily, type: fontFamilyType })
        .family,
      fontWeight: _fontWeight
    };

    return sampleStyle;
  }

  fontStyleData() {
    const { fontFamily, fontFamilyType, deviceMode } = this.props;

    return {
      fontFamily,
      fontFamilyType,
      fontSizeSuffix: this.dvv("fontSizeSuffix", deviceMode),
      fontSize: this.dvv("fontSize", deviceMode),
      fontWeight: this.dvv("fontWeight", deviceMode),
      lineHeight: this.dvv("lineHeight", deviceMode),
      letterSpacing: this.dvv("letterSpacing", deviceMode),
      variableFontWeight: this.dvv("variableFontWeight", deviceMode) ?? 400,
      fontWidth: this.dvv("fontWidth", deviceMode) ?? 100,
      fontSoftness: this.dvv("fontSoftness", deviceMode) ?? 0
    };
  }

  render(): ReactNode {
    const {
      title,
      showDeleteIcon,
      deletable,
      onChange,
      itemIndex,
      animationCounter,
      deviceMode
    } = this.props;
    const { active } = this.state;

    const className = classnames("brz-ed-option__font-style-editor", {
      active,
      [`${animateClassName}`]: animationCounter !== 0
    });

    const preparedData = this.fontStyleData();

    const getToolbarItems = () => [
      {
        id: "toolbarTypography",
        type: "popover",
        icon: "nc-font",
        size: "large",
        display: "inside",
        config: {
          onOpenDirect: true
        },
        options: [
          {
            id: "",
            type: "typography",
            config: {
              icons: ["nc-desktop", "nc-tablet", "nc-phone"]
            },
            value: preparedData,
            onChange: (value: Styles) => {
              onChange(optionValueToModel(value, deviceMode));
            }
          }
        ]
      }
    ];

    const sampleStyle = this.getSampleStyle();

    const style = { animationDelay: `${0.2 * itemIndex}s` };

    return (
      <div className={className} style={style}>
        {showDeleteIcon ? (
          <div
            className="brz-ed-option__font-style-editor--delete"
            onClick={this.handleDelete}
          >
            <EditorIcon icon="nc-trash" />
          </div>
        ) : null}
        <Toolbar
          // @ts-expect-error: toolbar used old options
          getItems={getToolbarItems}
          onOpen={this.handleToolbarOpen}
          onClose={this.handleToolbarClose}
        >
          <div className="brz-ed-option__font-style-editor__container">
            <p className="brz-p brz-ed-option__font-style-editor__title">
              {deletable === "on" ? (
                <TextEditor value={title} onChange={this.handleTextChange} />
              ) : (
                title
              )}
            </p>
            <p
              className="brz-p brz-ed-option__font-style-editor__sample"
              style={sampleStyle}
            >
              {t("It's a sample")}
            </p>
          </div>
        </Toolbar>
      </div>
    );
  }
}

export const FontStyleItems = connector(FontStyle);
