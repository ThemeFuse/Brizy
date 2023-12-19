import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getCollectionTypes } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { encodeToString } from "visual/utils/string";
import { toolbarLinkAnchor, toolbarLinkPopup } from "visual/utils/toolbar";
import { handleChangePage } from "../utils";
import getColorToolbar from "./color";
import { checkTextIncludeTag } from "./utils/checkTextIncludeTag";

const proEnabled = Boolean(Config.get("pro"));

export default function (v, onChange) {
  return { getItems: getItems(v, onChange) };
}

const dependenciesOption = (v, onChange) => {
  return v.textPopulation
    ? {}
    : {
        dependencies: (data) => {
          "tag" in data ? onChange(getBlockTag(data.tag)) : onChange(data);
        }
      };
};

const getBlockTag = (value) => {
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

const getItems =
  (v, onChange) =>
  ({ device, component, context }) => {
    const config = Config.getAll();
    const collectionTypesHandler =
      config?.api?.collectionTypes?.loadCollectionTypes.handler;
    const IS_STORY = isStory(config);
    const IS_GLOBAL_POPUP = isPopup(config);
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

    const disableButtonDynamicTextCapitalize =
      !v.textPopulation || device !== "desktop";
    const richTextDC = getDynamicContentOption({
      options: context.dynamicContent.config,
      type: DCTypes.richText,
      config: { iconOnly: true }
    });

    const dependencies = dependenciesOption(v, onChange);

    const disableHeadingTags = (v, tag) => {
      const { text, textPopulation } = v;

      if (!textPopulation) {
        return true;
      }

      return !checkTextIncludeTag(text, tag);
    };

    const dvv = (key) => defaultValueValue({ key, v, device });
    const linkSource = dvv("linkSource");

    const linkDC = getDynamicContentOption({
      options: context.dynamicContent.config,
      type: DCTypes.link
    });

    const disableAiText =
      !!v.population ||
      !!v.textPopulation ||
      typeof config?.api?.textAI?.handler !== "function";

    return [
      {
        id: "aiText",
        type: "popover-dev",
        config: {
          icon: "t2-star-shapes",
          size: "auto",
          title: t("AiText")
        },
        roles: ["admin"],
        position: 10,
        options: [
          {
            id: "text",
            type: "aiText-dev",
            isPro: true,
            selectedValue: v.selectedValue,
            devices: "desktop"
          }
        ],
        disabled: disableAiText
      },
      {
        id: "toolbarFont",
        type: "popover-dev",
        config: {
          icon: "nc-font",
          size: device === "desktop" ? "xlarge" : "auto",
          title: t("Typography")
        },
        roles: ["admin"],
        position: 10,
        disabled: isPopulationBlock,
        options: [
          {
            id: "tabsTypography",
            type: "tabs-dev",
            config: {
              showSingle: v.textPopulation
            },
            tabs: [
              {
                id: "tabTypographyParagraph",
                label: t("P"),
                options: [
                  {
                    id: "gridTypographyParagraph",
                    type: "grid-dev",
                    config: {
                      separator: true
                    },
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
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
                        id: "col-2",
                        size: "auto",
                        align: "center",
                        options: [
                          {
                            id: "text",
                            type: "population-dev",
                            disabled: !richTextDC,
                            config: richTextDC,
                            devices: "desktop"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: "tabTypographyH1",
                label: t("H1"),
                options: [
                  {
                    id: "gridTypographyH1",
                    type: "grid-dev",
                    config: {
                      separator: true
                    },
                    disabled: disableHeadingTags(v, "h1"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h1",
                            type: "typography-dev",
                            config: {
                              fontFamily: "desktop" === device
                            },
                            ...dependencies
                          }
                        ]
                      },
                      {
                        id: "col-2",
                        size: "auto",
                        align: "center",
                        options: [
                          {
                            id: "text",
                            type: "population-dev",
                            disabled: !richTextDC,
                            config: richTextDC,
                            devices: "desktop"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: "tabTypographyH2",
                label: t("H2"),
                options: [
                  {
                    id: "gridTypographyH2",
                    type: "grid-dev",
                    disabled: disableHeadingTags(v, "h2"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h2",
                            type: "typography-dev",
                            config: {
                              fontFamily: "desktop" === device
                            },
                            ...dependencies
                          }
                        ]
                      },
                      {
                        id: "col-2",
                        size: "auto",
                        align: "center",
                        options: [
                          {
                            id: "text",
                            type: "population-dev",
                            disabled: !richTextDC,
                            config: richTextDC,
                            devices: "desktop"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: "tabTypographyH3",
                label: t("H3"),
                options: [
                  {
                    id: "gridTypographyH3",
                    type: "grid-dev",
                    disabled: disableHeadingTags(v, "h3"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h3",
                            type: "typography-dev",
                            config: {
                              fontFamily: "desktop" === device
                            },
                            ...dependencies
                          }
                        ]
                      },
                      {
                        id: "col-2",
                        size: "auto",
                        align: "center",
                        options: [
                          {
                            id: "text",
                            type: "population-dev",
                            disabled: !richTextDC,
                            config: richTextDC,
                            devices: "desktop"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: "tabTypographyH4",
                label: t("H4"),
                options: [
                  {
                    id: "gridTypographyH4",
                    type: "grid-dev",
                    disabled: disableHeadingTags(v, "h4"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h4",
                            type: "typography-dev",
                            config: {
                              fontFamily: "desktop" === device
                            },
                            ...dependencies
                          }
                        ]
                      },
                      {
                        id: "col-2",
                        size: "auto",
                        align: "center",
                        options: [
                          {
                            id: "text",
                            type: "population-dev",
                            disabled: !richTextDC,
                            config: richTextDC,
                            devices: "desktop"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: "tabTypographyH5",
                label: t("H5"),
                options: [
                  {
                    id: "gridTypographyH5",
                    type: "grid-dev",
                    disabled: disableHeadingTags(v, "h5"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h5",
                            type: "typography-dev",
                            config: {
                              fontFamily: "desktop" === device
                            },
                            ...dependencies
                          }
                        ]
                      },
                      {
                        id: "col-2",
                        size: "auto",
                        align: "center",
                        options: [
                          {
                            id: "text",
                            type: "population-dev",
                            disabled: !richTextDC,
                            config: richTextDC,
                            devices: "desktop"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: "tabTypographyH6",
                label: t("H6"),
                options: [
                  {
                    id: "gridTypographyH6",
                    type: "grid-dev",
                    disabled: disableHeadingTags(v, "h6"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h6",
                            type: "typography-dev",
                            config: {
                              fontFamily: "desktop" === device
                            },
                            ...dependencies
                          }
                        ]
                      },
                      {
                        id: "col-2",
                        size: "auto",
                        align: "center",
                        options: [
                          {
                            id: "text",
                            type: "population-dev",
                            disabled: !richTextDC,
                            config: richTextDC,
                            devices: "desktop"
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
        id: "dynamicTextCapitalize",
        type: "button",
        icon: "nc-tp-capitalize",
        title: t("Uppercase"),
        position: 75,
        disabled: disableButtonDynamicTextCapitalize,
        value: v.dynamicTextCapitalize === "on",
        onChange: (value) => ({ dynamicTextCapitalize: value ? "on" : "off" })
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
        onChange: (bold) => onChange({ bold })
      },
      {
        id: "italic",
        type: "button",
        icon: "nc-italic",
        title: t("Italic"),
        position: 60,
        disabled: disableButtons,
        value: v.italic,
        onChange: (italic) => onChange({ italic })
      },
      {
        id: "underline",
        type: "button",
        icon: "nc-tp-underline",
        title: t("Underline"),
        position: 65,
        disabled: disableButtons,
        value: v.underline,
        onChange: (underline) => onChange({ underline })
      },
      {
        id: "strike",
        type: "button",
        icon: "nc-tp-strike",
        title: t("Strike"),
        position: 70,
        disabled: disableButtons,
        value: v.strike,
        onChange: (strike) => onChange({ strike })
      },
      {
        id: "capitalize",
        type: "button",
        icon: "nc-tp-capitalize",
        title: t("Uppercase"),
        position: 75,
        disabled: disableButtons,
        value: v.capitalize,
        onChange: (value) => onChange({ capitalize: value ? "on" : null })
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
                id: "page",
                label: t("Page"),
                options: [
                  {
                    id: "linkSource",
                    type: "select-dev",
                    disabled: !collectionTypesHandler,
                    label: t("Type"),
                    devices: "desktop",
                    choices: {
                      load: () => getCollectionTypes(config),
                      emptyLoad: {
                        title: t("There are no choices")
                      }
                    },
                    config: {
                      size: "large"
                    }
                  },
                  {
                    id: "linkPage",
                    type: "internalLink-dev",
                    label: t("Find Page"),
                    devices: "desktop",
                    disabled: !linkSource,
                    config: {
                      postType: linkSource
                    },
                    dependencies: (value) =>
                      v.textPopulation
                        ? value
                        : onChange({ link: handleChangePage(v, value) })
                  }
                ]
              },
              {
                id: "external",
                label: t("URL"),
                options: [
                  {
                    id: "link",
                    type: "population-dev",
                    label: t("Link to"),
                    config: linkDC,
                    option: {
                      id: "linkExternal",
                      type: "inputText-dev",
                      placeholder: "http://",
                      devices: "desktop",
                      config: {
                        size: "medium"
                      }
                    }
                  },
                  {
                    id: "linkExternalBlank",
                    type: "switch-dev",
                    label: t("Open In New Tab"),
                    disabled: device !== "desktop",
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkExternalBlank }) => {
                            onChange({
                              link: encodeToString({
                                type: v.linkType,
                                anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                                external: v.linkExternal,
                                externalBlank: linkExternalBlank,
                                externalRel: v.linkExternalRel,
                                externalType: v.linkExternalType,
                                population: v.linkPopulation,
                                populationEntityId: v.linkPopulationEntityId,
                                populationEntityType:
                                  v.linkPopulationEntityType,
                                popup: v.linkPopup ? `#${v.linkPopup}` : "",
                                upload: v.linkUpload,
                                linkToSlide: v.linkToSlide
                              })
                            });
                          }
                        })
                  },
                  {
                    id: "linkExternalRel",
                    type: "switch-dev",
                    label: t("Make it Nofollow"),
                    disabled: device !== "desktop",
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkExternalRel }) =>
                            onChange({
                              link: encodeToString({
                                type: v.linkType,
                                anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                                external: v.linkExternal,
                                externalBlank: v.linkExternalBlank,
                                externalRel: linkExternalRel,
                                externalType: v.linkExternalType,
                                population: v.linkPopulation,
                                populationEntityId: v.linkPopulationEntityId,
                                populationEntityType:
                                  v.linkPopulationEntityType,
                                popup: v.linkPopup ? `#${v.linkPopup}` : "",
                                upload: v.linkUpload,
                                linkToSlide: v.linkToSlide
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
                    disabled:
                      device !== "desktop" ||
                      isPopup(config) ||
                      isStory(config),
                    ...(v.textPopulation
                      ? {}
                      : {
                          onChange: (linkAnchor) =>
                            onChange({
                              link: encodeToString({
                                type: v.linkType,
                                anchor: linkAnchor ? `#${linkAnchor}` : "",
                                external: v.linkExternal,
                                externalBlank: v.linkExternalBlank,
                                externalRel: v.linkExternalRel,
                                externalType: v.linkExternalType,
                                population: v.linkPopulation,
                                populationEntityId: v.linkPopulationEntityId,
                                populationEntityType:
                                  v.linkPopulationEntityType,
                                popup: v.linkPopup ? `#${v.linkPopup}` : "",
                                upload: v.linkUpload,
                                linkToSlide: v.linkToSlide
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
                    id: "linkUpload",
                    label: t("File"),
                    type: "fileUpload-dev",
                    disabled: !proEnabled || device !== "desktop",
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkUpload }) => {
                            onChange({
                              link: encodeToString({
                                type: v.linkType,
                                anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                                external: v.linkExternal,
                                externalBlank: v.linkExternalBlank,
                                externalRel: v.linkExternalRel,
                                externalType: v.linkExternalType,
                                population: v.linkPopulation,
                                populationEntityId: v.linkPopulationEntityId,
                                populationEntityType:
                                  v.linkPopulationEntityType,
                                popup: v.linkPopup ? `#${v.linkPopup}` : "",
                                upload: linkUpload,
                                linkToSlide: v.linkToSlide
                              })
                            });
                          }
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
                                populationEntityId: v.linkPopulationEntityId,
                                populationEntityType:
                                  v.linkPopulationEntityType,
                                popup: linkPopup ? `#${linkPopup}` : "",
                                upload: v.linkUpload,
                                linkToSlide: v.linkToSlide
                              }),
                              popups
                            })
                        })
                  }
                ]
              },
              {
                id: "linkToSlide",
                label: t("Slides"),
                options: [
                  {
                    id: "linkToSlide",
                    type: "number-dev",
                    label: t("Slide"),
                    disabled: !IS_STORY,
                    config: {
                      min: 1,
                      max: 1000000
                    },
                    dependencies: ({ linkToSlide }) => {
                      onChange({
                        link: encodeToString({
                          type: v.linkType,
                          anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                          external: v.linkExternal,
                          externalBlank: v.linkExternalBlank,
                          externalRel: v.linkExternalRel,
                          externalType: v.linkExternalType,
                          population: v.linkPopulation,
                          populationEntityId: v.linkPopulationEntityId,
                          populationEntityType: v.linkPopulationEntityType,
                          popup: v.linkPopup ? `#${v.linkPopup}` : "",
                          linkToSlide: linkToSlide
                        })
                      });
                    }
                  }
                ]
              }
            ],
            value: v.linkType,
            ...(v.textPopulation
              ? {}
              : {
                  onChange: (linkType) => {
                    onChange({
                      link: encodeToString({
                        type: linkType,
                        anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
                        external: v.linkExternal,
                        externalBlank: v.linkExternalBlank,
                        externalRel: v.linkExternalRel,
                        externalType: v.linkExternalType,
                        population: v.linkPopulation,
                        populationEntityId: v.linkPopulationEntityId,
                        populationEntityType: v.linkPopulationEntityType,
                        popup: v.linkPopup ? `#${v.linkPopup}` : "",
                        upload: v.linkUpload,
                        linkToSlide: v.linkToSlide
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
        devices: "desktop",
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
            id: "tag",
            label: t("HTML Tag"),
            type: "select-dev",
            className: "brz-control__select--small",
            disabled: isPopulationBlock,
            choices: [
              { title: "P", value: "p" },
              { title: "H1", value: "h1" },
              { title: "H2", value: "h2" },
              { title: "H3", value: "h3" },
              { title: "H4", value: "h4" },
              { title: "H5", value: "h5" },
              { title: "H6", value: "h6" },
              { title: "PRE", value: "pre" }
            ],
            ...dependencies
          },
          {
            id: "grid",
            type: "grid-dev",
            config: {
              separator: true
            },
            columns: [
              {
                size: 1,
                options: [
                  {
                    id: "styles",
                    type: "sidebarTabsButton-dev",
                    config: {
                      tabId: "styles",
                      text: t("Styling"),
                      icon: "nc-cog",
                      align: "center"
                    }
                  }
                ]
              },
              {
                size: 1,
                options: [
                  {
                    id: "effects",
                    type: "sidebarTabsButton-dev",
                    config: {
                      tabId: "effects",
                      text: t("Effects"),
                      icon: "nc-flash",
                      align: "center"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  };
