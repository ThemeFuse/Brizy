import classnames from "classnames";
import React, { Component, ReactNode } from "react";
import { connect } from "react-redux";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorIcon from "visual/component/EditorIcon";
import Toolbar, { hideToolbar } from "visual/component/Toolbar";
import Config from "visual/global/Config";
import { setDeviceMode } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import { getFontById } from "visual/utils/fonts";
import { getWeightChoices } from "visual/utils/fonts";
import { getSuffixChoices } from "visual/utils/fonts/SizeSuffix";
import { ModelFamilyType } from "visual/utils/fonts/getFontById";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { FontStyleProps, FontStyleState } from "./types";

const animateClassName = "brz-ed-option__font-style-editor--animate";

const mapDevice = (device: ReduxState) => ({
  deviceMode: deviceModeSelector(device)
});
const mapDispatch = { setDeviceMode };

const connector = connect(mapDevice, mapDispatch);

class FontStyle extends Component<FontStyleProps, FontStyleState> {
  static defaultProps = {
    title: "Title",
    fontFamily: "",
    fontSize: 12,
    fontSizeSuffix: "px",
    fontWeight: 300,
    lineHeight: 1,
    letterSpacing: 1,
    tabletFontSize: 12,
    tabletFontSizeSuffix: "px",
    tabletFontWeight: 300,
    tabletLineHeight: 1,
    tabletLetterSpacing: 1,
    mobileFontSize: 12,
    mobileFontSizeSuffix: "px",
    mobileFontWeight: 300,
    mobileLineHeight: 1,
    mobileLetterSpacing: 1,
    showDeleteIcon: false
  };

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

  handleTabsChange = (device: DeviceMode): void => {
    this.props.setDeviceMode(device);
    this.setState({ device });
  };

  handleTextChange = (text: string): void => {
    this.props.onChange({ title: text });
  };

  handleDelete = (): void => {
    hideToolbar();
    this.props.onChange({ deleted: true });
  };

