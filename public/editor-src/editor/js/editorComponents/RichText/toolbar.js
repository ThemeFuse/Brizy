import Config from "visual/global/Config";
import { hexToRgba } from "visual/utils/color";
import { getWeight, getWeightChoices } from "visual/utils/fonts";
import { getDynamicContentChoices } from "visual/utils/options";
import { formatStringFromLink } from "./utils/link";
import { getFontStyles } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";

const proEnabled = Boolean(Config.get("pro"));

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

const getColorPalette = value => {
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

  const styles = getFontStyles().find(item => item.id === fontStyle);

  return {
    desktopHeight: String(styles.lineHeight).replace(".", "_"),
    intermediateTabletHeight: String(styles.tabletLineHeight).replace(".", "_"),
    intermediateMobileHeight: String(styles.mobileLineHeight).replace(".", "_"),
    desktopSize: String(styles.fontSize),
    intermediateTabletSize: String(styles.tabletFontSize),
    intermediateMobileSize: String(styles.mobileFontSize),
    desktopLetterSpacing: String(styles.letterSpacing)
      .replace(".", "_")
      .replace("-", "m_"),
    intermediateTabletLetterSpacing: String(styles.tabletLetterSpacing)
      .replace(".", "_")
      .replace("-", "m_"),
    intermediateMobileLetterSpacing: String(styles.mobileLetterSpacing)
      .replace(".", "_")
      .replace("-", "m_"),
    font: String(styles.fontFamily),
    desktopWeight: String(styles.fontWeight),
    intermediateTabletWeight: String(styles.tabletFontWeight),
    intermediateMobileWeight: String(styles.mobileFontWeight),
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

const linkDynamicContentChoices = getDynamicContentChoices("link");

const MIN_SIZE = 6;
const MAX_SIZE = 300;

const MIN_HEIGHT = 1;
const MAX_HEIGHT = 5;

const MIN_LETTER_SPACING = -5;
const MAX_LETTER_SPACING = 15;

export default (v, onChange) => ({
  getItemsForDesktop: getItemsForDesktop(v, onChange),
  getItemsForTablet: getItemsForTablet(v, onChange),
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
    intermediateTabletHeight,
    intermediateMobileHeight,
    tabletHeight,
    mobileHeight,
    italic,
    list,
    letterSpacing,
    intermediateTabletLetterSpacing,
    intermediateMobileLetterSpacing,
    tabletLetterSpacing,
    mobileLetterSpacing,
    size,
    intermediateTabletSize,
    intermediateMobileSize,
    tabletSize,
    mobileSize,
    weight,
    intermediateTabletWeight,
    intermediateMobileWeight,
    tabletWeight,
    mobileWeight,
    linkType,
    linkAnchor,
    linkExternal,
    linkExternalBlank,
    linkExternalType,
    linkPopulation,
    linkExternalRel,
    linkPopup,
    marginTop,
    marginBottom
  },
  onChange
) => (v, component) => {
  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
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
                        intermediateTabletWeight: mewFont.desktopWeight,
                        intermediateMobileWeight: mewFont.desktopWeight
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
                              intermediateTabletSize: null,
                              intermediateMobileSize: null,
                              intermediateTabletHeight: null,
                              intermediateMobileHeight: null,
                              intermediateTabletLetterSpacing: null,
                              intermediateMobileLetterSpacing: null,
                              intermediateTabletWeight: null,
                              intermediateMobileWeight: null
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
                              intermediateTabletSize: null,
                              intermediateMobileSize: null
                            };
                            if (!mobileSize) {
                              intermediateMobileSize =
                                intermediateMobileSize ||
                                styles.intermediateMobileSize;

                              newSize.intermediateMobileSize = calcIntermediateStyle(
                                size,
                                value,
                                intermediateMobileSize,
                                {
                                  min: MIN_SIZE,
                                  max: MAX_SIZE
                                }
                              );
                            }
                            if (!tabletSize) {
                              intermediateTabletSize =
                                intermediateTabletSize ||
                                styles.intermediateTabletSize;
                              newSize.intermediateTabletSize = calcIntermediateStyle(
                                size,
                                value,
                                intermediateTabletSize,
                                {
                                  min: MIN_SIZE,
                                  max: MAX_SIZE
                                }
                              );
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
                              intermediateTabletHeight: null,
                              intermediateMobileHeight: null
                            };
                            if (!mobileHeight) {
                              intermediateMobileHeight =
                                intermediateMobileHeight ||
                                styles.intermediateMobileHeight;
                              newHeight.intermediateMobileHeight = String(
                                calcIntermediateStyle(
                                  height,
                                  value,
                                  intermediateMobileHeight.replace("_", "."),
                                  {
                                    toDec: true,
                                    min: MIN_HEIGHT,
                                    max: MAX_HEIGHT
                                  }
                                )
                              ).replace(".", "_");
                            }
                            if (!tabletHeight) {
                              intermediateTabletHeight =
                                intermediateTabletHeight ||
                                styles.intermediateTabletHeight;
                              newHeight.intermediateTabletHeight = String(
                                calcIntermediateStyle(
                                  height,
                                  value,
                                  intermediateTabletHeight.replace("_", "."),
                                  {
                                    toDec: true,
                                    min: MIN_HEIGHT,
                                    max: MAX_HEIGHT
                                  }
                                )
                              ).replace(".", "_");
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
                              intermediateTabletWeight: null,
                              intermediateMobileWeight: null
                            };

                            if (!mobileWeight) {
                              newWeight.intermediateMobileWeight = desktopWeight;
                            }
                            if (!tabletWeight) {
                              newWeight.intermediateTabletWeight = desktopWeight;
                            }

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
                          label: t("Letter Sp."),
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
                              intermediateTabletLetterSpacing: null,
                              intermediateMobileLetterSpacing: null
                            };

                            if (!mobileLetterSpacing) {
                              intermediateMobileLetterSpacing =
                                intermediateMobileLetterSpacing ||
                                styles.intermediateMobileLetterSpacing;
                              const newNumberLetterSpacing = calcIntermediateStyle(
                                letterSpacing,
                                value,
                                toNumber(intermediateMobileLetterSpacing),
                                {
                                  min: MIN_LETTER_SPACING,
                                  max: MAX_LETTER_SPACING
                                }
                              );
                              newLetterSpacing.intermediateMobileLetterSpacing = toString(
                                newNumberLetterSpacing
                              );
                            }

                            if (!tabletLetterSpacing) {
                              intermediateTabletLetterSpacing =
                                intermediateTabletLetterSpacing ||
                                styles.intermediateTabletLetterSpacing;
                              const newNumberLetterSpacing = calcIntermediateStyle(
                                letterSpacing,
                                value,
                                toNumber(intermediateTabletLetterSpacing),
                                {
                                  min: MIN_LETTER_SPACING,
                                  max: MAX_LETTER_SPACING
                                }
                              );
                              newLetterSpacing.intermediateTabletLetterSpacing = toString(
                                newNumberLetterSpacing
                              );
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
          onChange: value => onChange(getColorPalette(value))
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
        },
        {
          icon: "nc-text-align-justify",
          title: t("Align"),
          value: "justify"
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
                        externalRel: linkExternalRel,
                        externalType: linkExternalType,
                        population: linkPopulation,
                        popup: linkPopup ? `#${linkPopup}` : ""
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
                  population: {
                    show: linkDynamicContentChoices.length > 0,
                    choices: linkDynamicContentChoices
                  },
                  value: {
                    value: linkExternal,
                    population: linkPopulation
                  },
                  onChange: ({
                    value: linkExternal,
                    population: linkPopulation,
                    changed
                  }) =>
                    onChange({
                      link: formatStringFromLink(linkType, {
                        anchor: linkAnchor ? `#${linkAnchor}` : "",
                        external: linkExternal,
                        externalBlank: linkExternalBlank,
                        externalRel: linkExternalRel,
                        externalType:
                          changed === "value" ? "external" : "population",
                        population: linkPopulation,
                        popup: linkPopup ? `#${linkPopup}` : ""
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
                        externalRel: linkExternalRel,
                        externalType: linkExternalType,
                        population: linkPopulation,
                        popup: linkPopup ? `#${linkPopup}` : ""
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
                        externalRel: linkExternalRel,
                        externalType: linkExternalType,
                        population: linkPopulation,
                        popup: linkPopup ? `#${linkPopup}` : ""
                      })
                    })
                }
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              disabled: !proEnabled || inPopup,
              options: [
                {
                  id: "linkPopup",
                  type: "promptAddPopup",
                  label: t("Popup"),
                  value: linkPopup,
                  onChange: linkPopup =>
                    onChange({
                      link: formatStringFromLink(linkType, {
                        anchor: linkAnchor ? `#${linkAnchor}` : "",
                        external: linkExternal,
                        externalBlank: linkExternalBlank,
                        externalRel: linkExternalRel,
                        externalType: linkExternalType,
                        population: linkPopulation,
                        popup: linkPopup ? `#${linkPopup}` : ""
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
                externalRel: linkExternalRel,
                externalType: linkExternalType,
                population: linkPopulation,
                popup: linkPopup ? `#${linkPopup}` : ""
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
};

export const getItemsForTablet = (
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
    position: 20,
    options: [
      {
        type: "grid",
        columns: [
          {
            width: 50,
            className: "brz-ed-popover__typography--small",
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
                    tabletSize: String(value),
                    intermediateTabletSize: null
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
                    tabletHeight: String(value).replace(".", "_"),
                    intermediateTabletHeight: null
                  })
              }
            ]
          },
          {
            width: 50,
            className: "brz-ed-popover__typography--small",
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
                    tabletWeight: String(value),
                    intermediateTabletWeight: null
                  })
              },
              {
                id: "letterSpacing",
                label: t("Letter Sp."),
                type: "stepper",
                display: "block",
                min: MIN_LETTER_SPACING,
                max: MAX_LETTER_SPACING,
                step: 0.5,
                value: letterSpacing,
                onChange: value =>
                  onChange({
                    tabletLetterSpacing: String(value)
                      .replace(".", "_")
                      .replace("-", "m_"),
                    intermediateTabletLetterSpacing: null
                  })
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "tabletHorizontalAlign",
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
    onChange: value => onChange({ tabletHorizontalAlign: String(value) })
  },
  {
    id: "tabletToolbarSettings",
    type: "popover",
    title: t("Settings"),
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
          onChange({ tabletMarginTop: String(marginTop) })
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
          onChange({ tabletMarginBottom: String(marginBottom) })
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
            className: "brz-ed-popover__typography--small",
            options: [
              {
                id: "size",
                label: t("Size"),
                type: "stepper",
                display: "block",
                min: 6,
                max: MAX_SIZE,
                step: 1,
                value: size,
                onChange: value =>
                  onChange({
                    mobileSize: String(value),
                    intermediateMobileSize: null
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
                    intermediateMobileHeight: null
                  })
              }
            ]
          },
          {
            width: 50,
            className: "brz-ed-popover__typography--small",
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
                    intermediateMobileWeight: null
                  })
              },
              {
                id: "letterSpacing",
                label: t("Letter Sp."),
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
                    intermediateMobileLetterSpacing: null
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
      },
      {
        icon: "nc-text-align-justify",
        title: t("Align"),
        value: "justify"
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
