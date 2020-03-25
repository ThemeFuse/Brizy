import Config from "visual/global/Config";
import { getWeight } from "visual/utils/fonts";
import { encodeToString, capitalize } from "visual/utils/string";
import { getFontStyles, getFontStyle } from "visual/utils/fonts";
import getColorToolbar from "./color";
import { t } from "visual/utils/i18n";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import {
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2LineHeight,
  toolbarTypography2FontWeight,
  toolbarTypography2LetterSpacing,
  toolbarLinkExternal,
  toolbarLinkExternalBlank,
  toolbarLinkExternalRel,
  toolbarLinkAnchor,
  toolbarLinkPopup,
  toolbarLinkUpload
} from "visual/utils/toolbar";

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

const getFont = (value, settings) => {
  return {
    fontFamily: String(value),
    fontFamilyType: settings.type,
    fontWeight: String(getWeight(settings.fontWeight, settings.weights))
  };
};

const getDesktopFontStyles = (fontStyle, value) => {
  if (!fontStyle) {
    return value;
  }

  const styles = getFontStyles().find(item => item.id === fontStyle);

  return {
    lineHeight: String(styles.lineHeight).replace(".", "_"),
    intermediateTabletLineHeight: String(styles.tabletLineHeight).replace(
      ".",
      "_"
    ),
    intermediateMobileLineHeight: String(styles.mobileLineHeight).replace(
      ".",
      "_"
    ),
    fontSize: String(styles.fontSize),
    intermediateTabletFontSize: String(styles.tabletFontSize),
    intermediateMobileFontSize: String(styles.mobileFontSize),
    letterSpacing: String(styles.letterSpacing)
      .replace(".", "_")
      .replace("-", "m_"),
    intermediateTabletLetterSpacing: String(styles.tabletLetterSpacing)
      .replace(".", "_")
      .replace("-", "m_"),
    intermediateMobileLetterSpacing: String(styles.mobileLetterSpacing)
      .replace(".", "_")
      .replace("-", "m_"),
    fontFamily: String(styles.fontFamily),
    fontFamilyType: String(styles.fontFamilyType),
    fontWeight: String(styles.fontWeight),
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
  // it's only for situations when intermediateValue doesn't exist(normally it should never happen)
  intermediateValue = intermediateValue || value || "";

  const newValue =
    Number(intermediateValue) + (Number(value) - Number(oldValue));
  const roundedValue = toDec ? round(newValue) : Math.round(newValue);

  return Math.min(Math.max(min, roundedValue), max);
};

const MIN_SIZE = 6;
const MAX_SIZE = 300;

const MIN_HEIGHT = 1;
const MAX_HEIGHT = 5;

const MIN_LETTER_SPACING = -5;
const MAX_LETTER_SPACING = 15;

export default function(v, onChange) {
  return { getItems: getItems(v, onChange) };
}

const getItems = (v, onChange) => ({ device, component }) => {
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);
  const isPopulationBlock = v.population && v.population.display === "block";

  let disablePopup;
  if (device === "desktop") {
    disablePopup = !proEnabled || inPopup || inPopup2 || IS_GLOBAL_POPUP;
  } else {
    disablePopup = v.linkType !== "popup" || v.linkPopup === "";
  }

  const disableLink =
    isPopulationBlock || (device === "desktop" ? false : disablePopup);

  return [
    {
      id: "toolbarFont",
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 10,
      disabled: isPopulationBlock,
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__typography",
          columns: [
            {
              width: 54,
              options: [
                {
                  ...toolbarTypography2FontFamily({
                    v,
                    device,
                    devices: "desktop",
                    state: "normal"
                  }),
                  onChange: ({ id, weights, type }) => {
                    const { fontFamily, fontWeight } = v;
                    const mewFont = getDesktopFontStyles(
                      v.fontStyle,
                      getFont(id, { type, fontFamily, fontWeight, weights })
                    );

                    let newWeight = {};
                    if (!v.mobileFontWeight) {
                      newWeight = {
                        intermediateTabletWeight: mewFont.fontWeight,
                        intermediateMobileWeight: mewFont.fontWeight
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
                  ...toolbarTypography2FontStyle({
                    v,
                    device,
                    devices: "desktop",
                    state: "normal"
                  }),
                  onChange: value => {
                    if (!value) {
                      onChange(getDesktopFontStyles(v.fontStyle, {}));

                      return;
                    }

                    onChange({
                      fontStyle: value.toLowerCase(),
                      fontFamily: null,
                      fontFamilyType: null,
                      fontSize: null,
                      lineHeight: null,
                      fontWeight: null,
                      letterSpacing: null,
                      intermediateTabletFontSize: null,
                      intermediateMobileFontSize: null,
                      intermediateTabletLineHeight: null,
                      intermediateMobileLineHeight: null,
                      intermediateTabletLetterSpacing: null,
                      intermediateMobileLetterSpacing: null,
                      intermediateTabletWeight: null,
                      intermediateMobileWeight: null
                    });
                  }
                },
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: 50,
                      options: [
                        {
                          ...toolbarTypography2FontSize({
                            v,
                            device,
                            state: "normal"
                          }),
                          min: MIN_SIZE,
                          max: MAX_SIZE,
                          onChange: value => {
                            if (device !== "desktop") {
                              onChange({
                                [`${device}FontSize`]: String(value),
                                [`intermediate${capitalize(
                                  device
                                )}FontSize`]: null
                              });

                              return;
                            }
                            const cfs = getFontStyle(v.fontStyle) || {};

                            const styles = getDesktopFontStyles(v.fontStyle, {
                              fontSize: String(value)
                            });

                            let newSize = {
                              intermediateTabletFontSize: null,
                              intermediateMobileFontSize: null
                            };
                            if (
                              !v.mobileFontSize ||
                              (v.mobileFontSize &&
                                cfs.mobileFontSize === v.mobileFontSize)
                            ) {
                              const intermediateMobileFontSize =
                                v.intermediateMobileFontSize ||
                                styles.intermediateMobileFontSize;

                              newSize.intermediateMobileFontSize = calcIntermediateStyle(
                                v.fontSize,
                                value,
                                intermediateMobileFontSize,
                                {
                                  min: MIN_SIZE,
                                  max: MAX_SIZE
                                }
                              );
                            }
                            if (
                              !v.tabletFontSize ||
                              (v.tabletFontSize &&
                                cfs.tabletFontSize === v.tabletFontSize)
                            ) {
                              const intermediateTabletFontSize =
                                v.intermediateTabletFontSize ||
                                styles.intermediateTabletFontSize;

                              newSize.intermediateTabletFontSize = calcIntermediateStyle(
                                v.fontSize,
                                value,
                                intermediateTabletFontSize,
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
                          ...toolbarTypography2LineHeight({
                            v,
                            device,
                            state: "normal"
                          }),
                          min: MIN_HEIGHT,
                          max: MAX_HEIGHT,
                          onChange: value => {
                            if (device !== "desktop") {
                              onChange({
                                [`${device}LineHeight`]: String(value).replace(
                                  ".",
                                  "_"
                                ),
                                [`intermediate${capitalize(
                                  device
                                )}LineHeight`]: null
                              });

                              return;
                            }

                            const cfs = getFontStyle(v.fontStyle) || {};
                            const styles = getDesktopFontStyles(v.fontStyle, {
                              lineHeight: String(value).replace(".", "_")
                            });

                            let newHeight = {
                              intermediateTabletLineHeight: null,
                              intermediateMobileLineHeight: null
                            };
                            if (
                              !v.mobileLineHeight ||
                              (v.mobileLineHeight &&
                                cfs.mobileLineHeight === v.mobileLineHeight)
                            ) {
                              const intermediateMobileLineHeight =
                                v.intermediateMobileLineHeight ||
                                styles.intermediateMobileLineHeight ||
                                "";
                              newHeight.intermediateMobileLineHeight = String(
                                calcIntermediateStyle(
                                  v.lineHeight,
                                  value,
                                  intermediateMobileLineHeight.replace(
                                    "_",
                                    "."
                                  ),
                                  {
                                    toDec: true,
                                    min: MIN_HEIGHT,
                                    max: MAX_HEIGHT
                                  }
                                )
                              ).replace(".", "_");
                            }
                            if (
                              !v.tabletLineHeight ||
                              (v.tabletLineHeight &&
                                cfs.tabletLineHeight === v.tabletLineHeight)
                            ) {
                              const intermediateTabletLineHeight =
                                v.intermediateTabletLineHeight ||
                                styles.intermediateTabletLineHeight ||
                                "";
                              newHeight.intermediateTabletLineHeight = String(
                                calcIntermediateStyle(
                                  v.lineHeight,
                                  value,
                                  intermediateTabletLineHeight.replace(
                                    "_",
                                    "."
                                  ),
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
                          ...toolbarTypography2FontWeight({
                            v,
                            device,
                            state: "normal"
                          }),
                          onChange: fontWeight => {
                            if (device !== "desktop") {
                              onChange({
                                [`${device}FontWeight`]: String(fontWeight),
                                [`intermediate${capitalize(
                                  device
                                )}FontWeight`]: null
                              });

                              return;
                            }

                            let newWeight = {
                              intermediateTabletWeight: null,
                              intermediateMobileWeight: null
                            };
                            const cfs = getFontStyle(v.fontStyle) || {};

                            if (
                              !v.mobileFontWeight ||
                              (v.mobileFontWeight &&
                                cfs.mobileFontWeight === v.mobileFontWeight)
                            ) {
                              newWeight.intermediateMobileWeight = fontWeight;
                            }
                            if (
                              !v.tabletFontWeight ||
                              (v.tabletFontWeight &&
                                cfs.tabletFontWeight === v.tabletFontWeight)
                            ) {
                              newWeight.intermediateTabletWeight = fontWeight;
                            }

                            onChange(
                              getDesktopFontStyles(v.fontStyle, {
                                fontWeight,
                                ...newWeight
                              })
                            );
                          }
                        },
                        {
                          ...toolbarTypography2LetterSpacing({
                            v,
                            device,
                            state: "normal"
                          }),
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

                            if (device !== "desktop") {
                              onChange({
                                [`${device}LetterSpacing`]: toString(value),
                                [`intermediate${capitalize(
                                  device
                                )}LetterSpacing`]: null
                              });

                              return;
                            }

                            const cfs = getFontStyle(v.fontStyle) || {};
                            const styles = getDesktopFontStyles(v.fontStyle, {
                              letterSpacing: toString(value)
                            });

                            let newLetterSpacing = {
                              intermediateTabletLetterSpacing: null,
                              intermediateMobileLetterSpacing: null
                            };

                            if (
                              !v.mobileLetterSpacing ||
                              (v.mobileLetterSpacing &&
                                cfs.mobileLetterSpacing ===
                                  v.mobileLetterSpacing)
                            ) {
                              const intermediateMobileLetterSpacing =
                                v.intermediateMobileLetterSpacing ||
                                styles.intermediateMobileLetterSpacing ||
                                "";
                              const newNumberLetterSpacing = calcIntermediateStyle(
                                v.letterSpacing,
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

                            if (
                              !v.tabletLetterSpacing ||
                              (v.tabletLetterSpacing &&
                                cfs.tabletLetterSpacing ===
                                  v.tabletLetterSpacing)
                            ) {
                              const intermediateTabletLetterSpacing =
                                v.intermediateTabletLetterSpacing ||
                                styles.intermediateTabletLetterSpacing ||
                                "";
                              const newNumberLetterSpacing = calcIntermediateStyle(
                                v.letterSpacing,
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
    getColorToolbar(
      { ...v, isPopulationBlock },
      { device, component },
      onChange
    ),
    // disable Wrapper's horizontalAlign because it is toggle-dev
    // and we can't migrate to it yet (because of custom onChange)
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      // put a different id to not conflict with `horizontalAlign` from Wrapper
      id: "richTextHorizontalAlign",
      label: t("Align"),
      type: "toggle",
      position: 30,
      disabled: isPopulationBlock,
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
      value:
        device === "desktop"
          ? v.horizontalAlign
          : v[`${device}HorizontalAlign`],
      onChange: value =>
        onChange({ [`${device}HorizontalAlign`]: String(value) })
    },
    {
      id: "list",
      type: "toggle",
      position: 40,
      disabled: device !== "desktop" || isPopulationBlock,
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
      value: v.list,
      onChange: list => onChange({ list })
    },
    {
      id: "bold",
      type: "button",
      icon: "nc-bold",
      title: t("Bold"),
      position: 50,
      disabled: device !== "desktop" || isPopulationBlock,
      value: v.bold,
      onChange: bold => onChange({ bold })
    },
    {
      id: "italic",
      type: "button",
      icon: "nc-italic",
      title: t("Italic"),
      position: 60,
      disabled: device !== "desktop" || isPopulationBlock,
      value: v.italic,
      onChange: italic => onChange({ italic })
    },
    {
      id: "toolbarLink",
      type: "popover",
      icon: "nc-link",
      disabled: disableLink,
      size: "medium",
      title: t("Link"),
      position: 80,
      options: [
        {
          id: "linkType",
          type: "tabs",
          value: v.linkType,
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                {
                  ...toolbarLinkExternal({ v }),
                  disabled: device !== "desktop",
                  onChange: (
                    { value: linkExternal, population: linkPopulation },
                    { changed, changeEvent }
                  ) => {
                    if (changeEvent === "blur" || changed === "population") {
                      onChange({
                        link: encodeToString({
                          type: v.linkType,
                          anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                          external: linkExternal,
                          externalBlank: v.linkExternalBlank,
                          externalRel: v.linkExternalRel,
                          externalType:
                            changed === "value" ? "external" : "population",
                          population: linkPopulation,
                          popup: v.linkPopup ? `#${v.linkPopup}` : "",
                          upload: v.linkUpload
                        })
                      });
                    }
                  }
                },
                {
                  ...toolbarLinkExternalBlank({ v }),
                  disabled: device !== "desktop",
                  onChange: linkExternalBlank =>
                    onChange({
                      link: encodeToString({
                        type: v.linkType,
                        anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                        external: v.linkExternal,
                        externalBlank: linkExternalBlank,
                        externalRel: v.linkExternalRel,
                        externalType: v.linkExternalType,
                        population: v.linkPopulation,
                        popup: v.linkPopup ? `#${v.linkPopup}` : "",
                        upload: v.linkUpload
                      })
                    })
                },
                {
                  ...toolbarLinkExternalRel({ v }),
                  disabled: device !== "desktop",
                  onChange: linkExternalRel =>
                    onChange({
                      link: encodeToString({
                        type: v.linkType,
                        anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                        external: v.linkExternal,
                        externalBlank: v.linkExternalBlank,
                        externalRel: linkExternalRel,
                        externalType: v.linkExternalType,
                        population: v.linkPopulation,
                        popup: v.linkPopup ? `#${v.linkPopup}` : "",
                        upload: v.linkUpload
                      })
                    })
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              disabled: device !== "desktop",
              options: [
                {
                  ...toolbarLinkAnchor({ v }),
                  disabled: device !== "desktop",
                  onChange: linkAnchor =>
                    onChange({
                      link: encodeToString({
                        type: v.linkType,
                        anchor: linkAnchor ? `#${linkAnchor}` : "",
                        external: v.linkExternal,
                        externalBlank: v.linkExternalBlank,
                        externalRel: v.linkExternalRel,
                        externalType: v.linkExternalType,
                        population: v.linkPopulation,
                        popup: v.linkPopup ? `#${v.linkPopup}` : "",
                        upload: v.linkUpload
                      })
                    })
                }
              ]
            },
            {
              id: "upload",
              label: t("File"),
              disabled: device !== "desktop",
              options: [
                {
                  ...toolbarLinkUpload({ v, component }),
                  disabled: !proEnabled || device !== "desktop",
                  onChange: upload =>
                    onChange({
                      link: encodeToString({
                        type: v.linkType,
                        anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                        external: v.linkExternal,
                        externalBlank: v.linkExternalBlank,
                        externalRel: v.linkExternalRel,
                        externalType: v.linkExternalType,
                        population: v.linkPopulation,
                        popup: v.linkPopup ? `#${v.linkPopup}` : "",
                        upload
                      })
                    })
                }
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  ...toolbarLinkPopup({
                    v,
                    component,
                    canDelete: device === "desktop"
                  }),
                  disabled: disablePopup,
                  onChange: ({ value: linkPopup, popups }) =>
                    onChange({
                      link: encodeToString({
                        type: v.linkType,
                        anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                        external: v.linkExternal,
                        externalBlank: v.linkExternalBlank,
                        externalRel: v.linkExternalRel,
                        externalType: v.linkExternalType,
                        population: v.linkPopulation,
                        popup: linkPopup ? `#${linkPopup}` : "",
                        upload: v.linkUpload
                      }),
                      popups
                    })
                }
              ]
            }
          ],
          onChange: linkType =>
            onChange({
              link: encodeToString({
                type: linkType,
                anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                external: v.linkExternal,
                externalBlank: v.linkExternalBlank,
                externalRel: v.linkExternalRel,
                externalType: v.linkExternalType,
                population: v.linkPopulation,
                popup: v.linkPopup ? `#${v.linkPopup}` : "",
                upload: v.linkUpload
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
            value: v.marginTop
          },
          onChange: ({ value: marginTop }) =>
            onChange({ [`${device}MarginTop`]: String(marginTop) })
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
            value: v.marginBottom
          },
          onChange: ({ value: marginBottom }) =>
            onChange({ [`${device}MarginBottom`]: String(marginBottom) })
        },
        {
          id: "tag",
          label: t("HTML Tag"),
          type: "select",
          className: "brz-control__select--small",
          disabled: isPopulationBlock,
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
          value: v.tagName
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          devices: "desktop",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
};
