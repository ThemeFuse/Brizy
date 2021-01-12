import { t } from "visual/utils/i18n";
import { capByPrefix } from "visual/utils/string";
import { getWeightChoices } from "visual/utils/fonts";
import { getOptionFontByGlobal } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarTypography2FontFamily({
  v,
  prefix = "",
  device,
  state,
  disabled = false,
  devices = "all",
  onChange
}) {
  const fontFamilyKey = defaultValueKey({
    key: capByPrefix(prefix, "fontFamily"),
    device,
    state
  });

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

  return {
    id: fontFamilyKey,
    label: t("Font Family"),
    type: "fontFamily",
    devices,
    disabled,
    value: fontFamilyValue,
    onChange: ({ id, weights, type }) => {
      const values = {
        ...{ v, prefix, device, state, onChange },
        ...{ current: fontFamilyKey, value: id, weights, type }
      };

      return saveOnChanges(values);
    }
  };
}

export function toolbarTypography2FontStyle({
  v,
  prefix = "",
  device,
  state,
  disabled = false,
  devices = "all",
}) {
  const fontStyleKey = defaultValueKey({
    key: capByPrefix(prefix, "fontStyle"),
    device,
    state
  });

  const fontStyleValue = defaultValueValue({
    v,
    key: capByPrefix(prefix, "fontStyle"),
    device,
    state
  });

  return {
    id: fontStyleKey,
    label: t("Typography"),
    type: "fontStyle",
    devices,
    disabled,
    className: "brz-ed-popover__font-style",
    display: "block",
    value: fontStyleValue,
    onChange: fontStyle => {
      return {
        [fontStyleKey]: fontStyle
      };
    }
  };
}

export function toolbarTypography2FontSize({
  v,
  prefix = "",
  device,
  state,
  disabled = false,
  devices = "all",
  onChange
}) {
  const fontSizeKey = defaultValueKey({
    key: capByPrefix(prefix, "fontSize"),
    device,
    state
  });

  let fontSizeValue = defaultValueValue({
    v,
    key: capByPrefix(prefix, "fontSize"),
    device,
    state
  });

  // getOptionFontByGlobal - was writen for shortcodes where elements can't
  // have fontStyle and fontSize simultaneously(RichText works now another way), this way this condition is needed.
  // When this changes will be merged with dev branch - remove this condition, because there(in dev branch)
  // richText was rewritten and works as other elements
  if (!fontSizeValue) {
    fontSizeValue = getOptionFontByGlobal(
      fontSizeKey,
      fontSizeValue,
      defaultValueValue({
        v,
        key: capByPrefix(prefix, "fontStyle"),
        device,
        state
      })
    );
  }
  

  return {
    id: fontSizeKey,
    label: t("Size"),
    type: "stepper",
    devices,
    disabled,
    display: "block",
    min: 1,
    max: 100,
    step: 1,
    value: fontSizeValue,
    onChange: fontSize => {
      const values = {
        ...{ v, prefix, device, state, onChange },
        ...{ current: fontSizeKey, value: fontSize }
      };

      return saveOnChanges(values);
    }
  };
}

export function toolbarTypography2LineHeight({
  v,
  prefix = "",
  device,
  state,
  disabled = false,
  devices = "all",
  onChange
}) {
  const lineHeightKey = defaultValueKey({
    key: capByPrefix(prefix, "lineHeight"),
    device,
    state
  });

  let lineHeightValue = defaultValueValue({
    v,
    key: capByPrefix(prefix, "lineHeight"),
    device,
    state
  });

  if (!lineHeightValue) {
    lineHeightValue = getOptionFontByGlobal(
      lineHeightKey,
      lineHeightValue,
      defaultValueValue({
        v,
        key: capByPrefix(prefix, "fontStyle"),
        device,
        state
      })
    );
  }

  return {
    id: lineHeightKey,
    label: t("Line Hgt."),
    type: "stepper",
    devices,
    disabled,
    display: "block",
    min: 1,
    max: 10,
    step: 0.1,
    value: lineHeightValue,
    onChange: lineHeight => {
      const values = {
        ...{ v, prefix, device, state, onChange },
        ...{ current: lineHeightKey, value: lineHeight }
      };

      return saveOnChanges(values);
    }
  };
}

export function toolbarTypography2FontWeight({
  v,
  prefix = "",
  device,
  state,
  disabled = false,
  devices = "all",
  onChange
}) {
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

  let fontWeightValue = defaultValueValue({
    v,
    key: capByPrefix(prefix, "fontWeight"),
    device,
    state
  });

  if (!fontWeightValue) {
    fontWeightValue = getOptionFontByGlobal(
      fontWeightKey,
      fontWeightValue,
      defaultValueValue({
        v,
        key: capByPrefix(prefix, "fontStyle"),
        device,
        state
      })
    );
  }

  return {
    id: fontWeightKey,
    label: t("Weight"),
    type: "select",
    devices,
    disabled,
    display: "block",
    choices: getWeightChoices({
      type: fontFamilyTypeValue,
      family: fontFamilyValue
    }),
    value: fontWeightValue,
    onChange: fontWeight => {
      const values = {
        ...{ v, prefix, device, state, onChange },
        ...{ current: fontWeightKey, value: fontWeight }
      };

      return saveOnChanges(values);
    }
  };
}

export function toolbarTypography2LetterSpacing({
  v,
  prefix = "",
  device,
  state,
  disabled = false,
  devices = "all",
  onChange
}) {
  const letterSpacingKey = defaultValueKey({
    key: capByPrefix(prefix, "letterSpacing"),
    device,
    state
  });

  let letterSpacingValue = defaultValueValue({
    v,
    key: capByPrefix(prefix, "letterSpacing"),
    device,
    state
  });

  if (!letterSpacingValue) {
    letterSpacingValue = getOptionFontByGlobal(
      letterSpacingKey,
      letterSpacingValue,
      defaultValueValue({
        v,
        key: capByPrefix(prefix, "fontStyle"),
        device,
        state
      })
    );
  }

  return {
    id: letterSpacingKey,
    label: t("Letter Sp."),
    type: "stepper",
    devices,
    disabled,
    display: "block",
    min: -20,
    max: 20,
    step: 0.5,
    value: letterSpacingValue,
    onChange: letterSpacing => {
      const values = {
        ...{ v, prefix, device, state, onChange },
        ...{ current: letterSpacingKey, value: letterSpacing }
      };

      return saveOnChanges(values);
    }
  };
}
