import React, { FC, useCallback, useMemo } from "react";
import Prompts from "visual/component/Prompts";
import { Typography as Control } from "visual/component/Controls/Typography";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import {
  DEFAULT_VALUE,
  fromGlobal,
  getModel,
  getElementModel,
  patchFontFamily
} from "./componentUtils";
import { unDeletedFontSelector } from "visual/redux/selectors-new";
import { useSelector } from "react-redux";
import {
  fontTransform,
  getFontStyles,
  getWeightChoices
} from "visual/utils/fonts";
import { currentUserRole } from "visual/component/Roles";
import { t } from "visual/utils/i18n";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";
import * as Model from "./model";
import { Config } from "./types/Config";
import { FontSettings, Value } from "./types/Value";
import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { OptionType } from "visual/component/Options/Type";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { FontObject } from "./types/FontObject";
import { ReduxState } from "visual/redux/types";
import { Font } from "./types/Font";
import { Patch } from "./types/Patch";
import { NoEmptyString } from "visual/utils/string/NoEmptyString";
import { pipe } from "visual/utils/fp";

const openFontsUploader = (): void => {
  Prompts.open({
    prompt: "fonts",
    mode: "single"
  });
};

const openFontStyle = (): void => {
  getStore().dispatch(
    updateUI("leftSidebar", {
      isOpen: true,
      drawerContentType: "styling"
    })
  );
};

type FontsBlock = Partial<{
  config: FontObject[];
  blocks: FontObject[];
  [FontFamilyType.google]: FontObject[];
  [FontFamilyType.upload]: FontObject[];
}>;

export interface Props
  extends Option.Props<Value>,
    WithConfig<Config>,
    WithClassName {}

export const Typography: OptionType<Value, Patch> & FC<Props> = ({
  value,
  onChange,
  config
}) => {
  const fontFamily = config?.fontFamily ?? true;
  const unDeletedFonts = useSelector<ReduxState, ReduxState["fonts"]>(
    unDeletedFontSelector
  );
  const fonts = useMemo<FontsBlock>(
    () =>
      Object.entries(unDeletedFonts).reduce((acc: FontsBlock, [k, d]) => {
        type K = keyof FontsBlock;
        acc[k as K] = d?.data.map(fontTransform[k as K]);
        return acc;
      }, {}),
    [unDeletedFonts]
  );

  const patch = useCallback(
    (
      v: Value[keyof Value] | Font,
      { isChanged }: { isChanged: keyof Value }
    ): Patch => {
      switch (isChanged) {
        case "fontStyle":
          return Model.patchFontStyle((v || undefined) as NoEmptyString);
        case "fontFamily":
        case "fontFamilyType":
          return patchFontFamily(v as Font, fromGlobal(value));
        case "fontSize":
        case "fontSizeSuffix":
        case "fontWeight":
        case "letterSpacing":
        case "lineHeight": {
          return fontFamily
            ? Model.patchFontFamily(
                isChanged as keyof FontSettings,
                v as FontSettings[keyof FontSettings],
                fromGlobal(value)
              )
            : Model.patchFontSettings(
                isChanged as keyof FontSettings,
                v as FontSettings[keyof FontSettings],
                fromGlobal(value)
              );
        }
      }
    },
    [onChange, value, fontFamily]
  );
  const _onChange = useCallback(
    pipe(patch, v => getElementModel(v, k => k), onChange),
    [patch, onChange]
  );

  const _value = fromGlobal(value);
  const styles = [{ id: "", title: t("Custom") }, ...getFontStyles()];
  const weights = getWeightChoices({
    type: _value.fontFamilyType,
    family: _value.fontFamily
  });

  return (
    <Control
      onChange={_onChange}
      fontFamily={fontFamily}
      fonts={fonts}
      font={_value.fontFamily}
      fontAdd={currentUserRole() === "admin" ? openFontsUploader : undefined}
      fontAddLabel={t("Add New Font")}
      styles={styles}
      style={_value.fontStyle}
      styleOpenSettings={openFontStyle}
      size={_value.fontSize}
      sizeSuffix={_value.fontSizeSuffix}
      sizeSuffixes={SizeSuffix.getSuffixChoices}
      weights={weights}
      weight={_value.fontWeight}
      lineHeight={_value.lineHeight}
      letterSpacing={_value.letterSpacing}
    />
  );
};

Typography.getModel = getModel;

Typography.getElementModel = getElementModel;

Typography.defaultValue = DEFAULT_VALUE;
