// ToDo.. De ce ColorFields accepta 2 valori HEX si Opacity eu cerd ca e nevoie doar de HEX opacity nu e nevoie de el

import { onChangeDependeciesGrouped } from "./onChange";
import { defaultValueValue, defaultValueKey } from "./device";
import { capByPrefix } from "visual/utils/string";

export function onChangeBoxShadowType2({
  v,
  device,
  state,
  boxShadowType,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const tempBoxShadow = capByPrefix("temp", boxShadow);

  return {
    [dvk(boxShadow)]: boxShadowType,
    [dvk(tempBoxShadow)]:
      boxShadowType !== "" ? boxShadowType : dvv(tempBoxShadow)
  };
}

export function onChangeBoxShadowTypeDependencies2({
  v,
  device,
  state,
  boxShadowType,
  prefix = ""
}) {
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorOpacity = capByPrefix(boxShadow, "colorOpacity");
  const colorPalette = capByPrefix(boxShadow, "colorPalette");
  const blur = capByPrefix(boxShadow, "blur");
  const spread = capByPrefix(boxShadow, "spread");
  const vertical = capByPrefix(boxShadow, "vertical");
  const horizontal = capByPrefix(boxShadow, "horizontal");
  const dependencies = {
    [colorOpacity]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [colorPalette]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [blur]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [spread]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [vertical]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [horizontal]: {
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
  prefix = "",
  isChanged = "hex",
  opacityDragEnd = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorHex = capByPrefix(boxShadow, "colorHex");
  const colorOpacity = capByPrefix(boxShadow, "colorOpacity");
  const tempColorOpacity = capByPrefix("temp", colorOpacity);

  opacity = onChangeBoxShadowOpacity2({
    v,
    device,
    state,
    opacity,
    prefix,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd ? opacity : dvv(tempColorOpacity);

  return {
    [dvk(colorHex)]: hex,
    [dvk(colorOpacity)]: opacity,
    [dvk(tempColorOpacity)]: tempOpacity
  };
}

export function onChangeBoxShadowHexAndOpacityPalette2({
  v,
  device,
  state,
  opacity,
  prefix = "",
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorPalette = capByPrefix(boxShadow, "colorPalette");
  const tempColorPalette = capByPrefix("temp", colorPalette);

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
      ? dvv(tempColorPalette)
      : dvv(colorPalette);

  const tempPalette = isChanged === "hex" ? "" : dvv(tempColorPalette);

  return {
    [dvk(colorPalette)]: palette,
    [dvk(tempColorPalette)]: tempPalette
  };
}

export function onChangeBoxShadowHexAndOpacityDependencies2({
  v,
  device,
  state,
  opacity,
  isChanged,
  prefix = ""
}) {
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const blur = capByPrefix(boxShadow, "blur");
  const spread = capByPrefix(boxShadow, "spread");
  const vertical = capByPrefix(boxShadow, "vertical");
  const horizontal = capByPrefix(boxShadow, "horizontal");
  const dependencies = {
    [boxShadow]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [blur]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [spread]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [vertical]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [horizontal]: {
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
    prefix,
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

export function onChangeBoxShadowPalette2({
  device,
  state,
  palette,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorPalette = capByPrefix(boxShadow, "colorPalette");
  const tempColorPalette = capByPrefix("temp", colorPalette);

  return {
    [dvk(colorPalette)]: palette,
    [dvk(tempColorPalette)]: palette
  };
}

export function onChangeBoxShadowPaletteOpacity2({
  v,
  device,
  state,
  opacity,
  isChanged,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorOpacity = capByPrefix(boxShadow, "colorOpacity");

  opacity = onChangeBoxShadowOpacity2({
    v,
    device,
    state,
    opacity,
    prefix,
    isChanged
  });

  return {
    [dvk(colorOpacity)]: opacity
  };
}

export function onChangeBoxShadowFields2({
  device,
  state,
  boxShadowBlur = 0,
  boxShadowSpread = 0,
  boxShadowVertical = 0,
  boxShadowHorizontal = 0,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const blur = capByPrefix(boxShadow, "blur");
  const spread = capByPrefix(boxShadow, "spread");
  const vertical = capByPrefix(boxShadow, "vertical");
  const horizontal = capByPrefix(boxShadow, "horizontal");
  const tempBlur = capByPrefix("temp", blur);
  const tempSpread = capByPrefix("temp", spread);
  const tempVertical = capByPrefix("temp", vertical);
  const tempHorizontal = capByPrefix("temp", horizontal);

  return {
    [dvk(blur)]: boxShadowBlur,
    [dvk(tempBlur)]: boxShadowBlur,

    [dvk(spread)]: boxShadowSpread,
    [dvk(tempSpread)]: boxShadowSpread,

    [dvk(vertical)]: boxShadowVertical,
    [dvk(tempVertical)]: boxShadowVertical,

    [dvk(horizontal)]: boxShadowHorizontal,
    [dvk(tempHorizontal)]: boxShadowHorizontal
  };
}

export function onChangeBoxShadowFieldsDependencies2({
  v,
  device,
  state,
  boxShadowBlur = 0,
  boxShadowSpread = 0,
  boxShadowVertical = 0,
  boxShadowHorizontal = 0,
  prefix = ""
}) {
  const value = Math.max(
    boxShadowBlur,
    boxShadowSpread,
    boxShadowVertical,
    boxShadowHorizontal
  );
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorOpacity = capByPrefix(boxShadow, "colorOpacity");
  const colorPalette = capByPrefix(boxShadow, "colorPalette");

  const dependencies = {
    [boxShadow]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [colorOpacity]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [colorPalette]: {
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

export function onChangeBoxShadowOpacity2({
  v,
  device,
  state,
  prefix = "",
  opacity = undefined,
  isChanged = "hex"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorOpacity = capByPrefix(boxShadow, "colorOpacity");
  const tempColorOpacity = capByPrefix("temp", colorOpacity);

  return (isChanged === "hex" || isChanged === "palette") &&
    dvv(colorOpacity) === 0
    ? dvv(tempColorOpacity)
    : opacity === undefined
    ? dvv(colorOpacity)
    : opacity;
}
