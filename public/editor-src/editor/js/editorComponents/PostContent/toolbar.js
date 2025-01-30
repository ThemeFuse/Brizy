import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";

export function getItems({ v, device, context, component }) {
  const config = component.getGlobalConfig();

  const activeChoice = config.contentDefaults.PostContent.textPopulation;
  const disablePredefinedPopulation =
    config.elements?.postContent?.predefinedPopulation === false;
  const predefinedChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const color = getColorToolbar(
    dvv("paragraphColorPalette"),
    dvv("paragraphColorHex"),
    dvv("paragraphColorOpacity")
  );

  return [
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabTypographyParagraph",
              label: "P",
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  config: { separator: true },
                  columns: [
                    {
                      id: "col-1",
                      size: 1,
                      align: "center",
                      options: [
                        {
                          id: "paragraph",
                          type: "typography",
                          config: {
                            fontFamily: device === "desktop"
                          }
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "1",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          devices: "desktop",
                          disabled:
                            disablePredefinedPopulation || !activeChoice,
                          type: "predefinedPopulation",
                          config: {
                            activeChoice,
                            choices: predefinedChoices
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabTypographyH1",
              label: "H1",
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  config: { separator: true },
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
                            fontFamily: device === "desktop"
                          }
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "1",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          devices: "desktop",
                          type: "predefinedPopulation",
                          disabled:
                            disablePredefinedPopulation || !activeChoice,
                          config: {
                            activeChoice,
                            choices: predefinedChoices
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabTypographyH2",
              label: "H2",
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  config: { separator: true },
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
                            fontFamily: device === "desktop"
                          }
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "1",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          devices: "desktop",
                          type: "predefinedPopulation",
                          disabled:
                            disablePredefinedPopulation || !activeChoice,
                          config: {
                            activeChoice,
                            choices: predefinedChoices
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabTypographyH3",
              label: "H3",
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  config: { separator: true },
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
                            fontFamily: device === "desktop"
                          }
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "1",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          devices: "desktop",
                          type: "predefinedPopulation",
                          disabled:
                            disablePredefinedPopulation || !activeChoice,
                          config: {
                            activeChoice,
                            choices: predefinedChoices
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabTypographyH4",
              label: "H4",
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  config: { separator: true },
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
                            fontFamily: device === "desktop"
                          }
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "1",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          devices: "desktop",
                          type: "predefinedPopulation",
                          disabled:
                            disablePredefinedPopulation || !activeChoice,
                          config: {
                            activeChoice,
                            choices: predefinedChoices
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabTypographyH5",
              label: "H5",
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  config: { separator: true },
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
                            fontFamily: device === "desktop"
                          }
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "1",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          devices: "desktop",
                          type: "predefinedPopulation",
                          disabled:
                            disablePredefinedPopulation || !activeChoice,
                          config: {
                            activeChoice,
                            choices: predefinedChoices
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabTypographyH6",
              label: "H6",
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  config: { separator: true },
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
                            fontFamily: device === "desktop"
                          }
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "1",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          devices: "desktop",
                          type: "predefinedPopulation",
                          disabled:
                            disablePredefinedPopulation || !activeChoice,
                          config: {
                            activeChoice,
                            choices: predefinedChoices
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
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: color
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabParagraph",
              label: "P",
              options: [
                {
                  id: "paragraphColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabH1",
              label: "H1",
              options: [
                {
                  id: "h1Color",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabH2",
              label: "H2",
              options: [
                {
                  id: "h2Color",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabH3",
              label: "H3",
              options: [
                {
                  id: "h3Color",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabH4",
              label: "H4",
              options: [
                {
                  id: "h4Color",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabH5",
              label: "H5",
              options: [
                {
                  id: "h5Color",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabH6",
              label: "H6",
              options: [
                {
                  id: "h6Color",
                  type: "colorPicker"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "contentHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop"
    }
  ];
}
