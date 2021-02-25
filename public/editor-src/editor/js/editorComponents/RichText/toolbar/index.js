import Config from "visual/global/Config";
import { getWeight } from "visual/utils/fonts";
import { encodeToString } from "visual/utils/string";
import { getFontStyle } from "visual/utils/fonts";
import getColorToolbar from "./color";
import { t } from "visual/utils/i18n";
import { IS_GLOBAL_POPUP, IS_STORY } from "visual/utils/models";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2FontSizeSuffix,
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

function transformVtoOldStyle(v) {
  return {
    ...v,
    fontStyle: v.newFontStyle || v.fontStyle || ""
  };
}

function numberToQuillString(num) {
  return String(num)
    .replace(".", "_")
    .replace("-", "m_");
}

function getMigrationStyles(v, device) {
  let migrationStyles = {};

  if (v.fontStyle) {
    migrationStyles.fontStyle = null;
    migrationStyles.newFontStyle = v.fontStyle;
  }

  if (device === "desktop") {
    migrationStyles.newFontStyle = "";
  }

  if (device === "tablet") {
    migrationStyles.tabletFontStyle = "";
  } else if (v.tabletFontStyle === null && v.tabletFontSize === null) {
    migrationStyles.tabletFontStyle = v.newFontStyle || v.fontStyle;
  }

  if (device === "mobile") {
    migrationStyles.mobileFontStyle = "";
  } else if (v.mobileFontStyle === null && v.mobileFontSize === null) {
    migrationStyles.mobileFontStyle = v.newFontStyle || v.fontStyle;
  }

  // tablet
  if (v.intermediateTabletFontSize) {
    migrationStyles.tabletFontSize = v.intermediateTabletFontSize;
  }

  if (v.intermediateTabletFontSizeSuffix) {
    migrationStyles.tabletFontSizeSuffix = v.intermediateTabletFontSizeSuffix;
  }

  if (v.intermediateTabletFontWeight) {
    migrationStyles.tabletFontWeight = v.intermediateTabletFontWeight;
  }

  if (v.intermediateTabletLineHeight) {
    migrationStyles.tabletLineHeight = v.intermediateTabletLineHeight;
  }

  if (v.intermediateTabletLetterSpacing) {
    migrationStyles.tabletLetterSpacing = v.intermediateTabletLetterSpacing;
  }

  // mobile
  if (v.intermediateMobileFontSize) {
    migrationStyles.mobileFontSize = v.intermediateMobileFontSize;
  }

  if (v.intermediateMobileFontSizeSuffix) {
    migrationStyles.mobileFontSizeSuffix = v.intermediateMobileFontSizeSuffix;
  }

  if (v.intermediateMobileFontWeight) {
    migrationStyles.mobileFontWeight = v.intermediateMobileFontWeight;
  }

  if (v.intermediateMobileLineHeight) {
    migrationStyles.mobileLineHeight = v.intermediateMobileLineHeight;
  }

  if (v.intermediateMobileLetterSpacing) {
    migrationStyles.mobileLetterSpacing = v.intermediateMobileLetterSpacing;
  }

  return migrationStyles;
}

function getCurrentFontFormat({ v, key, value, device }) {
  const dvk = key => defaultValueKey({ key, device });

  const newV = transformVtoOldStyle(v);

  const currentKey = dvk(key);

  let typographyStyles = {};
  if (newV[currentKey] === null) {
    typographyStyles = getTypographyByDevice(newV, device);
  }

  const migrationStyles = getMigrationStyles(v, device);

  return {
    ...migrationStyles,
    ...typographyStyles,
    [currentKey]: value
  };
}

const getTypographyByDevice = (v, device) => {
  const dvk = key => defaultValueKey({ key, device });

  const fontStyleKey = v[dvk("fontStyle")] || v["fontStyle"];

  const {
    fontFamily,
    fontFamilyType,

    fontSize,
    tabletFontSize,
    mobileFontSize,

    // old users don't have this data into theirs styles
    // so we set them manually
    fontSizeSuffix = "px",
    tabletFontSizeSuffix = "px",
    mobileFontSizeSuffix = "px",

    fontWeight,
    tabletFontWeight,
    mobileFontWeight,

    lineHeight,
    tabletLineHeight,
    mobileLineHeight,

    letterSpacing,
    tabletLetterSpacing,
    mobileLetterSpacing
  } = getFontStyle(fontStyleKey) || {};

  const styles = {
    desktop: {
      fontFamily,
      fontFamilyType,
      fontSize,
      fontSizeSuffix,
      fontWeight,
      lineHeight: numberToQuillString(lineHeight),
      letterSpacing: numberToQuillString(letterSpacing)
    },
    tablet: {
      tabletFontSize,
      tabletFontSizeSuffix,
      tabletFontWeight,
      tabletLineHeight: numberToQuillString(tabletLineHeight),
      tabletLetterSpacing: numberToQuillString(tabletLetterSpacing)
    },
    mobile: {
      mobileFontSize,
      mobileFontSizeSuffix,
      mobileFontWeight,
      mobileLineHeight: numberToQuillString(mobileLineHeight),
      mobileLetterSpacing: numberToQuillString(mobileLetterSpacing)
    }
  };

  return styles[device];
};

