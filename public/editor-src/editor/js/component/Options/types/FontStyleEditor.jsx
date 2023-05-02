import classnames from "classnames";
import React from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import Toolbar, { hideToolbar } from "visual/component/Toolbar";
import Config from "visual/global/Config";
import { getFontById } from "visual/utils/fonts";
import { getWeightChoices } from "visual/utils/fonts";
import { getSuffixChoices } from "visual/utils/fonts/SizeSuffix";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { printf } from "visual/utils/string";
import { uuid } from "visual/utils/uuid";

class FontStyle extends React.Component {
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

  state = {
    device: "desktop",
    active: false
  };

  handleToolbarOpen = () => {
    this.setState({ active: true });
  };

  handleToolbarClose = () => {
    this.setState({ active: false });
  };

  handleTabsChange = (device) => {
    this.setState({ device });
  };

  handleTextChange = (text) => {
    this.props.onChange({ title: text });
  };

  handleDelete = () => {
    hideToolbar();
    this.props.onChange({ deleted: true });
  };

  render() {
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
      onChange
    } = this.props;
    const { device, active } = this.state;
    const className = classnames("brz-ed-option__font-style-editor", {
      active
    });
    const sampleStyle = {
      fontFamily: getFontById({ family: fontFamily, type: fontFamilyType })
        .family,
      fontWeight:
        device === "desktop"
          ? fontWeight
          : device === "tablet"
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
                    onChange: ({ id, type }) =>
                      onChange({ fontFamily: id, fontFamilyType: type })
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
                                options: [
                                  {
                                    id: "fontSizeSuffix",
                                    type: "select",
                                    label: "Size",
                                    className: "brz-control__typography-suffix",
                                    disabled: IS_STORY,
                                    choices: getSuffixChoices,
                                    value: fontSizeSuffix,
                                    onChange: (fontSizeSuffix) =>
                                      onChange({ fontSizeSuffix })
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
                                    onChange: (fontSize) =>
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
                                    onChange: (lineHeight) =>
                                      onChange({ lineHeight })
                                  }
                                ]
                              },
                              {
                                width: 50,
                                options: [
                                  {
                                    id: "fontWeight",
                                    label: "Weight",
                                    type: "select",
                                    display: "block",
                                    choices: getWeightChoices({
                                      family: fontFamily,
                                      type: fontFamilyType
                                    }),
                                    value: fontWeight,
                                    onChange: (fontWeight) =>
                                      onChange({ fontWeight })
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
                                    onChange: (letterSpacing) =>
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
                                options: [
                                  {
                                    id: "tabletFontSizeSuffix",
                                    type: "select",
                                    label: "Size",
                                    className: "brz-control__typography-suffix",
                                    choices: getSuffixChoices,
                                    value: tabletFontSizeSuffix,
                                    onChange: (tabletFontSizeSuffix) =>
                                      onChange({ tabletFontSizeSuffix })
                                  },
                                  {
                                    id: "tabletFontSize",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 300,
                                    step: 1,
                                    value: tabletFontSize,
                                    onChange: (tabletFontSize) =>
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
                                    onChange: (tabletLineHeight) =>
                                      onChange({ tabletLineHeight })
                                  }
                                ]
                              },
                              {
                                width: 50,
                                options: [
                                  {
                                    id: "tabletFontWeight",
                                    label: "Weight",
                                    type: "select",
                                    display: "block",
                                    choices: getWeightChoices({
                                      family: fontFamily,
                                      type: fontFamilyType
                                    }),
                                    value: tabletFontWeight,
                                    onChange: (tabletFontWeight) =>
                                      onChange({ tabletFontWeight })
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
                                    onChange: (tabletLetterSpacing) =>
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
                                options: [
                                  {
                                    id: "mobileFontSizeSuffix",
                                    type: "select",
                                    label: "Size",
                                    className: "brz-control__typography-suffix",
                                    choices: getSuffixChoices,
                                    value: mobileFontSizeSuffix,
                                    onChange: (mobileFontSizeSuffix) =>
                                      onChange({ mobileFontSizeSuffix })
                                  },
                                  {
                                    id: "mobileFontSize",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 300,
                                    step: 1,
                                    value: mobileFontSize,
                                    onChange: (mobileFontSize) =>
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
                                    onChange: (mobileLineHeight) =>
                                      onChange({ mobileLineHeight })
                                  }
                                ]
                              },
                              {
                                width: 50,
                                options: [
                                  {
                                    id: "mobileFontWeight",
                                    label: "Weight",
                                    type: "select",
                                    display: "block",
                                    choices: getWeightChoices({
                                      family: fontFamily,
                                      type: fontFamilyType
                                    }),
                                    value: mobileFontWeight,
                                    onChange: (mobileFontWeight) =>
                                      onChange({ mobileFontWeight })
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
                                    onChange: (mobileLetterSpacing) =>
                                      onChange({ mobileLetterSpacing })
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ],
                    value: device,
                    onChange: this.handleTabsChange
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    return (
      <div className={className}>
        {showDeleteIcon ? (
          <div
            className="brz-ed-option__font-style-editor--delete"
            onClick={this.handleDelete}
          >
            <EditorIcon icon="nc-trash" />
          </div>
        ) : null}
        <Toolbar
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

class FontStyleEditor extends React.Component {
  static defaultProps = {
    value: {}
  };

  handleChange = (id, newValue) => {
    const { value: _value, onChange } = this.props;
    const value = _value.map((el) =>
      id === el.id ? { ...el, ...newValue } : el
    );

    onChange(value);
  };

  handleAddNew = () => {
    const { value, onChange } = this.props;
    const newFont = {
      ...value[0],
      deletable: "on",
      id: uuid(),
      title: printf(t("New Style #%s"), value.length)
    };
    const newValue = [...value, newFont];

    onChange(newValue);
  };

  render() {
    const { value } = this.props;
    const items = value
      .filter((el) => el.deleted !== true)
      .map((el) => (
        <FontStyle
          key={el.id}
          showDeleteIcon={el.deletable === "on"}
          {...el}
          onChange={this.handleChange.bind(null, el.id)}
        />
      ));

    return (
      <div className="brz-ed-option__font-styles">
        <Scrollbar theme="dark">{items}</Scrollbar>
        <div
          className="brz-ed-option__font-styles--add"
          onClick={this.handleAddNew}
        >
          <EditorIcon icon="nc-add" />
          <span className="brz-span">{t("Add New")}</span>
        </div>
      </div>
    );
  }
}

export default FontStyleEditor;
