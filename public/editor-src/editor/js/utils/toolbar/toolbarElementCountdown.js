import { t } from "visual/utils/i18n";
import _ from "underscore";

export function toolbarElementCountdownDate({ v }) {
  return {
    id: "date",
    label: t("Date"),
    type: "input",
    inputSize: "medium",
    placeholder: "dd/mm/yyyy",
    value: {
      value: v.date
    },
    onChange: ({ value: date }) => ({
      date
    })
  };
}

export function toolbarElementCountdownHour({ v }) {
  return {
    id: "hours",
    type: "select",
    label: t("Hour"),
    choices: _.times(24, index => {
      const hour = (index + 12) % 12 || 12;
      const suffix = index >= 12 ? "pm" : "am";

      return {
        title: `${hour} ${suffix}`,
        value: `${hour} ${suffix}`
      };
    }),
    value: v.hours
  };
}

export function toolbarElementCountdownMinute({ v }) {
  return {
    id: "minutes",
    type: "select",
    label: t("Minutes"),
    choices: _.times(6, index => {
      const current = index * 10;
      return {
        title: `${index}0 m`,
        value: current
      };
    }),
    value: v.minutes
  };
}

export function toolbarElementCountdownTimeZone({ v }) {
  return {
    id: "timeZone",
    label: t("Time Zone"),
    type: "select",
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
        title: t("+ 6:00 (Astana)")
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
        title: t("+ 10:00 (Sidney, Melbourne)")
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
    value: v.timeZone
  };
}

export function toolbarElementCountdownLanguage({ v }) {
  return {
    id: "language",
    label: t("Language"),
    type: "select",
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
    value: v.language
  };
}
