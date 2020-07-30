import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarGradientRange({ v, device, state, disabled }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const { hex: gradientColorHex } = getOptionColorHexByPalette(
    dvv("gradientColorHex"),
    dvv("gradientColorPalette")
  );

  return {
    id: dvk("bgGradient"),
    type: "range",
    disabled,
    value: {
      startPointer: dvv("gradientStartPointer"),
      finishPointer: dvv("gradientFinishPointer"),
      activePointer: dvv("gradientActivePointer"),
      bgColorHex,
      gradientColorHex
    },
    onChange: ({ startPointer, finishPointer, activePointer }) => {
      return {
        [dvk("gradientStartPointer")]: startPointer,
        [dvk("gradientFinishPointer")]: finishPointer,
        [dvk("gradientActivePointer")]: activePointer
      };
    }
  };
}

export function toolbarGradientType({
  v,
  device,
  state,
  states,
  devices = "all",
  className,
  disabled
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("gradientType"),
    type: "select",
    devices,
    states,
    disabled,
    className,
    choices: [
      {
        title: t("Linear"),
        value: "linear"
      },
      {
        title: t("Radial"),
        value: "radial"
      }
    ],
    value: dvv("gradientType")
  };
}

export function toolbarGradientLinearDegree({
  v,
  device,
  state,
  states,
  devices = "all",
  disabled
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("gradientLinearDegree"),
    type: "inputNumber",
    className: "brz-ed-grid__gradient__size",
    devices,
    states,
    disabled,
    min: 0,
    max: 360,
    value: dvv("gradientLinearDegree")
  };
}

export function toolbarGradientRadialDegree({
  v,
  device,
  state,
  states,
  devices = "all",
  disabled
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("gradientRadialDegree"),
    type: "inputNumber",
    className: "brz-ed-grid__gradient__degree",
    devices,
    states,
    disabled,
    min: 0,
    max: 1000,
    value: dvv("gradientRadialDegree")
  };
}
