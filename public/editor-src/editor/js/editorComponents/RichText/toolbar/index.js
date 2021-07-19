import Config from "visual/global/Config";
import { encodeToString } from "visual/utils/string";
import getColorToolbar from "./color";
import { t } from "visual/utils/i18n";
import { IS_GLOBAL_POPUP, IS_STORY } from "visual/utils/models";
import {
  toolbarLinkExternal,
  toolbarLinkExternalBlank,
  toolbarLinkExternalRel,
  toolbarLinkAnchor,
  toolbarLinkPopup,
  toolbarLinkUpload
} from "visual/utils/toolbar";
import { getDynamicContentChoices } from "visual/utils/options";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

const proEnabled = Boolean(Config.get("pro"));

export default function(v, onChange) {
  return { getItems: getItems(v, onChange) };
}

const dependenciesOption = (v, onChange) => {
  return v.textPopulation ? {} : { dependencies: v => onChange(v) };
};

const getItems = (v, onChange) => ({ device, component, context }) => {
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

  const disableButtons = !!(
    device !== "desktop" ||
    isPopulationBlock ||
    v.textPopulation
  );

  const richTextDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

  const dependencies = dependenciesOption(v, onChange);

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
          id: "gridTypography",
          type: "grid",
          columns: [
            {
              width: 95,
              vAlign: "center",
              options: [
                {
                  id: "typography",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  },
                  ...dependencies
                }
              ]
            },
            {
              width: 5,
              vAlign: "center",
              options: [
                {
                  id: "text",
                  type: "population-dev",
                  config: {
                    iconOnly: true,
                    choices: richTextDC
                  },
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    getColorToolbar(
      { ...v, isPopulationBlock },
      { device, component, context },
      onChange
    ),
    // is needed to disabled wrapper align
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      // put a different id to not conflict with `horizontalAlign` from Wrapper
      id: "contentHorizontalAlign",
      type: "toggle-dev",
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
      ...dependencies
    },
    {
      id: "list",
      type: "toggle-dev",
      position: 40,
      disabled: disableButtons,
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
          value: ""
        }
      ],
      ...dependencies
    },
    {
      id: "bold",
      type: "button",
      icon: "nc-bold",
      title: t("Bold"),
      position: 50,
      disabled: disableButtons,
      value: v.bold,
      onChange: bold => onChange({ bold })
    },
    {
      id: "italic",
      type: "button",
      icon: "nc-italic",
      title: t("Italic"),
      position: 60,
      disabled: disableButtons,
      value: v.italic,
      onChange: italic => onChange({ italic })
    },
    {
      id: "underline",
      type: "button",
      icon: "nc-tp-underline",
      title: t("Underline"),
      position: 65,
      disabled: disableButtons,
      value: v.underline,
      onChange: underline => onChange({ underline })
    },
    {
      id: "strike",
      type: "button",
      icon: "nc-tp-strike",
      title: t("Strike"),
      position: 70,
      disabled: disableButtons,
      value: v.strike,
      onChange: strike => onChange({ strike })
    },
    {
      id: "capitalize",
      type: "button",
      icon: "nc-tp-capitalize",
      title: t("Capitalize"),
      position: 75,
      disabled: disableButtons,
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
                  ...toolbarLinkExternal({
                    v,
                    config: context.dynamicContent.config
                  }),
                  disabled: device !== "desktop",
                  ...(v.textPopulation
                    ? {}
                    : {
                        onChange: (
                          { value: linkExternal, population: linkPopulation },
                          { changed, changeEvent }
                        ) => {
                          if (
                            changeEvent === "blur" ||
                            changed === "population"
                          ) {
                            onChange({
                              link: encodeToString({
                                type: v.linkType,
                                anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                                external: linkExternal,
                                externalBlank: v.linkExternalBlank,
                                externalRel: v.linkExternalRel,
                                externalType:
                                  changed === "value"
                                    ? "external"
                                    : "population",
                                population: linkPopulation,
                                popup: v.linkPopup ? `#${v.linkPopup}` : "",
                                upload: v.linkUpload
                              })
                            });
                          }
                        }
                      })
                },
                {
                  ...toolbarLinkExternalBlank({ v }),
                  disabled: device !== "desktop",
                  ...(v.textPopulation
                    ? {}
                    : {
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
                      })
                },
                {
                  ...toolbarLinkExternalRel({ v }),
                  disabled: device !== "desktop",
                  ...(v.textPopulation
                    ? {}
                    : {
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
                  ...(v.textPopulation
                    ? {}
                    : {
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
                  ...(v.textPopulation
                    ? {}
                    : {
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
                  ...(v.textPopulation
                    ? {}
                    : {
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
                      })
                }
              ]
            }
          ],
          value: v.linkType,
          ...(v.textPopulation
            ? {}
            : {
                onChange: linkType => {
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
                  });
                }
              })
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      icon: "nc-cog",
      disabled: !v.textPopulation,
      title: t("Settings"),
      position: 110
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      disabled: Boolean(v.textPopulation),
      options: [
        {
          id: "marginTop",
          label: t("Gap Above"),
          type: "slider-dev",
          disabled: IS_STORY,
          config: {
            min: 0,
            max: 100,
            step: 1,
            units: [{ value: "px", title: "px" }]
          },
          ...dependencies
        },
        {
          id: "marginBottom",
          label: t("Gap Below"),
          type: "slider-dev",
          disabled: IS_STORY,
          config: {
            min: 0,
            max: 100,
            step: 1,
            units: [{ value: "px", title: "px" }]
          },
          ...dependencies
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
