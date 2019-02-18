import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarGradientRange({ v, device, state, disabled }) {
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device, state }),
    defaultValueValue({ v, key: "bgColorPalette", device, state })
  );

  const { hex: gradientColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "gradientColorHex", device, state }),
    defaultValueValue({ v, key: "gradientColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "bgGradient", device, state }),
    type: "range",
    disabled,
    value: {
      startPointer: defaultValueValue({
        v,
        key: "gradientStartPointer",
        device,
        state
      }),
      finishPointer: defaultValueValue({
        v,
        key: "gradientFinishPointer",
        device,
        state
      }),
      activePointer: defaultValueValue({
        v,
        key: "gradientActivePointer",
        device,
        state
      }),
      bgColorHex,
      gradientColorHex
    },
    onChange: ({ startPointer, finishPointer, activePointer }) => {
      return {
        [defaultValueKey({
          key: "gradientStartPointer",
          device,
          state
        })]: startPointer,
        [defaultValueKey({
          key: "gradientFinishPointer",
          device,
          state
        })]: finishPointer,
        [defaultValueKey({
          key: "gradientActivePointer",
          device,
          state
        })]: activePointer
      };
    }
  };
}

export function toolbarGradientType({ v, device, state, className, disabled }) {
  return {
    id: defaultValueKey({ key: "gradientType", device, state }),
    type: "select",
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
    value: defaultValueValue({ v, key: "gradientType", device, state })
  };
}

export function toolbarGradientLinearDegree({ v, device, state, disabled }) {
  return {
    id: defaultValueKey({ key: "gradientLinearDegree", device, state }),
    type: "inputNumber",
    className: "brz-ed-grid__gradient__size",
    disabled,
    min: 0,
    max: 360,
    value: defaultValueValue({ v, key: "gradientLinearDegree", device, state })
  };
}

export function toolbarGradientRadialDegree({ v, device, state, disabled }) {
  return {
    id: defaultValueKey({ key: "gradientRadialDegree", device, state }),
    type: "inputNumber",
    className: "brz-ed-grid__gradient__degree",
    disabled,
    min: 0,
    max: 1000,
    value: defaultValueValue({ v, key: "gradientRadialDegree", device, state })
  };
}
