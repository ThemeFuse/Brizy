import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Prompts from "visual/component/Prompts";
import { Typography as Control } from "visual/component/Controls/Typography";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import {
  DEFAULT_VALUE,
  getValue,
  getElementModel,
  getModel
} from "./componentUtils";
import {
  deviceModeSelector,
  getDefaultFontDetailsSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors";
import {
  fontTransform,
  getFontStyles,
  getWeightChoices
} from "visual/utils/fonts";
import { currentUserRole } from "visual/component/Roles";
import { t } from "visual/utils/i18n";
import { updateUI } from "visual/redux/actions2";
import { Config } from "./types/Config";
import { Value } from "./types/Value";
import * as Option from "visual/component/Options/Type";
import { OptionType } from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { FontsBlock } from "./types/FontsBlocks";
import { ReduxState } from "visual/redux/types";
import { Font } from "./types/Font";
import * as Patch from "./types/Patch";
import * as FontWeight from "visual/utils/fonts/Weight";

const openFontsUploader = (): void => {
  Prompts.open({
    prompt: "fonts",
    mode: "single"
  });
};

export interface Props
  extends Option.Props<Value, Patch.Patch>,
    WithConfig<Config>,
    WithClassName {}

export const Typography: OptionType<Value, Patch.Patch> & FC<Props> = ({
  value,
  onChange,
  config
}) => {
  const dispatch = useDispatch();
  const unDeletedFonts = useSelector<ReduxState, ReduxState["fonts"]>(
    unDeletedFontsSelector
  );
  const device = useSelector(deviceModeSelector);
  const defaultFont = useSelector(getDefaultFontDetailsSelector);
  const fonts = useMemo<FontsBlock>(
    () =>
      Object.entries(unDeletedFonts).reduce((acc: FontsBlock, [k, d]) => {
        type K = keyof FontsBlock;
        acc[k as K] = d?.data.map(fontTransform[k as K]);
        return acc;
      }, {}),
    [unDeletedFonts]
  );
  const _value = getValue(device, fonts, defaultFont, value);
  const _onChange = useCallback(
    (v: Value[keyof Value] | Font, meta: { isChanged: keyof Value }): void => {
      const withFontFamily = config?.fontFamily !== false;

      switch (meta.isChanged) {
        case "fontFamily": {
          const { id, type, weights } = v as Font;
          const patch = Patch.fontFamily({
            ..._value,
            fontFamily: id,
            fontWeight: weights.includes(_value.fontWeight)
              ? _value.fontWeight
              : FontWeight.empty,
            fontFamilyType: type
          });
          return withFontFamily
            ? onChange({ ..._value, ...patch })
            : onChange(patch);
        }
        case "fontStyle": {
          return onChange(Patch.fontStyle(v as string));
        }
        case "fontSize":
        case "fontWeight":
        case "letterSpacing":
        case "lineHeight":
        case "fontSizeSuffix": {
          const value = withFontFamily
            ? Patch.fullFont({
                ..._value,
                [meta.isChanged]: v as Patch.FontSettings[keyof Patch.FontSettings]
              })
            : Patch.fontSettings({
                ..._value,
                [meta.isChanged]: v as Patch.FontSettings[keyof Patch.FontSettings]
              });
          return onChange(value);
        }
      }
    },
    [onChange, _value]
  );

  const handleOpenStyles = useCallback(() => {
    dispatch(
      updateUI("leftSidebar", {
        isOpen: true,
        drawerContentType: "styling"
      })
    );
  }, []);

  const styles = [{ id: "", title: t("Custom") }, ...getFontStyles()];
  const weights = getWeightChoices({
    type: _value.fontFamilyType,
    family: _value.fontFamily
  });

  return (
    <Control
      onChange={_onChange}
      fontFamily={config?.fontFamily}
      fonts={fonts}
      font={_value.fontFamily}
      fontAdd={currentUserRole() === "admin" ? openFontsUploader : undefined}
      fontAddLabel={t("Add New Font")}
      styles={styles}
      style={_value.fontStyle}
      styleOpenSettings={handleOpenStyles}
      size={_value.fontSize}
      sizeSuffix={_value.fontSizeSuffix}
      sizeSuffixes={SizeSuffix.getSuffixChoices}
      weights={weights}
      weight={_value.fontWeight}
      lineHeight={_value.lineHeight}
      letterSpacing={_value.letterSpacing}
      letterSpacingMin={config?.letterSpacing?.min ?? -20}
      letterSpacingMax={config?.letterSpacing?.max ?? 20}
      letterSpacingStep={0.1}
      lineHeightMin={config?.lineHeight?.min ?? 1}
      lineHeightMax={config?.lineHeight?.max ?? 10}
      lineHeightStep={0.1}
      sizeMin={config?.fontSize?.min ?? 0}
      sizeMax={config?.fontSize?.max ?? 100}
      sizeStep={1}
    />
  );
};

Typography.fromElementModel = getModel;

Typography.toElementModel = getElementModel;

Typography.defaultValue = DEFAULT_VALUE;
