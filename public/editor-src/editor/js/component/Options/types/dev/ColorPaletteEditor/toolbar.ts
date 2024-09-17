import { t } from "visual/utils/i18n";
import { Color } from "./types";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";

export const getToolbarItems = (
  value: Color,
  onChange: (v: Color) => void
): OptionDefinition[] => [
  {
    id: "settings",
    type: "popover",
    icon: "nc-cog",
    display: "inline",
    // @ts-expect-error old options hasn't config
    config: {
      onOpenDirect: true,
      title: t("Color")
    },
    position: 90,
    options: [
      {
        id: "backgroundColor",
        type: "colorPicker",
        label: t("Color HEX"),
        config: {
          opacity: false,
          isPaletteHidden: true
        },
        value: {
          hex: value.hex
        },
        onChange,
        className: "brz-ed-option__colorPicker__global__styles"
      }
    ]
  }
];
