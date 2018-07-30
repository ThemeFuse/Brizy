import _ from "underscore";
import { getFontById } from "visual/utils/fonts";
import { hexToRgba } from "visual/utils/color";
import { getWeight, getWeightChoices, getFontStyle } from "visual/utils/fonts";
import { formatStringFromLink } from "./utils/link";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";

const getBlockTag = value => {
  switch (value) {
    case "p":
      return {
        pre: false,
        header: null
      };
    case "pre":
      return {
        header: false,
        pre: value
      };
    default:
      return {
        pre: false,
        header: value
      };
  }
};

const getColorValue = ({ hex, opacity }) => hexToRgba(hex, opacity);

const getColor = ({ hex, opacity, isChanged }) => {
  if (isChanged === "hex") {
    return {
      color: hex,
      colorPalette: null
    };
  }

  return {
    opacity
  };
};

const getcolorPalette = value => {
  return {
    color: null,
    colorPalette: value
  };
};

const getFont = (value, settings) => {
  return {
    font: String(value),
    desktopWeight: String(getWeight(settings.weight, value))
  };
};

const getDesktopFontStyles = (fontStyle, value) => {
  if (!fontStyle) {
    return value;
  }

  const { fontStyles } = getStore().getState().styles;
  const styles = fontStyles.find(item => item.id === fontStyle);

  return {
    desktopHeight: String(styles.lineHeight).replace(".", "_"),
    intermediateHeight: String(styles.mobileLineHeight).replace(".", "_"),
    desktopSize: String(styles.fontSize),
    intermediateSize: String(styles.mobileFontSize),
    desktopLetterSpacing: String(styles.letterSpacing)
      .replace(".", "_")
      .replace("-", "m_"),
    intermediateLetterSpacing: String(styles.mobileLetterSpacing)
      .replace(".", "_")
      .replace("-", "m_"),
    font: String(styles.fontFamily),
    desktopWeight: String(styles.fontWeight),
    intermediateWeight: String(styles.mobileFontWeight),
    fontStyle: null,
    ...value
  };
};

const calcIntermediateStyle = (
  oldValue,
  value,
  intermediateValue,
  { toDec = false, min = 1, max = 100 }
) => {
  const round = number => Math.round(number * 10) / 10;
  const newValue =
    Number(intermediateValue) + (Number(value) - Number(oldValue));
  const roundedValue = toDec ? round(newValue) : Math.round(newValue);

  return Math.min(Math.max(min, roundedValue), max);
};

const MIN_SIZE = 6;
const MAX_SIZE = 99;

const MIN_HEIGHT = 1;
const MAX_HEIGHT = 5;

const MIN_LETTER_SPACING = -5;
const MAX_LETTER_SPACING = 15;

export default (v, onChange) => ({
  getItemsForDesktop: getItemsForDesktop(v, onChange),
  getItemsForMobile: getItemsForMobile(v, onChange)
});

