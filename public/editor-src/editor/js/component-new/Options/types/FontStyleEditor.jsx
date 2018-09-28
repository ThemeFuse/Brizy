import React from "react";
import classnames from "classnames";
import ScrollPane from "visual/component/ScrollPane";
import Toolbar from "visual/component-new/Toolbar";
import EditorIcon from "visual/component-new/EditorIcon";
import TextEditor from "visual/editorComponents/Text/Editor";
import { hideToolbar } from "visual/component-new/Toolbar/index";
import { getFontById } from "visual/utils/fonts";
import { getWeightChoices } from "visual/utils/fonts";
import { uuid } from "visual/utils/uuid";
import { printf } from "visual/utils/string";
import { t } from "visual/utils/i18n";

class FontStyle extends React.Component {
  static defaultProps = {
    title: "Title",
    fontFamily: "",
    fontSize: 12,
    fontWeight: 300,
    lineHeight: 1,
    letterSpacing: 1,
    mobileFontSize: 12,
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

  handleTabsChange = device => {
    this.setState({ device });
  };

  handleTextChange = text => {
    this.props.onChange("title", text);
  };

  handleDelete = () => {
    hideToolbar();
    this.props.onChange("deleted", true);
  };

  render() {
    const {
      title,
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      mobileFontSize,
      mobileFontWeight,
      mobileLineHeight,
      mobileLetterSpacing,
      showDeleteIcon,
      onChange
    } = this.props;
    const { device, active } = this.state;
    const className = classnames("brz-ed-option__font-style-editor", {
      active
    });
    const sampleStyle = {
      fontFamily: getFontById(fontFamily).family,
      fontWeight: device === "desktop" ? fontWeight : mobileFontWeight
    };
    const getToolbarItems = () => [
      {
        id: "toolbarTypography",
        type: "popover",
        icon: "nc-font",
        size: "large",
        display: "inside",
        onOpenDirect: true,
        options: [
          {
            type: "grid",
            columns: [
              {
                width: 54,
                options: [
                  {
                    id: "fontFamily",
                    label: "Font Family",
                    type: "fontFamily",
                    value: fontFamily,
                    onChange: ({ id }) => onChange("fontFamily", id)
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
                            columns: [
                              {
                                width: 50,
                                options: [
                                  {
                                    id: "fontSize",
                                    label: "Size",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 300,
                                    step: 1,
                                    value: fontSize,
                                    onChange: fontSize =>
                                      onChange("fontSize", fontSize)
                                  },
                                  {
                                    id: "lineHeight",
                                    label: "Line Hgt.",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 10,
                                    step: 0.1,
                                    value: lineHeight,
                                    onChange: lineHeight =>
                                      onChange("lineHeight", lineHeight)
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
                                    choices: getWeightChoices(fontFamily),
                                    value: fontWeight,
                                    onChange: fontWeight =>
                                      onChange("fontWeight", fontWeight)
                                  },
                                  {
                                    id: "letterSpacing",
                                    label: "Letter Spc.",
                                    type: "stepper",
                                    display: "block",
                                    min: -20,
                                    max: 20,
                                    step: 0.5,
                                    value: letterSpacing,
                                    onChange: letterSpacing =>
                                      onChange("letterSpacing", letterSpacing)
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
                            columns: [
                              {
                                width: 50,
                                options: [
                                  {
                                    id: "mobileFontSize",
                                    label: "Size",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    value: mobileFontSize,
                                    onChange: mobileFontSize =>
                                      onChange("mobileFontSize", mobileFontSize)
                                  },
                                  {
                                    id: "mobileLineHeight",
                                    label: "Line Hgt.",
                                    type: "stepper",
                                    display: "block",
                                    min: 1,
                                    max: 10,
                                    step: 0.1,
                                    value: mobileLineHeight,
                                    onChange: mobileLineHeight =>
                                      onChange(
                                        "mobileLineHeight",
                                        mobileLineHeight
                                      )
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
                                    choices: getWeightChoices(fontFamily),
                                    value: mobileFontWeight,
                                    onChange: mobileFontWeight =>
                                      onChange(
                                        "mobileFontWeight",
                                        mobileFontWeight
                                      )
                                  },
                                  {
                                    id: "mobileLetterSpacing",
                                    label: "Letter Spc.",
                                    type: "stepper",
                                    display: "block",
                                    min: -20,
                                    max: 20,
                                    step: 0.5,
                                    value: mobileLetterSpacing,
                                    onChange: mobileLetterSpacing =>
                                      onChange(
                                        "mobileLetterSpacing",
                                        mobileLetterSpacing
                                      )
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
            <EditorIcon icon="nc-remove" />
          </div>
        ) : null}
        <Toolbar
          getItems={getToolbarItems}
          onOpen={this.handleToolbarOpen}
          onClose={this.handleToolbarClose}
        >
          <div className="brz-ed-option__font-style-editor__container">
            <p className="brz-p brz-ed-option__font-style-editor__title">
              <TextEditor value={title} onChange={this.handleTextChange} />
            </p>
            <p
              className="brz-p brz-ed-option__font-style-editor__sample"
              style={sampleStyle}
            >
              It's Easy Brizy
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

  handleChange = (id, type, newValue) => {
    const value = this.props.value.map(
      el => (id === el.id ? { ...el, [`${type}`]: newValue } : el)
    );

    this.props.onChange(value);
  };

  handleAddNew = () => {
    const { value, onChange } = this.props;
    const newFont = {
      ...value[0],
      deletable: "on",
      id: uuid(10),
      title: printf(t("New Style #%s"), value.length)
    };
    const newValue = [...value, newFont];

    onChange(newValue);
  };

  render() {
    const { value } = this.props;
    const items = value
      .filter(el => el.deleted !== true)
      .map(el => (
        <FontStyle
          key={el.id}
          showDeleteIcon={el.deletable === "on"}
          {...el}
          onChange={this.handleChange.bind(null, el.id)}
        />
      ));

    return (
      <div className="brz-ed-option__font-styles">
        <div className="brz-ed-option__font-styles--scroll-pane">
          <ScrollPane
            className="brz-ed-scroll-pane brz-ed-scroll--medium brz-ed-scroll--darker"
            style={{ height: `100%` }}
          >
            {items}
          </ScrollPane>
        </div>
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
