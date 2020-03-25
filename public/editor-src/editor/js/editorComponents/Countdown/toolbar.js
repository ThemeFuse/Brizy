import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarElementCountdownHour,
  toolbarElementCountdownMinute,
  toolbarElementCountdownTimeZone,
  toolbarElementCountdownLanguage
} from "visual/utils/toolbar";

import { t } from "visual/utils/i18n";

export function getItems({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarCountdown",
      type: "popover",
      icon: "nc-countdown",
      title: t("Countdown"),
      position: 70,
      options: [
        {
          id: "date",
          label: t("Date"),
          type: "inputText-dev",
          config: {
            size: "medium",
            placeholder: "dd/mm/yyyy"
          },
          devices: "desktop"
        },
        toolbarElementCountdownHour({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        toolbarElementCountdownMinute({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        toolbarElementCountdownTimeZone({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        toolbarElementCountdownLanguage({
          v,
          device,
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: "color",
          type: "colorPicker-dev"
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          devices: "desktop"
        }
      ]
    }
  ];
}