  render(): ReactNode {
    const {
      title,
      fontFamily,
      fontFamilyType,
      fontSize,
      fontSizeSuffix,
      fontWeight,
      lineHeight,
      letterSpacing,
      tabletFontSize,
      tabletFontSizeSuffix,
      tabletFontWeight,
      tabletLineHeight,
      tabletLetterSpacing,
      mobileFontSize,
      mobileFontSizeSuffix,
      mobileFontWeight,
      mobileLineHeight,
      mobileLetterSpacing,
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

    const sampleStyle = {
      fontFamily: getFontById({ family: fontFamily, type: fontFamilyType })
        .family,
      fontWeight:
        deviceMode === "desktop"
          ? fontWeight
          : deviceMode === "tablet"
          ? tabletFontWeight
          : mobileFontWeight
    };
    const IS_STORY = isStory(Config.getAll());

    const getToolbarItems = () => [
      {
        id: "toolbarTypography",
        type: "popover",
        icon: "nc-font",
        size: "xlarge",
        display: "inside",
        onOpenDirect: true,
        options: [
          {
            type: "grid",
            className:
              "brz-ed-grid__typography brz-ed-grid__typography--sidebar",
            columns: [
              {
                width: 54,
                options: [
                  {
                    id: "fontFamily",
                    label: "Font Family",
                    type: "fontFamily",
                    value: fontFamily,
                    onChange: ({
                      id,
                      type
                    }: {
                      id: string;
                      type: ModelFamilyType;
                    }) => onChange({ fontFamily: id, fontFamilyType: type })
                  }
                ]
              },
              {
                width: 46,
                className: "brz-ed-popover__typography",
                options: [
                  {
                    id: "fontDevices",
                    type: "tabs",
                    align: "start",
                    tabsClassName: "brz-ed-control__tabs__editor",
                    tabs: [
                      {
                        id: "desktop",
                        tabIcon: "nc-desktop",
                        options: [
                          {
                            type: "grid",
                            className: "brz-ed-grid__typography",
                            columns: [
                              {
                                width: 50,
                                className:
                                  "brz-ed-grid__typography--globalStyles-col1",
                                options: [
                                  {
                                    id: "fontSizeSuffix",
                                    type: "select-dev",
                                    label: "Size",
                                    className: "brz-control__typography-suffix",
                                    disabled: IS_STORY,
                                    choices: getSuffixChoices,
                                    value: { value: fontSizeSuffix },
                                    onChange: ({ value }: { value: string }) =>
                                      onChange({ fontSizeSuffix: value })
                                  },
                                  {
                                    id: "fontSize",
                                    type: "stepper",
                                    label: IS_STORY ? "Size" : "",
                                    display: "block",
                                    min: 1,
                                    max: 300,
                                    step: 1,
                                    value: fontSize,
                                    onChange: (fontSize: number) =>
                                      onChange({ fontSize })
                                  },
                                  {
                                    id: "lineHeight",
                                    label: "Line Hgt.",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 20,
                                    step: 0.1,
                                    value: lineHeight,
                                    onChange: (lineHeight: number) =>
                                      onChange({ lineHeight })
                                  }
                                ]
                              },
                              {
                                width: 50,
                                className:
                                  "brz-ed-grid__typography--globalStyles-col2",
                                options: [
                                  {
                                    id: "fontWeight",
                                    label: "Weight",
                                    type: "select-dev",
                                    display: "block",
                                    choices: getWeightChoices({
                                      family: fontFamily,
                                      type: fontFamilyType
                                    }),
                                    value: { value: fontWeight },
                                    onChange: ({ value }: { value: number }) =>
                                      onChange({ fontWeight: value })
                                  },
                                  {
                                    id: "letterSpacing",
                                    label: "Letter Sp.",
                                    type: "stepper",
                                    display: "block",
                                    min: -20,
                                    max: 20,
                                    step: 0.1,
                                    value: letterSpacing,
                                    onChange: (letterSpacing: number) =>
                                      onChange({ letterSpacing })
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        id: "tablet",
                        tabIcon: "nc-tablet",
                        options: [
                          {
                            type: "grid",
                            disabled: IS_STORY,
                            className: "brz-ed-grid__typography",
                            columns: [
                              {
                                width: 50,
                                className:
                                  "brz-ed-grid__typography--globalStyles-col1",
                                options: [
                                  {
                                    id: "tabletFontSizeSuffix",
                                    type: "select-dev",
                                    label: "Size",
                                    className: "brz-control__typography-suffix",
                                    choices: getSuffixChoices,
                                    value: { value: tabletFontSizeSuffix },
                                    onChange: ({ value }: { value: string }) =>
                                      onChange({ tabletFontSizeSuffix: value })
                                  },
                                  {
                                    id: "tabletFontSize",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 300,
                                    step: 1,
                                    value: tabletFontSize,
                                    onChange: (tabletFontSize: number) =>
                                      onChange({ tabletFontSize })
                                  },
                                  {
                                    id: "tabletLineHeight",
                                    label: "Line Hgt.",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 20,
                                    step: 0.1,
                                    value: tabletLineHeight,
                                    onChange: (tabletLineHeight: number) =>
                                      onChange({ tabletLineHeight })
                                  }
                                ]
                              },
                              {
                                width: 50,
                                className:
                                  "brz-ed-grid__typography--globalStyles-col2",
                                options: [
                                  {
                                    id: "tabletFontWeight",
                                    label: "Weight",
                                    type: "select-dev",
                                    display: "block",
                                    choices: getWeightChoices({
                                      family: fontFamily,
                                      type: fontFamilyType
                                    }),
                                    value: { value: tabletFontWeight },
                                    onChange: ({ value }: { value: number }) =>
                                      onChange({ tabletFontWeight: value })
                                  },
                                  {
                                    id: "tabletLetterSpacing",
                                    label: "Letter Sp.",
                                    type: "stepper",
                                    display: "block",
                                    min: -20,
                                    max: 20,
                                    step: 0.5,
                                    value: tabletLetterSpacing,
                                    onChange: (tabletLetterSpacing: number) =>
                                      onChange({ tabletLetterSpacing })
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        id: "mobile",
                        tabIcon: "nc-phone",
                        options: [
                          {
                            type: "grid",
                            disabled: IS_STORY,
                            className: "brz-ed-grid__typography",
                            columns: [
                              {
                                width: 50,
                                className:
                                  "brz-ed-grid__typography--globalStyles-col1",
                                options: [
                                  {
                                    id: "mobileFontSizeSuffix",
                                    type: "select-dev",
                                    label: "Size",
                                    className: "brz-control__typography-suffix",
                                    choices: getSuffixChoices,
                                    value: { value: mobileFontSizeSuffix },
                                    onChange: ({ value }: { value: string }) =>
                                      onChange({ mobileFontSizeSuffix: value })
                                  },
                                  {
                                    id: "mobileFontSize",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 300,
                                    step: 1,
                                    value: mobileFontSize,
                                    onChange: (mobileFontSize: number) =>
                                      onChange({ mobileFontSize })
                                  },
                                  {
                                    id: "mobileLineHeight",
                                    label: "Line Hgt.",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 20,
                                    step: 0.1,
                                    value: mobileLineHeight,
                                    onChange: (mobileLineHeight: number) =>
                                      onChange({ mobileLineHeight })
                                  }
                                ]
                              },
                              {
                                width: 50,
                                className:
                                  "brz-ed-grid__typography--globalStyles-col2",
                                options: [
                                  {
                                    id: "mobileFontWeight",
                                    label: "Weight",
                                    type: "select-dev",
                                    display: "block",
                                    choices: getWeightChoices({
                                      family: fontFamily,
                                      type: fontFamilyType
                                    }),
                                    value: { value: mobileFontWeight },
                                    onChange: (data: { value: number }) =>
                                      onChange({
                                        mobileFontWeight: data.value
                                      })
                                  },
                                  {
                                    id: "mobileLetterSpacing",
                                    label: "Letter Sp.",
                                    type: "stepper",
                                    display: "block",
                                    min: -20,
                                    max: 20,
                                    step: 0.5,
                                    value: mobileLetterSpacing,
                                    onChange: (mobileLetterSpacing: number) =>
                                      onChange({ mobileLetterSpacing })
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ],
                    value: deviceMode,
                    onChange: this.handleTabsChange
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

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
