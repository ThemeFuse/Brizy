import { t } from "visual/utils/i18n";

export function toolbarElementCounterStart({ v }) {
  return {
    id: "start",
    label: t("Start"),
    type: "input",
    inputType: "number",
    inputSize: "small",
    value: {
      value: v.start
    },
    onChange: ({ value: start }) => ({
      start
    })
  };
}

export function toolbarElementCounterEnd({ v }) {
  return {
    id: "end",
    label: t("End"),
    type: "input",
    inputType: "number",
    inputSize: "small",
    value: {
      value: v.end
    },
    onChange: ({ value: end }) => ({
      end: end !== "" ? end : 0
    })
  };
}

export function toolbarElementCounterDuration({ v }) {
  return {
    id: "duration",
    label: t("Duration"),
    type: "slider",
    slider: {
      min: 0,
      step: 0.5,
      max: 25
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "sec",
          value: "sec"
        }
      ]
    },
    value: {
      value: v.duration
    },
    onChange: ({ value: duration }) => {
      return {
        duration
      };
    }
  };
}
