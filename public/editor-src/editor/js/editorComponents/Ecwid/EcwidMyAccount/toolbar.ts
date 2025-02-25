import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const parentBgColor = getColorToolbar(
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
};
