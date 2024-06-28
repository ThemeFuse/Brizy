import { ElementModel } from "visual/component/Elements/Types";
import { Params } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export const getItems = <
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
>({
  v,
  device
}: Params<M, P, S>): ToolbarItemType[] => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: metaLinksColorHex } = getOptionColorHexByPalette(
    dvv("metaLinksColorHex"),
    dvv("metaLinksColorPalette")
  );
  return [
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              metaLinksColorHex,
              dvv("metaLinksColorOpacity")
            )
          }
        }
      },
      position: 80,
      options: [
        {
          id: "metaLinksColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "advancedSettings",
      // @ts-expect-error "advancedSettings" old options
      type: "legacy-advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
};
