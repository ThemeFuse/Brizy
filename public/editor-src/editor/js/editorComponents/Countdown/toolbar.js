import { hexToRgba } from "visual/utils/color";
import _ from "underscore";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";

import { t } from "visual/utils/i18n";

export function getItems({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const timeZoneChoices = [
    { value: "660", title: t("- 11:00 (Niue)") },
    { value: "600", title: t("- 10:00 (Honolulu, Papeete)") },
    { value: "540", title: t("- 9:00 (Anchorage)") },
    { value: "480", title: t("- 8:00 (Los Angeles)") },
    { value: "420", title: t("- 7:00 (Denver, Phoenix)") },
    { value: "360", title: t("- 6:00 (Chicago, Dallas)") },
    { value: "300", title: t("- 5:00 (New York, Miami)") },
    { value: "240", title: t("- 4:00 (Halifax, Manaus)") },
    { value: "180", title: t("- 3:00 (Brasilia, Santiago)") },
    { value: "120", title: t("- 2:00 (Noronha)") },
    { value: "60", title: t("- 1:00 (Cape Verde)") },
    { value: "0", title: t("00:00 (London, Dublin)") },
    { value: "-60", title: t("+ 1:00 (Berlin, Paris)") },
    { value: "-120", title: t("+ 2:00 (Athens, Istanbul)") },
    { value: "-180", title: t("+ 3:00 (Moscow, Baghdad)") },
    { value: "-240", title: t("+ 4:00 (Dubai, Baku)") },
    { value: "-300", title: t("+ 5:00 (Yekaterinburg)") },
    { value: "-360", title: t("+ 6:00 (Nur-Sultan)") },
    { value: "-420", title: t("+ 7:00 (Bangkok, Jakarta)") },
    { value: "-480", title: t("+ 8:00 (Singapore, Beijing)") },
    { value: "-540", title: t("+ 9:00 (Tokyo, Seoul)") },
    { value: "-600", title: t("+ 10:00 (Sydney, Melbourne)") },
    { value: "-660", title: t("+ 11:00 (Ponape)") },
    { value: "-720", title: t("+ 12:00 (Auckland)") }
  ];

  const languageChoices = [
    { title: t("German"), value: "de" },
    { title: t("English"), value: "en" },
    { title: t("Spanish"), value: "es" },
    { title: t("French"), value: "fr" },
    { title: t("Italian"), value: "it" },
    { title: t("Dutch"), value: "nl" },
    { title: t("Russian"), value: "ru" }
  ];

  return [
    {
      id: "toolbarCountdown",
      type: "popover-dev",
      config: {
        icon: "nc-countdown",
        title: t("Countdown")
      },
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
        {
          id: "hours",
          type: "select-dev",
          label: t("Hour"),
          devices: "desktop",
          choices: _.times(24, index => {
            const hour = (index + 12) % 12 || 12;
            const suffix = index >= 12 ? "pm" : "am";

            return {
              title: `${hour} ${suffix}`,
              value: `${hour} ${suffix}`
            };
          })
        },
        {
          id: "minutes",
          type: "select-dev",
          devices: "desktop",
          label: t("Minutes"),
          choices: _.times(6, index => {
            const current = index * 10;
            return {
              title: `${index}0 m`,
              value: current
            };
          })
        },
        {
          id: "timeZone",
          label: t("Time Zone"),
          type: "select-dev",
          devices: "desktop",
          choices: timeZoneChoices
        },
        {
          id: "language",
          label: t("Language"),
          type: "select-dev",
          devices: "desktop",
          choices: languageChoices
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, v.colorOpacity)
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "color",
          type: "colorPicker-dev"
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
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
