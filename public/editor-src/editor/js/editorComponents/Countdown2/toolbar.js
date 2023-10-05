import _ from "underscore";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state, context }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const { hex: numberColor } = getOptionColorHexByPalette(
    dvv("numberColorHex"),
    dvv("numberColorPalette")
  );
  const noBorder =
    dvv("bgColorOpacity") === 0 && dvv("borderColorOpacity") === 0;

  const style = dvv("style");
  const actions = dvv("actions");

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });
  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  const IS_STORY = isStory(Config.getAll());

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
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabTimerElementTimer",
              label: t("Timer"),
              options: [
                {
                  id: "style",
                  label: t("Styles"),
                  type: "radioGroup-dev",
                  position: 20,
                  devices: "desktop",
                  choices: [
                    { value: "style1", icon: "nc-countdown-style1" },
                    { value: "style2", icon: "nc-countdown-style2" },
                    { value: "style3", icon: "nc-countdown-style3" }
                  ]
                },
                {
                  id: "date",
                  label: t("Date"),
                  type: "inputText-dev",
                  devices: "desktop",
                  placeholder: "dd/mm/yyyy",
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                },
                {
                  id: "hours",
                  label: t("Hour"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: _.times(24, (index) => {
                    const hour = (index + 12) % 12 || 12;
                    const suffix = index >= 12 ? "pm" : "am";
                    return {
                      title: `${hour} ${suffix}`,
                      value: `${hour} ${suffix}`
                    };
                  }),
                  population: richTextDC
                },
                {
                  id: "minutes",
                  label: t("Minutes"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: _.times(6, (index) => {
                    const current = index * 10;

                    return {
                      title: `${index}0 m`,
                      value: current
                    };
                  }),
                  population: richTextDC
                },
                {
                  id: "timeZone",
                  label: t("Time Zone"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      value: 720,
                      title: t("- 12:00 (International Date Line West)")
                    },
                    { value: 660, title: t("- 11:00 (Niue)") },
                    {
                      value: 600,
                      title: t("- 10:00 (Honolulu, Papeete, Hawaii)")
                    },
                    { value: 580, title: t("- 9:30 (Marquesas)") },
                    { value: 540, title: t("- 9:00 (Anchorage, Alaska)") },
                    { value: 480, title: t("- 8:00 (Los Angeles)") },
                    { value: 420, title: t("- 7:00 (Denver, Phoenix)") },
                    { value: 360, title: t("- 6:00 (Chicago, Dallas)") },
                    { value: 300, title: t("- 5:00 (New York, Miami)") },
                    { value: 270, title: t("- 4:30 (Caracas)") },
                    {
                      value: 240,
                      title: t("- 4:00 (Halifax, Manaus, Santiago)")
                    },
                    { value: 210, title: t("- 3:30 (Newfoundland)") },
                    {
                      value: 180,
                      title: t("- 3:00 (Brasilia, Santiago, Argentina)")
                    },
                    { value: 150, title: t("- 2:30 (Newfoundland Daylight)") },
                    { value: 120, title: t("- 2:00 (Noronha)") },
                    { value: 60, title: t("- 1:00 (Cape Verde)") },
                    { value: 0, title: t("00:00 (London, Dublin)") },
                    {
                      value: -60,
                      title: t("+ 1:00 (Berlin, Paris, Morocco, Netherlands)")
                    },
                    {
                      value: -120,
                      title: t("+ 2:00 (Athens, Istanbul, Romania)")
                    },
                    { value: -180, title: t("+ 3:00 (Moscow, Baghdad)") },
                    { value: -210, title: t("+ 3:30 (Iran)") },
                    { value: -240, title: t("+ 4:00 (Dubai, Baku)") },
                    {
                      value: -270,
                      title: t("+ 4:30 (Afghanistan, Kabul, Tehran)")
                    },
                    {
                      value: -300,
                      title: t("+ 5:00 (Yekaterinburg, Baku, Karachi)")
                    },
                    { value: -330, title: t("+ 5:30 (India)") },
                    { value: -345, title: t("+ 5:45 (Kathmandu, Nepal)") },
                    {
                      value: -360,
                      title: t("+ 6:00 (Nur-Sultan, Kyrgyzstan)")
                    },
                    { value: -390, title: t("+ 6:30 (Yangon)") },
                    {
                      value: -420,
                      title: t("+ 7:00 (Bangkok, Jakarta, Vietnam)")
                    },
                    {
                      value: -480,
                      title: t("+ 8:00 (Singapore, Beijing, Malaysia)")
                    },
                    { value: -510, title: t("+ 8:30 (Pyongyang)") },
                    { value: -540, title: t("+ 9:00 (Tokyo, Seoul)") },
                    { value: -570, title: t("+ 9:30 (Darwin, Adelaide)") },
                    {
                      value: -600,
                      title: t("+ 10:00 (Sydney, Melbourne, Canberra)")
                    },
                    { value: -630, title: t("+ 10:30 (Lord Howe Island)") },
                    { value: -660, title: t("+ 11:00 (Ponape)") },
                    { value: -720, title: t("+ 12:00 (Auckland, Magadan)") },
                    { value: -780, title: t("+ 13:00 (Tongatapu)") }
                  ]
                }
              ]
            },
            {
              id: "tabCurrentElementAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "showDays",
                  label: t("Days"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showHours",
                  label: t("Hours"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showMinutes",
                  label: t("Minutes"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showSeconds",
                  label: t("Seconds"),
                  type: "switch-dev",
                  devices: "desktop"
                }
              ]
            }
          ]
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
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabsTypographyNumber",
              label: t("Number"),
              options: [
                {
                  id: "number",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  }
                }
              ]
            },
            {
              id: "tabsTypographyTitle",
              label: t("Title"),
              options: [
                {
                  id: "title",
                  disabled: style === "style3",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  }
                }
              ]
            },
            {
              id: "tabsTypographyMessage",
              label: t("Message"),
              options: [
                {
                  id: "message",
                  disabled: actions !== "showMessage",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  }
                }
              ]
            }
          ]
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
            backgroundColor: hexToRgba(numberColor, dvv("numberColorOpacity"))
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabNumber",
              label: t("Nr."),
              options: [
                {
                  id: "numberColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker-dev",
                  disabled: style === "style3",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabMessage",
              label: t("Message"),
              options: [
                {
                  id: "messageColor",
                  type: "colorPicker-dev",
                  disabled: actions !== "showMessage",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        title: t("Link"),
        size: "medium"
      },
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "linkAction",
              label: t("Action"),
              options: [
                {
                  id: "actions",
                  label: t("When Finished"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("None"), value: "none" },
                    { title: t("Hide"), value: "hide" },
                    { title: t("Show message"), value: "showMessage" }
                  ]
                },
                {
                  id: "messageText",
                  label: t("Message"),
                  type: "inputText-dev",
                  disabled: dvv("actions") != "showMessage",
                  placeholder: t("Message sent"),
                  population: richTextDC,
                  devices: "desktop"
                }
              ]
            },
            {
              id: "redirect",
              label: t("Redirect"),
              options: [
                {
                  id: "messageRedirect",
                  label: t("URL"),
                  type: "inputText-dev",
                  devices: "desktop",
                  placeholder: "http://",
                  population: linkDC
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          disabled: IS_STORY,
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          disabled: noBorder && !IS_STORY,
          config: {
            min: dvv("heightSuffix") === "%" ? 5 : 50,
            max: 300,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "spacing",
          label: t("Spacing"),
          type: "slider-dev",
          disabled: noBorder,
          config: {
            min: 0,
            max: 50,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
