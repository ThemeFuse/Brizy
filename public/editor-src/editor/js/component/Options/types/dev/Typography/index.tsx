import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography as Control } from "visual/component/Controls/Typography";
import * as Option from "visual/component/Options/Type";
import Prompts from "visual/component/Prompts";
import { currentUserRole } from "visual/component/Roles";
import GlobalConfig from "visual/global/Config";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { setDeviceMode, updateUI } from "visual/redux/actions2";
import {
  deviceModeSelector,
  getDefaultFontDetailsSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import {
  fontTransform,
  getFontStyles,
  getWeightChoices
} from "visual/utils/fonts";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import * as FontWeight from "visual/utils/fonts/Weight";
import { t } from "visual/utils/i18n";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { divideFonts, getValue } from "./componentUtils";
import { Config } from "./types/Config";
import { Font } from "./types/Font";
import { FontsBlock } from "./types/FontsBlocks";
import * as Patch from "./types/Patch";
import { Value } from "./types/Value";

const deviceIcons: Record<DeviceMode, string> = {
  desktop: "nc-desktop",
  tablet: "nc-tablet",
  mobile: "nc-phone"
};

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

export const Typography: FC<Props> = ({ value, onChange, config }) => {
  const {
    fontFamily = true,
    letterSpacing: {
      min: letterSpacingMin = -20,
      max: letterSpacingMax = 20
    } = {},
    lineHeight: { min: lineHeightMin = 1, max: lineHeightMax = 20 } = {},
    fontSize: { min: sizeMin = 0, max: sizeMax = 300 } = {},
    icons
  } = config ?? {};
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
      const withFontFamily = fontFamily !== false;
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
        case "fontSizeSuffix":
        case "variableFontWeight":
        case "fontWidth":
        case "fontSoftness": {
          const value = withFontFamily
            ? Patch.fullFont({
                ..._value,
                [meta.isChanged]:
                  v as Patch.FontSettings[keyof Patch.FontSettings]
              })
            : Patch.fontSettings({
                ..._value,
                [meta.isChanged]:
                  v as Patch.FontSettings[keyof Patch.FontSettings]
              });
          return onChange(value);
        }
      }
    },
    [onChange, _value, fontFamily]
  );
  const handleOpenStyles = useCallback(() => {
    dispatch(
      updateUI("leftSidebar", {
        isOpen: true,
        drawerContentType: LeftSidebarOptionsIds.globalStyle
      })
    );
  }, [dispatch]);
  const enableGlobalStyle = useMemo((): boolean => {
    const config = GlobalConfig.getAll();
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      config.ui?.leftSidebar ?? {};
    return [...bottomTabsOrder, ...topTabsOrder].includes(
      LeftSidebarOptionsIds.globalStyle
    );
  }, []);
  const styles = [{ id: "", title: t("Custom") }, ...getFontStyles()];
  const weights = getWeightChoices({
    type: _value.fontFamilyType,
    family: _value.fontFamily
  });

  const variations = useMemo(() => _value.variations, [_value.variations]);

  const dividedFonts = useMemo(() => divideFonts(fonts), [fonts]);

  const _setDeviceMode = useCallback(
    (device: DeviceMode) => {
      dispatch(setDeviceMode(device));
    },
    [dispatch]
  );

  const onIconClick = (icon: string) => {
    let device: DeviceMode = "desktop";

    switch (icon) {
      case deviceIcons.tablet:
        device = "tablet";
        break;
      case deviceIcons.mobile:
        device = "mobile";
        break;
    }

    _setDeviceMode(device);
  };

  return (
    <Control
      onChange={_onChange}
      showFontFamily={fontFamily}
      fonts={dividedFonts}
      font={_value.fontFamily}
      fontAdd={currentUserRole() === "admin" ? openFontsUploader : undefined}
      fontAddLabel={t("Add New Font")}
      styles={styles}
      style={_value.fontStyle}
      styleOpenSettings={enableGlobalStyle ? handleOpenStyles : undefined}
      size={_value.fontSize}
      sizeSuffix={_value.fontSizeSuffix}
      sizeSuffixes={SizeSuffix.getSuffixChoices}
      weights={weights}
      weight={_value.fontWeight}
      lineHeight={_value.lineHeight}
      letterSpacing={_value.letterSpacing}
      variableFontWeight={_value.variableFontWeight}
      fontWidth={_value.fontWidth}
      fontSoftness={_value.fontSoftness}
      letterSpacingMin={letterSpacingMin}
      letterSpacingMax={letterSpacingMax}
      letterSpacingStep={0.1}
      lineHeightMin={lineHeightMin}
      lineHeightMax={lineHeightMax}
      lineHeightStep={0.1}
      sizeMin={sizeMin}
      sizeMax={sizeMax}
      sizeStep={1}
      letterSpacingLabel={t("Letter Space")}
      lineHeightLabel={t("Line Height")}
      sizeLabel={t("Size")}
      styleLabel={t("Typography")}
      weightLabel={t("Weight")}
      icons={icons}
      activeIcon={deviceIcons[device]}
      onIconClick={onIconClick}
      variations={variations}
    />
  );
};
