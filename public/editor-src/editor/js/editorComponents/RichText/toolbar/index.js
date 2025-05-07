import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getEnabledLinkOptions } from "visual/global/Config/types/configs/featuresValue";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import { getDynamicContentOption } from "visual/utils/options";
import { toolbarLinkAnchor } from "visual/utils/toolbar";
import { handleChangeLink, patchTextTransform } from "../utils/dependencies";
import getColorToolbar from "./color";
import { checkTextIncludeTag } from "./utils/checkTextIncludeTag";
import { mergeTypographyFontFamily } from "./utils/index";

const scriptChoices = ["sub", "super"];

export default function (v, onChange) {
  return { getItems: getItems(v, onChange) };
}

const dependenciesOption = (v, onChange) => {
  return v.textPopulation
    ? {}
    : {
        dependencies: (data) => {
          "tag" in data
            ? onChange(getBlockTag(data.tag))
            : onChange(mergeTypographyFontFamily(data));
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
  ({ device, component, context, editorMode }) => {
    const config = component.getGlobalConfig();

    const _isStory = isStory(editorMode);
    const _isPopup = isPopup(editorMode);
    const inPopup = Boolean(component.props.meta?.sectionPopup);
    const inPopup2 = Boolean(component.props.meta?.sectionPopup2);
    const isPopulationBlock = v.population && v.population.display === "block";

    let disablePopup;
    if (device === "desktop") {
      disablePopup = inPopup || inPopup2 || _isPopup;
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

    const linkDC = getDynamicContentOption({
      options: context.dynamicContent.config,
      type: DCTypes.link
    });

    const linkPopup = v.linkPopup;

    const disableAiText =
      !!v.population ||
      !!v.textPopulation ||
      typeof config?.api?.textAI?.handler !== "function";

    const {
      internalLink,
      linkPopup: linkPopupEnabled,
      linkAnchor,
      linkExternal,
      linkUpload
    } = getEnabledLinkOptions(config);

    const isDisabledLinkUpload = !config.pro || !linkUpload;

    return [
      {
        id: "aiText",
        type: "popover",
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
            type: "aiText",
            isPro: true,
            selectedValue: v.selectedValue,
            devices: "desktop"
          }
        ],
        disabled: disableAiText
      },
      {
        id: "toolbarFont",
        type: "popover",
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
            type: "tabs",
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
                    type: "grid",
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
                            type: "typography",
                            config: {
                              fontFamily: "desktop" === device,
                              scriptChoices
                            },
                            dependencies: (data) =>
                              onChange(patchTextTransform(data, device, v))
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
                            type: "population",
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
                    type: "grid",
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
                            type: "typography",
                            config: {
                              fontFamily: "desktop" === device,
                              scriptChoices
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
                            type: "population",
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
                    type: "grid",
                    disabled: disableHeadingTags(v, "h2"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h2",
                            type: "typography",
                            config: {
                              fontFamily: "desktop" === device,
                              scriptChoices
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
                            type: "population",
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
                    type: "grid",
                    disabled: disableHeadingTags(v, "h3"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h3",
                            type: "typography",
                            config: {
                              fontFamily: "desktop" === device,
                              scriptChoices
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
                            type: "population",
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
                    type: "grid",
                    disabled: disableHeadingTags(v, "h4"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h4",
                            type: "typography",
                            config: {
                              fontFamily: "desktop" === device,
                              scriptChoices
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
                            type: "population",
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
                    type: "grid",
                    disabled: disableHeadingTags(v, "h5"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h5",
                            type: "typography",
                            config: {
                              fontFamily: "desktop" === device,
                              scriptChoices
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
                            type: "population",
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
                    type: "grid",
                    disabled: disableHeadingTags(v, "h6"),
                    columns: [
                      {
                        id: "col-1",
                        size: 1,
                        align: "center",
                        options: [
                          {
                            id: "h6",
                            type: "typography",
                            config: {
                              fontFamily: "desktop" === device,
                              scriptChoices
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
                            type: "population",
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
      getColorToolbar(
        { ...v, isPopulationBlock },
        { device, component, context },
        onChange,
        config
      ),
      // is needed to disabled wrapper align
      {
        id: "horizontalAlign",
        type: "toggle",
        disabled: true
      },
      {
        // put a different id to not conflict with `horizontalAlign` from Wrapper
        id: "contentHorizontalAlign",
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
        ...dependencies
      },
      {
        id: "list",
        type: "toggle",
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
        id: "toolbarLink",
        type: "popover",
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
                disabled: !internalLink,
                options: [
                  {
                    id: "linkPage",
                    type: "internalLink",
                    label: t("Find Page"),
                    dependencies: (value) =>
                      v.textPopulation
                        ? value
                        : onChange(handleChangeLink(v, value))
                  },
                  {
                    id: "linkInternalBlank",
                    label: t("Open In New Tab"),
                    type: "switch",
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkInternalBlank }) =>
                            onChange(handleChangeLink(v, { linkInternalBlank }))
                        })
                  }
                ]
              },
              {
                id: "external",
                label: t("URL"),
                disabled: !linkExternal,
                options: [
                  {
                    id: "link",
                    type: "population",
                    label: t("Link to"),
                    config: linkDC,
                    option: {
                      id: "linkExternal",
                      type: "inputText",
                      placeholder: "http://",
                      config: {
                        size: "medium"
                      }
                    },
                    dependencies: (value) => ({
                      ...value,
                      linkExternalType: value.linkPopulation
                        ? "linkPopulation"
                        : "linkExternal"
                    })
                  },
                  {
                    id: "linkExternalBlank",
                    type: "switch",
                    label: t("Open In New Tab"),
                    disabled: device !== "desktop",
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkExternalBlank }) =>
                            onChange(handleChangeLink(v, { linkExternalBlank }))
                        })
                  },
                  {
                    id: "linkExternalRel",
                    type: "switch",
                    label: t("Make it Nofollow"),
                    disabled: device !== "desktop",
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkExternalRel }) =>
                            onChange(handleChangeLink(v, { linkExternalRel }))
                        })
                  }
                ]
              },
              {
                id: "anchor",
                label: t("Block"),
                disabled: !linkAnchor,
                options: [
                  {
                    ...toolbarLinkAnchor({ v }),
                    disabled: device !== "desktop" || _isPopup || _isStory,
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkAnchor }) =>
                            onChange(handleChangeLink(v, { linkAnchor }))
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
                    type: "fileUpload",
                    disabled: isDisabledLinkUpload,
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkUpload }) =>
                            onChange(handleChangeLink(v, { linkUpload }))
                        })
                  }
                ]
              },
              {
                id: "popup",
                label: t("Popup"),
                disabled: !linkPopupEnabled,
                options: [
                  {
                    id: "linkPopup",
                    type: "promptAddPopup",
                    label: t("Popup"),
                    config: {
                      popupKey: `${component.getId()}_${linkPopup}`,
                      canDelete: device === "desktop"
                    },
                    disabled: disablePopup || _isStory,
                    ...(v.textPopulation
                      ? {}
                      : {
                          dependencies: ({ linkPopup, linkPopupPopups }) =>
                            onChange({
                              ...handleChangeLink(v, { linkPopup }),
                              popups: linkPopupPopups
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
                    type: "number",
                    label: t("Slide"),
                    disabled: !_isStory,
                    config: {
                      min: 1,
                      max: 1000000
                    },
                    dependencies: ({ linkToSlide }) =>
                      onChange(handleChangeLink(v, { linkToSlide }))
                  }
                ]
              }
            ],
            ...(v.textPopulation
              ? {}
              : {
                  dependencies: ({ linkType }) => {
                    onChange(handleChangeLink(v, { linkType }));
                  }
                })
          }
        ]
      },
      {
        id: "advancedSettings",
        type: "advancedSettings",
        disabled: !v.textPopulation,
        title: t("Settings"),
        devices: "desktop",
        position: 110
      },
      {
        id: "toolbarSettings",
        type: "popover",
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
            type: "slider",
            disabled: _isStory,
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
            type: "slider",
            disabled: _isStory,
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
            type: "select",
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
            type: "grid",
            config: {
              separator: true
            },
            columns: [
              {
                size: 1,
                options: [
                  {
                    id: "styles",
                    type: "sidebarTabsButton",
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
                    type: "sidebarTabsButton",
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
