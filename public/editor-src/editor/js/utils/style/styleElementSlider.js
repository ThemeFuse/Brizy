import { capitalize } from "visual/utils/string";
import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { styleState } from "visual/utils/style";

export function styleElementSliderColor({ v, device, state, prefix }) {
  const upperPrefix = capitalize(prefix);

  state = styleState({ v, state });

  return state === "hover" && v[`hover${upperPrefix}ColorOpacity`] === 0
    ? hexToRgba(v[`${prefix}ColorHex`], v[`${prefix}ColorOpacity`])
    : hexToRgba(
        defaultValueValue({ v, key: `${prefix}ColorHex`, device, state }),
        defaultValueValue({ v, key: `${prefix}ColorOpacity`, device, state })
      );
}
