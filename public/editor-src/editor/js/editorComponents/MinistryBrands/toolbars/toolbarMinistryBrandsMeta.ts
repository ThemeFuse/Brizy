import { ElementModel } from "visual/component/Elements/Types";
import { Params } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { capByPrefix } from "visual/utils/string";
import { getMetaPrefixKey } from "../utils/helpers";

export const getItems = <
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
>(
  data: Params<M, P, S>
): ToolbarItemType[] => {
  const { v, device } = data;
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const metaPrefixKey = getMetaPrefixKey(dvv("metaPrefixKey")) ?? "";
  const color = getColorToolbar(
    dvv(capByPrefix(metaPrefixKey, "ColorPalette")),
    dvv(capByPrefix(metaPrefixKey, "ColorHex")),
    dvv(capByPrefix(metaPrefixKey, "ColorOpacity"))
  );

  return [
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: metaPrefixKey,
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: color
          }
        }
      },
      position: 80,
      options: [
        {
          id: capByPrefix(metaPrefixKey, "Color"),
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
};
