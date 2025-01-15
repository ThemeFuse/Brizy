import { ElementModel } from "visual/component/Elements/Types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Params } from "../EditorComponent/types";
import { ToolbarItemType } from "../ToolbarItemType";

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
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const metaLinksColor = getColor(
    dvv("metaLinksColorPalette"),
    dvv("metaLinksColorHex"),
    dvv("metaLinksColorOpacity")
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
            backgroundColor: metaLinksColor
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
    }
  ];
};
