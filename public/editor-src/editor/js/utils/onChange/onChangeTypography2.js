import { capByPrefix } from "visual/utils/string";
import { getWeight } from "visual/utils/fonts";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";

export function onChangeTypography2({
  v,
  prefix = "",
  current,
  value,
  weights,
  type,
  device,
  state
}) {
  const fontStyleKey = defaultValueKey({
    key: capByPrefix(prefix, "fontStyle"),
    device,
    state
  });

  const fontFamilyKey = defaultValueKey({
    key: capByPrefix(prefix, "fontFamily"),
    device,
    state
  });

  const fontFamilyTypeKey = defaultValueKey({
    key: capByPrefix(prefix, "fontFamilyType"),
    device,
    state
  });

  const fontSizeKey = defaultValueKey({
    key: capByPrefix(prefix, "fontSize"),
    device,
    state
  });

  const lineHeightKey = defaultValueKey({
    key: capByPrefix(prefix, "lineHeight"),
    device,
    state
  });

  const letterSpacingKey = defaultValueKey({
    key: capByPrefix(prefix, "letterSpacing"),
    device,
    state
  });

  const fontWeightKey = defaultValueKey({
    key: capByPrefix(prefix, "fontWeight"),
    device,
    state
  });

  const fontFamilyTypeValue = getOptionFontByGlobal(
    "fontFamilyType",
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontFamilyType"),
      device,
      state
    }),
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontStyle"),
      device,
      state
    })
  );

  const fontFamilyValue = getOptionFontByGlobal(
    "fontFamily",
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontFamily"),
      device,
      state
    }),
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontStyle"),
      device,
      state
    })
  );

  const fontSizeValue = getOptionFontByGlobal(
    "fontSize",
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontSize"),
      device,
      state
    }),
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontStyle"),
      device,
      state
    })
  );

  const lineHeightValue = getOptionFontByGlobal(
    "lineHeight",
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "lineHeight"),
      device,
      state
    }),
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontStyle"),
      device,
      state
    })
  );

  const letterSpacingValue = getOptionFontByGlobal(
    "letterSpacing",
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "letterSpacing"),
      device,
      state
    }),
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontStyle"),
      device,
      state
    })
  );

  const fontWeightValue = getOptionFontByGlobal(
    "fontWeight",
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontWeight"),
      device,
      state
    }),
    defaultValueValue({
      v,
      key: capByPrefix(prefix, "fontStyle"),
      device,
      state
    })
  );

  return {
    [fontStyleKey]: "",
    ...(current === fontFamilyKey
      ? { [fontFamilyKey]: value, [fontFamilyTypeKey]: type }
      : {
          [fontFamilyKey]: fontFamilyValue,
          [fontFamilyTypeKey]: fontFamilyTypeValue
        }),
    ...(current === fontSizeKey
      ? { [fontSizeKey]: value }
      : { [fontSizeKey]: fontSizeValue }),
    ...(current === lineHeightKey
      ? { [lineHeightKey]: value }
      : { [lineHeightKey]: lineHeightValue }),
    ...(current === letterSpacingKey
      ? { [letterSpacingKey]: value }
      : { [letterSpacingKey]: letterSpacingValue }),
    ...(current === fontWeightKey
      ? { [fontWeightKey]: value }
      : current === fontFamilyKey
      ? {
          [fontWeightKey]: getWeight(fontWeightValue, weights)
        }
      : { [fontWeightKey]: fontWeightValue })
  };
}
