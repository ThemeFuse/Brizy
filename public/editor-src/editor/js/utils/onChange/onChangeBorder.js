// ToDo.. De ce ColorFields accepta 2 valori HEX si Opacity eu cerd ca e nevoie doar de HEX opacity nu e nevoie de el

import {
  onChangeGroupedAndUngroupedByGrouped,
  onChangeUngroupedByUngrouped,
  onChangeGroupedByUngrouped,
  onChangeDependeciesGrouped,
  onChangeDependeciesUngrouped
} from "./onChange";
import { defaultValueKey, defaultValueValue } from "./device";
import { capByPrefix } from "visual/utils/string";

export function onChangeBorderStyle2({
  v,
  device,
  state,
  borderStyle,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");
  const style = capByPrefix(border, "style");
  const tempStyle = capByPrefix("temp", style);

  return {
    [dvk(style)]: borderStyle,
    [dvk(tempStyle)]: borderStyle !== "" ? borderStyle : dvv(tempStyle)
  };
}

export function onChangeElementBorderStyleDependencies2({
  v,
  device,
  state,
  borderStyle,
  prefix = ""
}) {
  const border = capByPrefix(prefix, "border");
  const colorOpacity = capByPrefix(border, "colorOpacity");
  const colorPalette = capByPrefix(border, "colorPalette");
  const width = capByPrefix(border, "width");
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
    [width]: {
      childs: [
        capByPrefix(border, "topWidth"),
        capByPrefix(border, "rightWidth"),
        capByPrefix(border, "bottomWidth"),
        capByPrefix(border, "leftWidth")
      ],
      nullValue: [],
      tempValue: []
    }
  };

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: borderStyle,
    dependencies
  });
}

export function onChangeContainerBorderStyleDependencies2({
  v,
  device,
  state,
  borderStyle
}) {
  const dependencies = {
    borderColorOpacity: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderColorPalette: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderWidth: {
      childs: [
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth"
      ],
      nullValue: [],
      tempValue: []
    },
    borderRadius: {
      childs: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ],
      nullValue: ["bgColorOpacity", "bgImageSrc"],
      tempValue: []
    }
  };

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: borderStyle,
    dependencies
  });
}

