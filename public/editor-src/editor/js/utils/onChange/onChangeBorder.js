// ToDo.. De ce ColorFields accepta 2 valori HEX si Opacity eu cerd ca e nevoie doar de HEX opacity nu e nevoie de el

import {
  onChangeGroupedAndUngroupedByGrouped,
  onChangeUngroupedByUngrouped,
  onChangeGroupedByUngrouped,
  onChangeDependeciesGrouped,
  onChangeDependeciesUngrouped
} from "./onChange";
import { defaultValueKey, defaultValueValue } from "./device";

export function onChangeBorderStyle2({ v, device, state, borderStyle }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  console.log({
    [dvk("borderStyle")]: borderStyle,
    [dvk("tempBorderStyle")]:
      borderStyle !== "" ? borderStyle : dvv("tempBorderStyle")
  });

  return {
    [dvk("borderStyle")]: borderStyle,
    [dvk("tempBorderStyle")]:
      borderStyle !== "" ? borderStyle : dvv("tempBorderStyle")
  };
}

export function onChangeElementBorderStyleDependencies2({
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
    }
  };

  console.log(
    onChangeDependeciesGrouped({
      v,
      device,
      state,
      value: borderStyle,
      dependencies
    })
  );

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

  console.log(
    onChangeDependeciesGrouped({
      v,
      device,
      state,
      value: borderStyle,
      dependencies
    })
  );

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
  isChanged = "hex",
  opacityDragEnd = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  opacity = onChangeBorderColorOpacity2({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd ? opacity : dvv("tempBorderColorOpacity");

  console.log({
    [dvk("borderColorHex")]: hex,
    [dvk("borderColorOpacity")]: opacity,
    [dvk("tempBorderColorOpacity")]: tempOpacity
  });

  return {
    [dvk("borderColorHex")]: hex,
    [dvk("borderColorOpacity")]: opacity,
    [dvk("tempBorderColorOpacity")]: tempOpacity
  };
}

export function onChangeBorderColorHexAndOpacityPalette2({
  v,
  device,
  state,
  opacity,
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  opacity = onChangeBorderColorOpacity2({
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
      ? dvv("tempBorderColorPalette")
      : dvv("borderColorPalette");

  const tempPalette = isChanged === "hex" ? "" : dvv("tempBorderColorPalette");

  console.log({
    [dvk("borderColorPalette")]: palette,
    [dvk("tempBorderColorPalette")]: tempPalette
  });

  return {
    [dvk("borderColorPalette")]: palette,
    [dvk("tempBorderColorPalette")]: tempPalette
  };
}

export function onChangeElementBorderColorHexAndOpacityDependencies2({
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
    }
  };

  opacity = onChangeBorderColorOpacity2({
    v,
    device,
    state,
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

export function onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet2({
  v,
  device,
  state,
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
  state,
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

export function onChangeBorderColorPalette2({ device, state, palette }) {
  const dvk = key => defaultValueKey({ key, device, state });

  console.log({
    [dvk("borderColorPalette")]: palette,
    [dvk("tempBorderColorPalette")]: palette
  });

  return {
    [dvk("borderColorPalette")]: palette,
    [dvk("tempBorderColorPalette")]: palette
  };
}

export function onChangeBorderColorPaletteOpacity2({
  v,
  device,
  state,
  opacity,
  isChanged
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  opacity = onChangeBorderColorOpacity2({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  console.log({
    [dvk("borderColorOpacity")]: opacity
  });

  return {
    [dvk("borderColorOpacity")]: opacity
  };
}

export function onChangeBorderWidthType2({ v, device, state, type }) {
  const dvk = key => defaultValueKey({ key, device, state });

  console.log({ [dvk("borderWidthType")]: type });

  return { [dvk("borderWidthType")]: type };
}

export function onChangeBorderWidthGrouped2({
  v,
  device,
  state,
  value,
  sliderDragEnd
}) {
  const parent = "borderWidth";
  const childs = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth"
  ];
  const temp = true;
  const tempZero = false;

  console.log(
    onChangeGroupedAndUngroupedByGrouped({
      v,
      device,
      state,
      parent,
      childs,
      value,
      sliderDragEnd,
      temp,
      tempZero
    })
  );

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
  value
}) {
  const dependencies = {
    borderStyle: {
      childs: [],
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
    },
    borderColorOpacity: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderColorPalette: {
      childs: [],
      nullValue: [],
      tempValue: []
    }
  };

  console.log(
    onChangeDependeciesGrouped({
      v,
      device,
      state,
      value,
      dependencies
    })
  );

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
  value
}) {
  const parent = "borderWidth";
  const childs = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth"
  ];
  const temp = true;

  console.log({
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
  });

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
  value
}) {
  const parent = "borderWidth";
  const childs = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth"
  ];

  const dependencies = {
    borderStyle: {
      childs: [],
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
    },
    borderColorOpacity: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderColorPalette: {
      childs: [],
      nullValue: [],
      tempValue: []
    }
  };

  console.log(
    onChangeDependeciesUngrouped({
      v,
      device,
      state,
      parent,
      childs,
      current,
      value,
      dependencies
    })
  );

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
  opacity = undefined,
  isChanged = "hex"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return (isChanged === "hex" || isChanged === "palette") &&
    dvv("borderColorOpacity") === 0
    ? dvv("tempBorderColorOpacity")
    : opacity === undefined
    ? dvv("borderColorOpacity")
    : opacity;
}
