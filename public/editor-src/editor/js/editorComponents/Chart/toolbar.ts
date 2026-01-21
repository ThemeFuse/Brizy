import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { widthCSS } from "./css";
import { ChartType, Props, Value } from "./types";

const getMaxWidth = (device: string, unit: string) => {
  if (unit === "%") {
    return 100;
  }

  switch (device) {
    case "desktop":
      return 1200;
    case "tablet":
      return 738;
    case "mobile":
      return 400;
  }
};

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { chartType, chartPieItems, chartLineItems, chartBarItems } = v;

  const isLineChart = chartType === ChartType.line;
  const isPieChart = chartType === ChartType.pie;
  const isBarChart = chartType === ChartType.bar;

  const chartPieItemsLength = chartPieItems.length;
  const chartLineItemsLength = chartLineItems.length;
  const chartBarItemsLength = chartBarItems.length;

  const widthSuffix = dvv("widthSuffix");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "t2-chart",
        title: t("Parameters")
      },
      devices: "desktop",
      position: 60,
      options: [
        {
          id: "chartPieItems",
          type: "addable",
          devices: "desktop",
          disabled: !isPieChart,
          helper: {
            position: "bottom-start",
            content: t("Click on the button to edit the items.")
          },
          config: {
            title: t("Items"),
            sidebarHeadTitle: t("Chart Items"),
            addNewGroupTitle: t("Add New item"),
            optionGroupTitle: t("Item"),
            emptyMessage: t("You have no items yet"),
            className: "addable--chart",
            extraLabel: `${chartPieItemsLength} ${t("items")}`
          },
          shape: [
            {
              id: "color",
              type: "colorPicker",
              config: {
                isPaletteHidden: true
              }
            },
            {
              id: "value",
              type: "number",
              label: t("Value"),
              config: {
                max: 999999
              }
            }
          ]
        },
        {
          id: "chartBarItems",
          type: "addable",
          devices: "desktop",
          disabled: !isBarChart,
          config: {
            title: t("Items"),
            sidebarHeadTitle: t("Chart Items"),
            addNewGroupTitle: t("Add New item"),
            optionGroupTitle: t("Item"),
            emptyMessage: t("You have no items yet"),
            className: "addable--chart",
            extraLabel: `${chartBarItemsLength} ${t("items")}`
          },
          shape: [
            {
              id: "color",
              type: "colorPicker",
              placeholder: t("Color of item"),
              config: {
                isPaletteHidden: true
              }
            },
            {
              id: "value",
              type: "inputText",
              label: t("Values"),
              helper: {
                position: "bottom-start",
                content: t(
                  "Enter the values, separated by a comma ( Value1, Value2, ... )."
                )
              }
            }
          ]
        },
        {
          id: "chartLineItems",
          type: "addable",
          devices: "desktop",
          disabled: !isLineChart,
          config: {
            title: t("Items"),
            sidebarHeadTitle: t("Chart Items"),
            addNewGroupTitle: t("Add New item"),
            optionGroupTitle: t("Item"),
            emptyMessage: t("You have no items yet"),
            className: "addable--chart",
            extraLabel: `${chartLineItemsLength} ${t("items")}`
          },
          shape: [
            {
              id: "color",
              type: "colorPicker",
              placeholder: t("Color of item"),
              config: {
                isPaletteHidden: true
              }
            },
            {
              id: "value",
              type: "inputText",
              label: t("Values"),
              helper: {
                position: "bottom-start",
                content: t(
                  "Enter the values, separated by a comma ( Value1, Value2, ... )."
                )
              }
            }
          ]
        },
        {
          id: "chartType",
          type: "select",
          label: t("Types"),
          devices: "desktop",
          choices: [
            { title: t("Pie"), value: "pie" },
            { title: t("Bar"), value: "bar" },
            { title: t("Line"), value: "line" }
          ]
        },
        {
          id: "barLabel",
          type: "inputText",
          devices: "desktop",
          label: "Label",
          helper: {
            position: "bottom-start",
            content: t(
              "Enter the labels, separated by a comma ( Label1, Label2, ... )."
            )
          },
          placeholder: t("Labels of chart"),
          disabled: !isBarChart
        },
        {
          id: "lineLabel",
          type: "inputText",
          devices: "desktop",
          label: "Label",
          helper: {
            position: "bottom-start",
            content: t(
              "Enter the labels, separated by a comma ( Label1, Label2, ... )."
            )
          },
          placeholder: t("Labels of chart"),
          disabled: !isLineChart
        },
        {
          id: "fill",
          label: t("Fill"),
          type: "switch",
          disabled: !isLineChart
        },
        {
          id: "borderSize",
          label: t("Border"),
          type: "slider",
          config: {
            min: 1,
            max: 15,
            units: [{ value: "px", title: "px" }]
          },
          disabled: isPieChart
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Data Labels Typography")
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "dataLabelTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop",
            disabledFields: [
              "lineHeight",
              "fontSizeSuffix",
              "fontStyle",
              "letterSpacing",
              "strike",
              "underline"
            ]
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "auto",
        title: t("Border"),
        icon: {
          style: {
            backgroundColor: "#000000"
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border",
                  config: {
                    width: ["grouped"],
                    styles: ["solid"],
                    isPaletteHidden: true
                  },
                  disabled: !isPieChart
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: widthSuffix === "px" ? 100 : 1,
            max: getMaxWidth(device, widthSuffix),
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          },
          style: widthCSS
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
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