export function onChangeBorderColorHexAndOpacity2({
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
  const border = capByPrefix(prefix, "border");
  const colorHex = capByPrefix(border, "colorHex");
  const colorOpacity = capByPrefix(border, "colorOpacity");
  const tempColorOpacity = capByPrefix("temp", colorOpacity);

  opacity = onChangeBorderColorOpacity2({
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

export function onChangeBorderColorHexAndOpacityPalette2({
  v,
  device,
  state,
  opacity,
  prefix = "",
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");
  const colorPalette = capByPrefix(border, "colorPalette");
  const tempColorPalette = capByPrefix("temp", colorPalette);

  opacity = onChangeBorderColorOpacity2({
    v,
    device,
    state,
    opacity,
    prefix,
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

export function onChangeElementBorderColorHexAndOpacityDependencies2({
  v,
  device,
  state,
  opacity,
  isChanged,
  prefix = ""
}) {
  const border = capByPrefix(prefix, "border");
  const style = capByPrefix(border, "style");
  const width = capByPrefix(border, "width");
  const dependencies = {
    [style]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [width]: {
      childs: [
        capByPrefix(border, "topWidth"),
        capByPrefix(border, "rightWidth"),
        capByPrefix(border, "bottomWidth"),
        capByPrefix(border, "leftWidth")
      ],
      nullValue: [],
      tempValue: []
    }
  };

  opacity = onChangeBorderColorOpacity2({
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

export function onChangeContainerBorderColorHexAndOpacityDependencies2({
  v,
  device,
  state,
  opacity,
  isChanged
}) {
  const dependencies = {
    borderStyle: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderWidth: {
      childs: [
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth"
      ],
      nullValue: [],
      tempValue: []
    },
    borderRadius: {
      childs: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ],
      nullValue: ["bgColorOpacity", "bgImageSrc"],
      tempValue: []
    }
  };

  opacity = onChangeBorderColorOpacity2({
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

export function onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet2({
  v,
  device,
  opacity,
  isChanged
}) {
  if (device === "desktop" || device === "tablet") {
    opacity = onChangeBorderColorOpacity2({
      v,
      device,
      opacity,
      isChanged
    });

    const tabletPaddingRight =
      opacity === 0
        ? 0
        : isChanged === "hex" || opacity > 0
        ? v.tempTabletPaddingRight
        : v.tabletPaddingRight;

    const tabletPaddingLeft =
      opacity === 0
        ? 0
        : isChanged === "hex" || opacity > 0
        ? v.tempTabletPaddingLeft
        : v.tabletPaddingLeft;

    return {
      tabletPaddingRight,
      tabletPaddingLeft
    };
  } else {
    return {};
  }
}

export function onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile2({
  v,
  device,
  opacity,
  isChanged
}) {
  if (device === "desktop" || device === "mobile") {
    opacity = onChangeBorderColorOpacity2({
      v,
      device,
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

export function onChangeBorderColorPalette2({
  device,
  state,
  palette,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const border = capByPrefix(prefix, "border");
  const colorPalette = capByPrefix(border, "colorPalette");
  const tempColorPalette = capByPrefix("temp", colorPalette);

  return {
    [dvk(colorPalette)]: palette,
    [dvk(tempColorPalette)]: palette
  };
}

export function onChangeBorderColorPaletteOpacity2({
  v,
  device,
  state,
  opacity,
  isChanged,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const border = capByPrefix(prefix, "border");
  const colorOpacity = capByPrefix(border, "colorOpacity");

  opacity = onChangeBorderColorOpacity2({
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

export function onChangeBorderWidthType2({ device, state, type, prefix = "" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const border = capByPrefix(prefix, "border");
  const widthType = capByPrefix(border, "widthType");

  return { [dvk(widthType)]: type };
}

export function onChangeBorderWidthGrouped2({
  v,
  device,
  state,
  value,
  sliderDragEnd,
  prefix = ""
}) {
  const border = capByPrefix(prefix, "border");
  const parent = capByPrefix(border, "width");
  const childs = [
    capByPrefix(border, "topWidth"),
    capByPrefix(border, "rightWidth"),
    capByPrefix(border, "bottomWidth"),
    capByPrefix(border, "leftWidth")
  ];
  const temp = true;
  const tempZero = false;

  return onChangeGroupedAndUngroupedByGrouped({
    v,
    device,
    state,
    parent,
    childs,
    value,
    sliderDragEnd,
    temp,
    tempZero
  });
}

export function onChangeBorderWidthGroupedDependencies2({
  v,
  device,
  state,
  value,
  prefix = ""
}) {
  const border = capByPrefix(prefix, "border");
  const style = capByPrefix(border, "style");
  const radius = capByPrefix(border, "radius");
  const colorOpacity = capByPrefix(border, "colorOpacity");
  const colorPalette = capByPrefix(border, "colorPalette");
  const dependencies = {
    [style]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [radius]: {
      childs: [
        capByPrefix(border, "topLeftRadius"),
        capByPrefix(border, "topRightRadius"),
        capByPrefix(border, "bottomLeftRadius"),
        capByPrefix(border, "bottomRightRadius")
      ],
      nullValue: ["bgColorOpacity", "bgImageSrc"],
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

export function onChangeBorderWidthUngrouped2({
  v,
  device,
  state,
  current,
  value,
  prefix = ""
}) {
  const border = capByPrefix(prefix, "border");
  const parent = capByPrefix(border, "width");
  const childs = [
    capByPrefix(border, "topWidth"),
    capByPrefix(border, "rightWidth"),
    capByPrefix(border, "bottomWidth"),
    capByPrefix(border, "leftWidth")
  ];
  const temp = true;

  return {
    ...onChangeUngroupedByUngrouped({
      v,
      device,
      state,
      childs,
      current,
      value,
      temp
    }),
    ...onChangeGroupedByUngrouped({
      v,
      device,
      state,
      parent,
      childs,
      current,
      value,
      temp
    })
  };
}

export function onChangeBorderWidthUngroupedDependencies2({
  v,
  device,
  state,
  current,
  value,
  prefix = ""
}) {
  const border = capByPrefix(prefix, "border");
  const parent = capByPrefix(border, "width");
  const childs = [
    capByPrefix(border, "topWidth"),
    capByPrefix(border, "rightWidth"),
    capByPrefix(border, "bottomWidth"),
    capByPrefix(border, "leftWidth")
  ];
  const style = capByPrefix(border, "style");
  const radius = capByPrefix(border, "radius");
  const colorOpacity = capByPrefix(border, "colorOpacity");
  const colorPalette = capByPrefix(border, "colorPalette");

  const dependencies = {
    [style]: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    [radius]: {
      childs: [
        capByPrefix(border, "topLeftRadius"),
        capByPrefix(border, "topRightRadius"),
        capByPrefix(border, "bottomLeftRadius"),
        capByPrefix(border, "bottomRightRadius")
      ],
      nullValue: ["bgColorOpacity", "bgImageSrc"],
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

  return onChangeDependeciesUngrouped({
    v,
    device,
    state,
    parent,
    childs,
    current,
    value,
    dependencies
  });
}

function onChangeBorderColorOpacity2({
  v,
  device,
  state,
  prefix = "",
  opacity = undefined,
  isChanged = "hex"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");
  const colorOpacity = capByPrefix(border, "colorOpacity");
  const tempColorOpacity = capByPrefix("temp", colorOpacity);

  return (isChanged === "hex" || isChanged === "palette") &&
    dvv(colorOpacity) === 0
    ? dvv(tempColorOpacity)
    : opacity === undefined
    ? dvv(colorOpacity)
    : opacity;
}
