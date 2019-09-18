import { t } from "visual/utils/i18n";
import { getAnimations } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarEntranceAnimation({
  v,
  position = 60,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const getAnimationChoices = () => {
    if (dvv("animationName") !== "none" || dvv("animationName") === "initial") {
      const choices =
        dvv("animationName") === "initial"
          ? dvv("tempAnimationName")
          : dvv("animationName");
      return {
        [`${choices}`]: [
          {
            id: dvk("animationDuration"),
            label: t("Duration"),
            type: "slider",
            devices,
            slider: {
              min: 0,
              max: 5,
              step: 0.1
            },
            input: {
              show: true,
              min: 0
            },
            suffix: {
              show: true,
              choices: [
                {
                  title: "s",
                  value: "s"
                }
              ]
            },
            value: {
              value: dvv("animationDuration") / 1000
            },
            onChange: ({ value: animationDuration }, { sliderDragEnd }) => {
              return {
                animationName: sliderDragEnd
                  ? dvv("tempAnimationName")
                  : "initial",
                animationDuration: animationDuration * 1000
              };
            }
          },
          {
            id: dvk("animationDelay"),
            label: t("Delay"),
            type: "slider",
            slider: {
              min: 0,
              max: 5,
              step: 0.1
            },
            input: {
              show: true,
              min: 0
            },
            suffix: {
              show: true,
              choices: [
                {
                  title: "s",
                  value: "s"
                }
              ]
            },
            value: {
              value: dvv("animationDelay") / 1000
            },
            onChange: ({ value: animationDelay }, { sliderDragEnd }) => {
              return {
                animationName: sliderDragEnd
                  ? dvv("tempAnimationName")
                  : "initial",
                animationDelay: animationDelay * 1000
              };
            }
          }
        ]
      };
    }

    return { none: [] };
  };

  return {
    id: dvk("animation"),
    type: "multiPicker",
    position,
    picker: {
      id: dvk("animationName"),
      label: t("Entrance Animation"),
      type: "select",
      choices: getAnimations(),
      value:
        dvv("animationName") === "initial"
          ? dvv("tempAnimationName")
          : dvv("animationName"),
      onChange: animationName => ({
        animationName,
        tempAnimationName: animationName
      })
    },
    choices: getAnimationChoices()
  };
}
