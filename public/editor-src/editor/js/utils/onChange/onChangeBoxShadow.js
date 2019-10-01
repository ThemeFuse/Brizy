// ToDo.. De ce ColorFields accepta 2 valori HEX si Opacity eu cerd ca e nevoie doar de HEX opacity nu e nevoie de el

import { onChangeDependeciesGrouped } from "./onChange";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeBoxShadowType2({ v, device, state, boxShadowType }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    [dvk("boxShadow")]: boxShadowType,
    [dvk("tempBoxShadow")]:
      boxShadowType !== "" ? boxShadowType : dvv("tempBoxShadow")
  };
}

export function onChangeBoxShadowTypeDependencies2({
  v,
  device,
  state,
  boxShadowType
}) {
  const dependencies = {
    boxShadowColorOpacity: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowColorPalette: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowBlur: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowSpread: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowVertical: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowHorizontal: {
      childs: [],
      nullValue: [],
      tempValue: []
    }
  };

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: boxShadowType,
    dependencies
  });
}

export function onChangeBoxShadowHexAndOpacity2({
  v,
  device,
  state,
  hex,
  opacity,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  opacity = onChangeBoxShadowOpacity2({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd ? opacity : dvv("tempBoxShadowColorOpacity");

  return {
    [dvk("boxShadowColorHex")]: hex,
    [dvk("boxShadowColorOpacity")]: opacity,
    [dvk("tempBoxShadowColorOpacity")]: tempOpacity
  };
}

export function onChangeBoxShadowHexAndOpacityPalette2({
  v,
  device,
  state,
  opacity,
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  opacity = onChangeBoxShadowOpacity2({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  const palette =
    isChanged === "hex" || opacity === 0
      ? ""
      : opacity > 0
      ? dvv("tempBoxShadowColorPalette")
      : dvv("boxShadowColorPalette");

  const tempPalette =
    isChanged === "hex" ? "" : dvv("tempBoxShadowColorPalette");

  return {
    [dvk("boxShadowColorPalette")]: palette,
    [dvk("tempBoxShadowColorPalette")]: tempPalette
  };
}

export function onChangeBoxShadowHexAndOpacityDependencies2({
  v,
  device,
  state,
  opacity,
  isChanged
}) {
  const dependencies = {
    boxShadow: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowBlur: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowSpread: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowVertical: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowHorizontal: {
      childs: [],
      nullValue: [],
      tempValue: []
    }
  };

  opacity = onChangeBoxShadowOpacity2({
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

export function onChangeBoxShadowPalette2({ v, device, state, palette }) {
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    [dvk("boxShadowColorPalette")]: palette,
    [dvk("tempBoxShadowColorPalette")]: palette
  };
}

export function onChangeBoxShadowPaletteOpacity2({
  v,
  device,
  state,
  opacity,
  isChanged
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  opacity = onChangeBoxShadowOpacity2({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  return {
    [dvk("boxShadowColorOpacity")]: opacity
  };
}

export function onChangeBoxShadowFields2({
  v,
  device,
  state,
  boxShadowBlur = 0,
  boxShadowSpread = 0,
  boxShadowVertical = 0,
  boxShadowHorizontal = 0
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    [dvk("boxShadowBlur")]: boxShadowBlur,
    [dvk("tempBoxShadowBlur")]: boxShadowBlur,

    [dvk("boxShadowSpread")]: boxShadowSpread,
    [dvk("tempBoxShadowSpread")]: boxShadowSpread,

    [dvk("boxShadowVertical")]: boxShadowVertical,
    [dvk("tempBoxShadowVertical")]: boxShadowVertical,

    [dvk("boxShadowHorizontal")]: boxShadowHorizontal,
    [dvk("tempBoxShadowHorizontal")]: boxShadowHorizontal
  };
}

export function onChangeBoxShadowFieldsDependencies2({
  v,
  device,
  state,
  boxShadowBlur = 0,
  boxShadowSpread = 0,
  boxShadowVertical = 0,
  boxShadowHorizontal = 0
}) {
  const value = Math.max(
    boxShadowBlur,
    boxShadowSpread,
    boxShadowVertical,
    boxShadowHorizontal
  );

  const dependencies = {
    boxShadow: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowColorOpacity: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    boxShadowColorPalette: {
      childs: [],
      nullValue: [],
      tempValue: []
    }
  };

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value,
    dependencies
  });
}

function onChangeBoxShadowOpacity2({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return (isChanged === "hex" || isChanged === "palette") &&
    dvv("boxShadowColorOpacity") === 0
    ? dvv("tempBoxShadowColorOpacity")
    : opacity === undefined
    ? dvv("boxShadowColorOpacity")
    : opacity;
}
