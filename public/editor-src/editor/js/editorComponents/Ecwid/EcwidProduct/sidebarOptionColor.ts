import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { optionColorItemSelector, optionColorTooltipSelector } from "./css";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = () => [
  {
    id: "sidebarTabs",
    type: "sidebarTabs",
    tabs: [
      {
        id: "styles",
        title: t("Styling"),
        label: t("Styling"),
        options: [
          {
            id: "optionColorBorder",
            type: "corners",
            label: t("Corner"),
            selector: `${optionColorItemSelector} .options-swatches-item__color, ${optionColorItemSelector} .options-swatches-item__color .options-swatches-item__color--selected`
          },
          {
            id: "optionColorTooltipBorder",
            type: "corners",
            label: t("Corner Tooltip"),
            selector: optionColorTooltipSelector
          }
        ]
      }
    ]
  }
];
