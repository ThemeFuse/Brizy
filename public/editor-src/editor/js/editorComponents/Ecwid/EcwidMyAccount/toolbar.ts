import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const parentBgColor = getColor(
    dvv("parentBgColorHex"),
    dvv("parentBgColorPalette"),
    dvv("parentBgColorOpacity")
  );
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: { title: t("My Account"), icon: "nc-user" },
      position: 10,
      devices: "desktop",
      options: [
        {
          id: "footerDisplay",
          label: t("Footer"),
          type: "switch"
        },
        {
          id: "signinLink",
          label: t("Sign in link"),
          type: "switch",
          disabled: dvv("footerDisplay") === "off"
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: parentBgColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "parent",
          type: "backgroundColor"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 30,
      title: t("Settings")
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    }
  ];
}