const getItemsForDesktop = (
  {
    horizontalAlign,
    bold,
    color,
    colorPalette,
    tagName,
    font,
    fontStyle,
    height,
    intermediateHeight,
    mobileHeight,
    italic,
    list,
    linkExternalRel,
    letterSpacing,
    intermediateLetterSpacing,
    mobileLetterSpacing,
    size,
    intermediateSize,
    mobileSize,
    weight,
    intermediateWeight,
    mobileWeight,
    linkAnchor,
    linkExternal,
    linkExternalBlank,
    linkType,
    marginTop,
    marginBottom
  },
  onChange
) => () => [
  {
    id: "toolbarFont",
    type: "popover",
    icon: "nc-font",
    size: "large",
    title: t("Typography"),
    roles: ["admin"],
    position: 10,
    options: [
      {
        type: "grid",
        columns: [
          {
            width: 54,
            options: [
              {
                id: "font",
                type: "fontFamily",
                value: font,
                onChange: ({ id }) => {
                  const mewFont = getDesktopFontStyles(
                    fontStyle,
                    getFont(id, { font, weight })
                  );

                  let newWeight = {};
                  if (!mobileWeight) {
                    newWeight = {
                      intermediateWeight: mewFont.desktopWeight
                    };
                  }

                  onChange({
                    ...mewFont,
                    ...newWeight
                  });
                }
              }
            ]
          },
          {
            width: 46,
            className: "brz-ed-popover__typography",
            options: [
              {
                type: "grid",
                columns: [
                  {
                    width: "100",
                    options: [
                      {
                        id: "fontStyle",
                        type: "fontStyle",
                        label: t("Typography"),
                        className: "brz-ed-popover__font-style",
                        display: "block",
                        value: fontStyle,
                        onChange: value => {
                          if (!value) {
                            onChange(getDesktopFontStyles(fontStyle, {}));

                            return;
                          }

                          onChange({
                            fontStyle: value.toLowerCase(),
                            font: null,
                            desktopSize: null,
                            desktopHeight: null,
                            desktopWeight: null,
                            desktopLetterSpacing: null,
                            intermediateSize: null,
                            intermediateHeight: null,
                            intermediateLetterSpacing: null,
                            intermediateWeight: null
                          });
                        }
                      }
                    ]
                  }
                ]
              },
              {
                type: "grid",
                columns: [
                  {
                    width: 50,
                    options: [
                      {
                        id: "size",
                        label: t("Size"),
                        type: "stepper",
                        display: "block",
                        min: MIN_SIZE,
                        max: MAX_SIZE,
                        step: 1,
                        value: size,
                        onChange: value => {
                          const styles = getDesktopFontStyles(fontStyle, {
                            desktopSize: String(value)
                          });

                          let newSize = {
                            intermediateSize: null
                          };
                          if (!mobileSize) {
                            intermediateSize =
                              intermediateSize || styles.intermediateSize;

                            newSize = {
                              intermediateSize: calcIntermediateStyle(
                                size,
                                value,
                                intermediateSize,
                                {
                                  min: MIN_SIZE,
                                  max: MAX_SIZE
                                }
                              )
                            };
                          }

                          onChange({
                            ...styles,
                            ...newSize
                          });
                        }
                      },
                      {
                        id: "height",
                        label: t("Line Hgt."),
                        type: "stepper",
                        display: "block",
                        min: MIN_HEIGHT,
                        max: MAX_HEIGHT,
                        step: 0.1,
                        value: height,
                        onChange: value => {
                          const styles = getDesktopFontStyles(fontStyle, {
                            desktopHeight: String(value).replace(".", "_")
                          });

                          let newHeight = {
                            intermediateHeight: null
                          };
                          if (!mobileHeight) {
                            intermediateHeight =
                              intermediateHeight || styles.intermediateHeight;

                            newHeight = {
                              intermediateHeight: String(
                                calcIntermediateStyle(
                                  height,
                                  value,
                                  intermediateHeight.replace("_", "."),
                                  {
                                    toDec: true,
                                    min: MIN_HEIGHT,
                                    max: MAX_HEIGHT
                                  }
                                )
                              ).replace(".", "_")
                            };
                          }

                          onChange({
                            ...styles,
                            ...newHeight
                          });
                        }
                      }
                    ]
                  },
                  {
                    width: 50,
                    options: [
                      {
                        id: "weight",
                        label: t("Weight"),
                        type: "select",
                        display: "block",
                        choices: getWeightChoices(font).map(item => ({
                          ...item,
                          value: String(item.value)
                        })),
                        value: String(weight),
                        onChange: desktopWeight => {
                          let newWeight = {
                            intermediateWeight: null
                          };

                          if (!mobileWeight) {
                            newWeight = {
                              intermediateWeight: desktopWeight
                            };
                          }

                          onChange(
                            getDesktopFontStyles(fontStyle, {
                              desktopWeight,
                              ...newWeight
                            })
                          );
                        }
                      },
                      {
                        id: "letterSpacing",
                        label: t("Letter Spc."),
                        type: "stepper",
                        display: "block",
                        min: MIN_LETTER_SPACING,
                        max: MAX_LETTER_SPACING,
                        step: 0.5,
                        value: letterSpacing,
                        onChange: value => {
                          const toNumber = value =>
                            Number(
                              String(value)
                                .replace("m_", "-")
                                .replace("_", ".")
                            );
                          const toString = value =>
                            String(value)
                              .replace(".", "_")
                              .replace("-", "m_");

                          const styles = getDesktopFontStyles(fontStyle, {
                            desktopLetterSpacing: toString(value)
                          });

                          let newLetterSpacing = {
                            intermediateLetterSpacing: null
                          };

                          if (!mobileLetterSpacing) {
                            intermediateLetterSpacing =
                              intermediateLetterSpacing ||
                              styles.intermediateLetterSpacing;
                            const newNumberLetterSpacing = calcIntermediateStyle(
                              letterSpacing,
                              value,
                              toNumber(intermediateLetterSpacing),
                              {
                                min: MIN_LETTER_SPACING,
                                max: MAX_LETTER_SPACING
                              }
                            );
                            newLetterSpacing = {
                              intermediateLetterSpacing: toString(
                                newNumberLetterSpacing
                              )
                            };
                          }

                          onChange({
                            ...styles,
                            ...newLetterSpacing
                          });
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "toolbarColor",
    type: "popover",
    size: "auto",
    title: t("Colors"),
    roles: ["admin"],
    position: 20,
    icon: {
      style: {
        backgroundColor: getColorValue(color)
      }
    },
    options: [
      {
        id: "color",
        type: "colorPicker",
        position: 10,
        value: color,
        onChange: value => onChange(getColor(value))
      },
      {
        id: "bgColorFields",
        type: "colorFields",
        position: 30,
        value: {
          ...color
        },
        onChange: value => onChange(getColor(value))
      },
      {
        id: "bgColorPalette",
        type: "colorPalette",
        position: 20,
        value: colorPalette,
        onChange: value => onChange(getcolorPalette(value))
      }
    ]
  },
  {
    id: "horizontalAlign",
    label: t("Align"),
    type: "toggle",
    position: 30,
    choices: [
      {
        icon: "nc-text-align-left",
        title: t("Align"),
        value: "left"
      },
      {
        icon: "nc-text-align-center",
        title: t("Align"),
        value: "center"
      },
      {
        icon: "nc-text-align-right",
        title: t("Align"),
        value: "right"
      }
    ],
    value: horizontalAlign,
    onChange: value => onChange({ desktopHorizontalAlign: String(value) })
  },
  {
    id: "list",
    type: "toggle",
    position: 40,
    choices: [
      {
        icon: "nc-list-numbers",
        title: t("List"),
        value: "ordered"
      },
      {
        icon: "nc-list-bullet",
        title: t("List"),
        value: "bullet"
      },
      {
        icon: "nc-list-default",
        title: t("List"),
        value: null
      }
    ],
    value: list,
    onChange: list => onChange({ list })
  },
  {
    id: "bold",
    type: "button",
    icon: "nc-bold",
    title: t("Bold"),
    position: 50,
    value: bold,
    onChange: bold => onChange({ bold })
  },
  {
    id: "italic",
    type: "button",
    icon: "nc-italic",
    title: t("Italic"),
    position: 60,
    value: italic,
    onChange: italic => onChange({ italic })
  },
  {
    id: "toolbarLink",
    type: "popover",
    icon: "nc-link",
    size: "medium",
    title: t("Link"),
    position: 80,
    options: [
      {
        id: "linkType",
        type: "tabs",
        value: linkType,
        tabs: [
          {
            id: "anchor",
            label: t("Anchor"),
            options: [
              {
                id: "linkAnchor",
                label: t("Anchor"),
                type: "blockThumbnail",
                value: linkAnchor,
                onChange: linkAnchor =>
                  onChange({
                    link: formatStringFromLink(linkType, {
                      anchor: linkAnchor ? `#${linkAnchor}` : "",
                      external: linkExternal,
                      externalBlank: linkExternalBlank,
                      externalRel: linkExternalRel
                    })
                  })
              }
            ]
          },
          {
            id: "external",
            label: t("URL"),
            options: [
              {
                id: "linkExternal",
                type: "input",
                label: t("Link to"),
                placeholder: "http://",
                value: linkExternal,
                onChange: linkExternal =>
                  onChange({
                    link: formatStringFromLink(linkType, {
                      anchor: linkAnchor ? `#${linkAnchor}` : "",
                      external: linkExternal,
                      externalBlank: linkExternalBlank,
                      externalRel: linkExternalRel
                    })
                  })
              },
              {
                id: "linkExternalBlank",
                type: "switch",
                label: t("Open In New Tab"),
                value: linkExternalBlank,
                onChange: linkExternalBlank =>
                  onChange({
                    link: formatStringFromLink(linkType, {
                      anchor: linkAnchor ? `#${linkAnchor}` : "",
                      external: linkExternal,
                      externalBlank: linkExternalBlank,
                      externalRel: linkExternalRel
                    })
                  })
              },
              {
                id: "linkExternalRel",
                type: "switch",
                label: t("Make it Nofollow"),
                value: linkExternalRel,
                onChange: linkExternalRel =>
                  onChange({
                    link: formatStringFromLink(linkType, {
                      anchor: linkAnchor ? `#${linkAnchor}` : "",
                      external: linkExternal,
                      externalBlank: linkExternalBlank,
                      externalRel: linkExternalRel
                    })
                  })
              }
            ]
          }
        ],
        onChange: linkType =>
          onChange({
            link: formatStringFromLink(linkType, {
              anchor: linkAnchor ? `#${linkAnchor}` : "",
              external: linkExternal,
              externalBlank: linkExternalBlank,
              externalRel: linkExternalRel
            })
          })
      }
    ]
  },
  {
    id: "toolbarSettings",
    type: "popover",
    title: t("Settings"),
    roles: ["admin"],
    position: 110,
    options: [
      {
        id: "marginTop",
        label: t("Gap Above"),
        type: "slider",
        slider: {
          min: 0,
          max: 100
        },
        input: {
          show: true
        },
        suffix: {
          show: true,
          choices: [
            {
              title: "px",
              value: "px"
            }
          ]
        },
        value: {
          value: marginTop
        },
        onChange: ({ value: marginTop }) =>
          onChange({ desktopMarginTop: String(marginTop) })
      },
      {
        id: "marginBottom",
        label: t("Gap Below"),
        type: "slider",
        slider: {
          min: 0,
          max: 100
        },
        input: {
          show: true
        },
        suffix: {
          show: true,
          choices: [
            {
              title: "px",
              value: "px"
            }
          ]
        },
        value: {
          value: marginBottom
        },
        onChange: ({ value: marginBottom }) =>
          onChange({ desktopMarginBottom: String(marginBottom) })
      },
      {
        id: "tag",
        label: t("HTML Tag"),
        type: "select",
        className: "brz-control__select--small",
        choices: [
          {
            title: t("P"),
            value: "p"
          },
          {
            title: t("H1"),
            value: "h1"
          },
          {
            title: t("H2"),
            value: "h2"
          },
          {
            title: t("H3"),
            value: "h3"
          },
          {
            title: t("H4"),
            value: "h4"
          },
          {
            title: t("H5"),
            value: "h5"
          },
          {
            title: t("H6"),
            value: "h6"
          },
          {
            title: t("PRE"),
            value: "pre"
          }
        ],
        onChange: tagName => onChange(getBlockTag(tagName)),
        value: tagName
      }
    ]
  }
];

export const getItemsForMobile = (
  {
    horizontalAlign,
    font,
    fontStyle,
    height,
    letterSpacing,
    weight,
    size,
    marginTop,
    marginBottom
  },
  onChange
) => () => [
  {
    id: "toolbarFont",
    type: "popover",
    icon: "nc-font",
    title: t("Typography"),
    size: "auto",
    roles: ["admin"],
    position: 20,
    options: [
      {
        type: "grid",
        columns: [
          {
            width: 50,
            className: "brz-ed-popover__typography--mobile",
            options: [
              {
                id: "size",
                label: t("Size"),
                type: "stepper",
                display: "block",
                min: 6,
                max: 99,
                step: 1,
                value: size,
                onChange: value =>
                  onChange({
                    mobileSize: String(value),
                    intermediateSize: null
                  })
              },
              {
                id: "height",
                label: t("Line Hgt."),
                type: "stepper",
                display: "block",
                min: 1,
                max: 5,
                step: 0.1,
                value: height,
                onChange: value =>
                  onChange({
                    mobileHeight: String(value).replace(".", "_"),
                    intermediateHeight: null
                  })
              }
            ]
          },
          {
            width: 50,
            className: "brz-ed-popover__typography--mobile",
            options: [
              {
                id: "weight",
                label: t("Weight"),
                type: "select",
                display: "block",
                choices: getWeightChoices(font).map(item => ({
                  ...item,
                  value: String(item.value)
                })),
                value: String(weight),
                onChange: value =>
                  onChange({
                    mobileWeight: String(value),
                    intermediateWeight: null
                  })
              },
              {
                id: "letterSpacing",
                label: t("Letter Spc."),
                type: "stepper",
                display: "block",
                min: MIN_LETTER_SPACING,
                max: MAX_LETTER_SPACING,
                step: 0.5,
                value: letterSpacing,
                onChange: value =>
                  onChange({
                    mobileLetterSpacing: String(value)
                      .replace(".", "_")
                      .replace("-", "m_"),
                    intermediateLetterSpacing: null
                  })
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "mobileHorizontalAlign",
    label: t("Align"),
    type: "toggle",
    position: 30,
    choices: [
      {
        icon: "nc-text-align-left",
        title: t("Align"),
        value: "left"
      },
      {
        icon: "nc-text-align-center",
        title: t("Align"),
        value: "center"
      },
      {
        icon: "nc-text-align-right",
        title: t("Align"),
        value: "right"
      }
    ],
    value: horizontalAlign,
    onChange: value => onChange({ mobileHorizontalAlign: String(value) })
  },
  {
    id: "mobileToolbarSettings",
    type: "popover",
    title: t("Settings"),
    roles: ["admin"],
    position: 110,
    options: [
      {
        id: "marginTop",
        label: t("Gap Above"),
        type: "slider",
        slider: {
          min: 0,
          max: 100
        },
        input: {
          show: true
        },
        suffix: {
          show: true,
          choices: [
            {
              title: "px",
              value: "px"
            }
          ]
        },
        value: {
          value: marginTop
        },
        onChange: ({ value: marginTop }) =>
          onChange({ mobileMarginTop: String(marginTop) })
      },
      {
        id: "marginBottom",
        label: t("Gap Below"),
        type: "slider",
        slider: {
          min: 0,
          max: 100
        },
        input: {
          show: true
        },
        suffix: {
          show: true,
          choices: [
            {
              title: "px",
              value: "px"
            }
          ]
        },
        value: {
          value: marginBottom
        },
        onChange: ({ value: marginBottom }) =>
          onChange({ mobileMarginBottom: String(marginBottom) })
      }
    ]
  }
];
