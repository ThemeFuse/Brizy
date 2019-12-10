// ToDo.. De ce ColorFields accepta 2 valori HEX si Opacity eu cerd ca e nevoie doar de HEX opacity nu e nevoie de el
import { onChangeDependeciesGrouped } from "./onChange";
import { defaultValueValue } from "./device";

export function onChangeElementSectionBoxShadowHexAndOpacityDependencies({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  const dependencies = {
    boxShadowBlur: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowVertical: {
      childs: [],
      nullValue: [],
      tempValue: []
    }
  };

  opacity = onChangeBoxShadowOpacity({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: opacity,
    dependencies
  });
}

function onChangeBoxShadowOpacity({ v, device, state, opacity, isChanged }) {
  return isChanged === "hex" &&
    defaultValueValue({ v, key: "boxShadowColorOpacity", device, state }) === 0
    ? defaultValueValue({ v, key: "tempBoxShadowColorOpacity", device, state })
    : opacity === undefined
    ? defaultValueValue({ v, key: "boxShadowColorOpacity", device, state })
    : opacity;
}
