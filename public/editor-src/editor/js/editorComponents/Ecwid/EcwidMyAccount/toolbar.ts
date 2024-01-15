import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
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

  const { hex: parentBgColorHex } = getOptionColorHexByPalette(
    dvv("parentBgColorHex"),
    dvv("parentBgColorPalette")
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
          id: "breadcrumbs",
          label: t("Breadcrumbs"),
          type: "switch"
        },
        {
          id: "signinLink",
          label: t("Sign in link"),
          type: "switch",
          disabled: dvv("footerDisplay") === "off"
        },
        {
          id: "footerDisplay",
          label: t("Footer"),
          type: "switch"
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
            backgroundColor: hexToRgba(
              parentBgColorHex,
              dvv("parentBgColorOpacity")
            )
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
      // @ts-expect-error old option
      type: "legacy-advancedSettings",
      devices: "desktop",
      position: 30,
      icon: "nc-cog",
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
