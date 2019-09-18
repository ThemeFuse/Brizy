import { t } from "visual/utils/i18n";
import _ from "underscore";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementCountdownDate({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "date", device, state }),
    label: t("Date"),
    type: "input",
    devices,
    inputSize: "medium",
    placeholder: "dd/mm/yyyy",
    value: {
      value: defaultValueValue({
        v,
        key: "date",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "date", device, state })]: value
    })
  };
}

export function toolbarElementCountdownHour({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "hours", device, state }),
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
    value: defaultValueValue({
      v,
      key: "hours",
      device,
      state
    })
  };
}

export function toolbarElementCountdownMinute({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "minutes", device, state }),
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
    value: defaultValueValue({
      v,
      key: "minutes",
      device,
      state
    })
  };
}

export function toolbarElementCountdownTimeZone({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "timeZone", device, state }),
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
    value: defaultValueValue({
      v,
      key: "timeZone",
      device,
      state
    })
  };
}

export function toolbarElementCountdownLanguage({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "language", device, state }),
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
    value: defaultValueValue({
      v,
      key: "language",
      device,
      state
    })
  };
}
