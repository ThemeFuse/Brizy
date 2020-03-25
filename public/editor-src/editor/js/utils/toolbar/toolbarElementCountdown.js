import { t } from "visual/utils/i18n";
import _ from "underscore";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarElementCountdownDate({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("date"),
    label: t("Date"),
    type: "input",
    devices,
    inputSize: "medium",
    placeholder: "dd/mm/yyyy",
    value: {
      value: dvv("date")
    },
    onChange: ({ value }) => ({
      [dvk("date")]: value
    })
  };
}

export function toolbarElementCountdownHour({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("hours"),
    type: "select",
    label: t("Hour"),
    devices,
    choices: _.times(24, index => {
      const hour = (index + 12) % 12 || 12;
      const suffix = index >= 12 ? "pm" : "am";

      return {
        title: `${hour} ${suffix}`,
        value: `${hour} ${suffix}`
      };
    }),
    value: dvv("hours")
  };
}

export function toolbarElementCountdownMinute({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("minutes"),
    type: "select",
    devices,
    label: t("Minutes"),
    choices: _.times(6, index => {
      const current = index * 10;
      return {
        title: `${index}0 m`,
        value: current
      };
    }),
    value: dvv("minutes")
  };
}

export function toolbarElementCountdownTimeZone({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("timeZone"),
    label: t("Time Zone"),
    type: "select",
    devices,
    choices: [
      {
        value: "660",
        title: t("- 11:00 (Niue)")
      },
      {
        value: "600",
        title: t("- 10:00 (Honolulu, Papeete)")
      },
      {
        value: "540",
        title: t("- 9:00 (Anchorage)")
      },
      {
        value: "480",
        title: t("- 8:00 (Los Angeles)")
      },
      {
        value: "420",
        title: t("- 7:00 (Denver, Phoenix)")
      },
      {
        value: "360",
        title: t("- 6:00 (Chicago, Dallas)")
      },
      {
        value: "300",
        title: t("- 5:00 (New York, Miami)")
      },
      {
        value: "240",
        title: t("- 4:00 (Halifax, Manaus)")
      },
      {
        value: "180",
        title: t("- 3:00 (Brasilia, Santiago)")
      },
      {
        value: "120",
        title: t("- 2:00 (Noronha)")
      },
      {
        value: "60",
        title: t("- 1:00 (Cape Verde)")
      },
      {
        value: "0",
        title: t("00:00 (London, Dublin)")
      },
      {
        value: "-60",
        title: t("+ 1:00 (Berlin, Paris)")
      },
      {
        value: "-120",
        title: t("+ 2:00 (Athens, Istanbul)")
      },
      {
        value: "-180",
        title: t("+ 3:00 (Moscow, Baghdad)")
      },
      {
        value: "-240",
        title: t("+ 4:00 (Dubai, Baku)")
      },
      {
        value: "-300",
        title: t("+ 5:00 (Yekaterinburg)")
      },
      {
        value: "-360",
        title: t("+ 6:00 (Nur-Sultan)")
      },
      {
        value: "-420",
        title: t("+ 7:00 (Bangkok, Jakarta)")
      },
      {
        value: "-480",
        title: t("+ 8:00 (Singapore, Beijing)")
      },
      {
        value: "-540",
        title: t("+ 9:00 (Tokyo, Seoul)")
      },
      {
        value: "-600",
        title: t("+ 10:00 (Sydney, Melbourne)")
      },
      {
        value: "-660",
        title: t("+ 11:00 (Ponape)")
      },
      {
        value: "-720",
        title: t("+ 12:00 (Auckland)")
      }
    ],
    value: dvv("timeZone")
  };
}

export function toolbarElementCountdownLanguage({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("language"),
    label: t("Language"),
    type: "select",
    devices,
    choices: [
      {
        title: t("German"),
        value: "de"
      },
      {
        title: t("English"),
        value: "en"
      },
      {
        title: t("Spanish"),
        value: "es"
      },
      {
        title: t("French"),
        value: "fr"
      },
      {
        title: t("Italian"),
        value: "it"
      },
      {
        title: t("Dutch"),
        value: "nl"
      },
      {
        title: t("Russian"),
        value: "ru"
      }
    ],
    value: dvv("language")
  };
}

export function toolbarElementCountdown2Style({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("style"),
    label: t("Style"),
    type: "radioGroup",
    position: 20,
    devices,
    choices: [
      {
        value: "style1",
        icon: "nc-countdown-style1"
      },
      {
        value: "style2",
        icon: "nc-countdown-style2"
      },
      {
        value: "style3",
        icon: "nc-countdown-style3"
      }
    ],
    value: dvv("style")
  };
}

export function toolbarElementCountdown2Redirect({
  v,
  device,
  state,
  prefix = "",
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const message = dvk(capByPrefix(prefix, "messageRedirect"));

  return {
    devices,
    id: message,
    type: "input",
    label: t("Go to"),
    placeholder: "http://",
    value: {
      value: dvv(message)
    },
    onChange: ({ value }) => ({ [message]: value })
  };
}

export function toolbarElementCountdown2Actions({
  v,
  device,
  devices = "all",
  state,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const message = dvk(capByPrefix(prefix, "messageText"));

  return {
    type: "multiPicker",
    roles: ["admin"],
    devices,
    picker: {
      id: dvk("actions"),
      label: t("When Finished"),
      type: "select",
      devices,
      choices: [
        {
          title: t("None"),
          value: "none"
        },
        {
          title: t("Hide"),
          value: "hide"
        },
        {
          title: t("Show message"),
          value: "showMessage"
        }
      ],
      value: dvv("actions")
    },
    choices: {
      showMessage: [
        {
          devices,
          id: message,
          type: "input",
          label: t("Message"),
          placeholder: t("Message sent"),
          value: {
            value: dvv(message)
          },
          onChange: ({ value }) => ({ [message]: value })
        }
      ]
    }
  };
}