const MIN_SIZE = 2;
const MAX_SIZE = 300;

const MIN_HEIGHT = 1;
const MAX_HEIGHT = 5;

export default function(v, onChange) {
  return { getItems: getItems(v, onChange) };
}

const getItems = (v, onChange) => ({ device, component }) => {
  const inPopup = Boolean(component.props.meta?.sectionPopup);
  const inPopup2 = Boolean(component.props.meta?.sectionPopup2);
  const isPopulationBlock = v.population && v.population.display === "block";

  let disablePopup;
  if (device === "desktop") {
    disablePopup = inPopup || inPopup2 || IS_GLOBAL_POPUP;
  } else {
    disablePopup = v.linkType !== "popup" || v.linkPopup === "";
  }

  const disableLink =
    isPopulationBlock || (device === "desktop" ? false : disablePopup);

  const dvk = key => defaultValueKey({ key, device });

  const getFontFormat = (key, value) =>
    getCurrentFontFormat({ v, key, value, device });

  const newV = transformVtoOldStyle(v);

  return [
    {
      id: "toolbarFont",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
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
                    v: newV,
                    device,
                    devices: "desktop",
                    state: "normal"
                  }),
                  onChange: ({ id, weights, type }) => {
                    onChange({
                      ...getFontFormat("fontFamily", id),
                      fontFamilyType: type,
                      fontWeight: getWeight(v.fontWeight, weights)
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
                    v: newV,
                    device,
                    state: "normal"
                  }),
                  onChange: value => {
                    let fontStyleKey = dvk("fontStyle");
                    if (device === "desktop") {
                      fontStyleKey = "newFontStyle";
                    }

                    if (v[fontStyleKey] === value) return;

                    const migrationStyles = getMigrationStyles(v, device);
                    const typographyStyles = getTypographyByDevice(
                      newV,
                      device
                    );

                    if (value === "") {
                      onChange({
                        ...migrationStyles,
                        ...typographyStyles
                      });
                      return;
                    }

                    onChange(
                      Object.entries(typographyStyles).reduce(
                        (acc, [key]) => ({ ...acc, [key]: null }),
                        { ...migrationStyles, [fontStyleKey]: value }
                      )
                    );
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
                          ...toolbarTypography2FontSizeSuffix({
                            v: newV,
                            device,
                            state: "normal"
                          }),
                          onChange: value =>
                            onChange(getFontFormat("fontSizeSuffix", value))
                        },
                        {
                          ...toolbarTypography2FontSize({
                            v: newV,
                            device,
                            state: "normal"
                          }),
                          min: MIN_SIZE,
                          max: MAX_SIZE,
                          onChange: value =>
                            onChange(getFontFormat("fontSize", value))
                        },
                        {
                          ...toolbarTypography2LineHeight({
                            v: newV,
                            device,
                            state: "normal"
                          }),
                          min: MIN_HEIGHT,
                          max: MAX_HEIGHT,
                          onChange: value =>
                            onChange(
                              getFontFormat(
                                "lineHeight",
                                numberToQuillString(value)
                              )
                            )
                        }
                      ]
                    },
                    {
                      width: 50,
                      options: [
                        {
                          ...toolbarTypography2FontWeight({
                            v: newV,
                            device,
                            state: "normal"
                          }),
                          onChange: fontWeight =>
                            onChange(getFontFormat("fontWeight", fontWeight))
                        },
                        {
                          ...toolbarTypography2LetterSpacing({
                            v: newV,
                            device,
                            state: "normal"
                          }),
                          onChange: value =>
                            onChange(
                              getFontFormat(
                                "letterSpacing",
                                numberToQuillString(value)
                              )
                            )
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
      id: "underline",
      type: "button",
      icon: "nc-tp-underline",
      title: t("Underline"),
      position: 65,
      disabled: device !== "desktop" || isPopulationBlock,
      value: v.underline,
      onChange: underline => onChange({ underline })
    },
    {
      id: "strike",
      type: "button",
      icon: "nc-tp-strike",
      title: t("Strike"),
      position: 70,
      disabled: device !== "desktop" || isPopulationBlock,
      value: v.strike,
      onChange: strike => onChange({ strike })
    },
    {
      id: "capitalize",
      type: "button",
      icon: "nc-tp-capitalize",
      title: t("Capitalize"),
      position: 75,
      disabled: device !== "desktop" || isPopulationBlock,
      value: v.capitalize,
      onChange: value => onChange({ capitalize: value ? "on" : null })
    },
    {
      id: "toolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        size: "medium",
        title: t("Link")
      },
      disabled: disableLink,
      position: 80,
      options: [
        {
          id: "linkType",
          type: "tabs",
          config: {
            saveTab: true
          },
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
              options: [
                {
                  ...toolbarLinkAnchor({ v }),
                  disabled: device !== "desktop" || IS_GLOBAL_POPUP || IS_STORY,
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
                  disabled: disablePopup || IS_STORY,
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
          value: v.linkType,
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
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "marginTop",
          label: t("Gap Above"),
          type: "slider",
          disabled: IS_STORY,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
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
          disabled: IS_STORY,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
          },
          value: {
            value: v.marginBottom
          },
          onChange: ({ value: marginBottom }) =>
            onChange({ [`${device}MarginBottom`]: String(marginBottom) })
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
