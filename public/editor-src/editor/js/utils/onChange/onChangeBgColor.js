import { capByPrefix, capitalize } from "visual/utils/string";
import { onChangeDependeciesGrouped } from "./onChange";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeBgColorType2({ v, device, state, bgColorType }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  console.log({
    [dvk("bgColorType")]: bgColorType,
    [dvk("gradientActivePointer")]:
      bgColorType === "solid" ? "startPointer" : dvv("gradientActivePointer")
  });

  return {
    [dvk("bgColorType")]: bgColorType,
    [dvk("gradientActivePointer")]:
      bgColorType === "solid" ? "startPointer" : dvv("gradientActivePointer")
  };
}

export function onChangeGradientRange2({
  device,
  state,
  startPointer,
  finishPointer,
  activePointer
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  console.log({
    [dvk("gradientStartPointer")]: startPointer,
    [dvk("gradientFinishPointer")]: finishPointer,
    [dvk("gradientActivePointer")]: activePointer
  });

  return {
    [dvk("gradientStartPointer")]: startPointer,
    [dvk("gradientFinishPointer")]: finishPointer,
    [dvk("gradientActivePointer")]: activePointer
  };
}

export function onChangeBgColorHexAndOpacity2({
  v,
  device,
  state,
  prefix,
  hex,
  opacity,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const tempPrefix = `temp${capitalize(prefix)}`;

  opacity = onChangeBgColorOpacity2({
    v,
    device,
    state,
    prefix,
    opacity,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd
      ? opacity
      : dvv(capByPrefix(tempPrefix, "colorOpacity"));

  console.log({
    [dvk(capByPrefix(prefix, "colorHex"))]: hex,
    [dvk(capByPrefix(prefix, "colorOpacity"))]: opacity,
    [dvk(capByPrefix(tempPrefix, "colorOpacity"))]: tempOpacity
  });

  return {
    [dvk(capByPrefix(prefix, "colorHex"))]: hex,
    [dvk(capByPrefix(prefix, "colorOpacity"))]: opacity,
    [dvk(capByPrefix(tempPrefix, "colorOpacity"))]: tempOpacity
  };
}

export function onChangeBgColorHexAndOpacityPalette2({
  v,
  device,
  state,
  prefix,
  opacity,
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const tempPrefix = `temp${capitalize(prefix)}`;

  opacity = onChangeBgColorOpacity2({
    v,
    device,
    state,
    prefix,
    opacity,
    isChanged
  });

  const palette =
    isChanged === "hex" || opacity === 0
      ? ""
      : opacity > 0
      ? dvv(capByPrefix(tempPrefix, "colorPalette"))
      : dvv(capByPrefix(prefix, "colorPalette"));

  const tempPalette =
    isChanged === "hex" ? "" : dvv(capByPrefix(tempPrefix, "colorPalette"));

  console.log({
    [dvk(capByPrefix(prefix, "colorPalette"))]: palette,
    [dvk(capByPrefix(tempPrefix, "colorPalette"))]: tempPalette
  });

  return {
    [dvk(capByPrefix(prefix, "colorPalette"))]: palette,
    [dvk(capByPrefix(tempPrefix, "colorPalette"))]: tempPalette
  };
}

export function onChangeBgColorHexAndOpacityDependencies2({
  v,
  device,
  state,
  prefix,
  opacity,
  isChanged = "hex"
}) {
  const dependencies = {
    borderRadius: {
      childs: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ],
      nullValue: ["bgImageSrc", "borderColorOpacity"],
      tempValue: []
    }
  };

  opacity = onChangeBgColorOpacity2({
    v,
    device,
    state,
    prefix,
    opacity,
    isChanged
  });

  console.log(
    onChangeDependeciesGrouped({
      v,
      device,
      state,
      value: opacity,
      dependencies
    })
  );

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: opacity,
    dependencies
  });
}

export function onChangeBgColorHexAndOpacityColumnAndRowSyncMobile2({
  v,
  device,
  prefix,
  opacity,
  isChanged = "hex"
}) {
  if (device === "desktop" || device === "mobile") {
    opacity = onChangeBgColorOpacity2({
      v,
      device,
      prefix,
      opacity,
      isChanged
    });

    const mobilePaddingRight =
      opacity === 0
        ? 0
        : isChanged === "hex" || opacity > 0
        ? v.tempMobilePaddingRight
        : v.mobilePaddingRight;

    const mobilePaddingLeft =
      opacity === 0
        ? 0
        : isChanged === "hex" || opacity > 0
        ? v.tempMobilePaddingLeft
        : v.mobilePaddingLeft;

    return {
      mobilePaddingRight,
      mobilePaddingLeft
    };
  } else {
    return {};
  }
}

export function onChangeBgColorPalette2({ device, state, prefix, palette }) {
  const dvk = key => defaultValueKey({ key, device, state });

  const tempPrefix = `temp${capitalize(prefix)}`;

  console.log({
    [dvk(capByPrefix(prefix, "colorPalette"))]: palette,
    [dvk(capByPrefix(tempPrefix, "colorPalette"))]: palette
  });

  return {
    [dvk(capByPrefix(prefix, "colorPalette"))]: palette,
    [dvk(capByPrefix(tempPrefix, "colorPalette"))]: palette
  };
}

export function onChangeBgColorPaletteOpacity2({
  v,
  device,
  state,
  prefix,
  opacity,
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  opacity = onChangeBgColorOpacity2({
    v,
    device,
    state,
    prefix,
    opacity,
    isChanged
  });

  console.log({
    [dvk(capByPrefix(prefix, "colorOpacity"))]: opacity
  });

  return {
    [dvk(capByPrefix(prefix, "colorOpacity"))]: opacity
  };
}

function onChangeBgColorOpacity2({
  v,
  device,
  state,
  prefix,
  opacity = undefined,
  isChanged = "hex"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const tempPrefix = `temp${capitalize(prefix)}`;

  return (isChanged === "hex" || isChanged === "palette") &&
    dvv(capByPrefix(prefix, "colorOpacity")) === 0 &&
    dvv(capByPrefix(tempPrefix, "colorOpacity")) === 1 &&
    dvv("bgImageSrc") !== ""
    ? 0.9
    : (isChanged === "hex" || isChanged === "palette") &&
      dvv(capByPrefix(prefix, "colorOpacity")) === 0
    ? dvv(capByPrefix(tempPrefix, "colorOpacity"))
    : opacity === undefined
    ? dvv(capByPrefix(prefix, "colorOpacity"))
    : opacity;
}
