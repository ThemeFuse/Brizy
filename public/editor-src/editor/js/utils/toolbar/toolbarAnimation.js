import { t } from "visual/utils/i18n";
import { getAnimations } from "visual/utils/options/getAnimations";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarEntranceAnimation({
  v,
  position = 60,
  device,
  state,
  choices = getAnimations(),
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: "animation",
    type: "group-dev",
    position,
    devices,
    options: [
      {
        id: dvk("animationName"),
        label: t("Entrance Animation"),
        type: "select",
        choices: choices,
        value:
          dvv("animationName") === "initial"
            ? dvv("tempAnimationName")
            : dvv("animationName"),
        onChange: animationName => ({
          [dvk("animationName")]: animationName,
          [dvk("tempAnimationName")]: animationName
        })
      },
      {
        id: dvk("animationDuration"),
        label: t("Duration"),
        type: "slider",
        disabled:
          dvv("animationName") === "none" && dvv("animationName") !== "initial",
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
          choices: [{ title: "s", value: "s" }]
        },
        value: {
          value: dvv("animationDuration") / 1000
        },
        onChange: ({ value: animationDuration }, { sliderDragEnd }) => {
          return {
            [dvk("animationName")]: sliderDragEnd
              ? dvv("tempAnimationName")
              : "initial",
            [dvk("animationDuration")]: animationDuration * 1000
          };
        }
      },
      {
        id: dvk("animationDelay"),
        label: t("Delay"),
        type: "slider",
        disabled:
          dvv("animationName") === "none" && dvv("animationName") !== "initial",
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
          choices: [{ title: "s", value: "s" }]
        },
        value: {
          value: dvv("animationDelay") / 1000
        },
        onChange: ({ value: animationDelay }, { sliderDragEnd }) => {
          return {
            [dvk("animationName")]: sliderDragEnd
              ? dvv("tempAnimationName")
              : "initial",
            [dvk("animationDelay")]: animationDelay * 1000
          };
        }
      }
    ]
  };
}
