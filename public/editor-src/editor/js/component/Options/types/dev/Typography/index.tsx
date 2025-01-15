import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Typography as Control } from "visual/component/Controls/Typography";
import * as Option from "visual/component/Options/Type";
import Prompts from "visual/component/Prompts";
import { currentUserRole } from "visual/component/Roles";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { isStory } from "visual/global/EditorModeContext";
import { useConfig, useEditorMode } from "visual/global/hooks";
import { setDeviceMode, updateUI } from "visual/redux/actions2";
import {
  deviceModeSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { DESKTOP } from "visual/utils/devices";
import {
  fontTransform,
  getFontStyles,
  getWeightChoices
} from "visual/utils/fonts";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import * as FontWeight from "visual/utils/fonts/Weight";
import { mPipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import {
  divideFonts,
  getValue
} from "visual/utils/options/Typography/componentUtils";
import { Config } from "visual/utils/options/Typography/types/Config";
import { Font } from "visual/utils/options/Typography/types/Font";
import { FontObject } from "visual/utils/options/Typography/types/FontObject";
import { FontsBlock } from "visual/utils/options/Typography/types/FontsBlocks";
import * as Patch from "visual/utils/options/Typography/types/Patch";
import { Value } from "visual/utils/options/Typography/types/Value";
import {
  createScriptChoices,
  readScripts
} from "visual/utils/options/Typography/utils";
import { readKey } from "visual/utils/reader/object";

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

export const Typography = ({
  value,
  onChange,
  config,
  className
}: Props): ReactElement => {
  const dispatch = useDispatch();
  const store = useStore();
  const device = useSelector(deviceModeSelector);
  const unDeletedFonts = useSelector<ReduxState, ReduxState["fonts"]>(
    unDeletedFontsSelector
  );
  const editorMode = useEditorMode();
  const globalConfig = useConfig();
  const _isStory = isStory(editorMode);

  const { bottomTabsOrder = [], topTabsOrder = [] } =
    globalConfig.ui?.leftSidebar ?? {};

  const enableGlobalStyle = useMemo((): boolean => {
    return [...bottomTabsOrder, ...topTabsOrder].some(
      (tab) => tab.type === LeftSidebarOptionsIds.globalStyle
    );
  }, [bottomTabsOrder, topTabsOrder]);

  const {
    fontFamily = device === DESKTOP,
    letterSpacing: {
      min: letterSpacingMin = -20,
      max: letterSpacingMax = 20
    } = {},
    lineHeight: { min: lineHeightMin = 1, max: lineHeightMax = 20 } = {},
    fontSize: { min: sizeMin = 0, max: sizeMax = 300 } = {},
    icons,
    scriptChoices
  } = config ?? {};

  const fonts = useMemo<FontsBlock>(
    () =>
      Object.entries(unDeletedFonts).reduce((acc: FontsBlock, [k, d]) => {
        type K = keyof FontsBlock;
        const getFont = readKey(k)(fontTransform) as
          | undefined
          | ((font: Font) => FontObject);

        if (getFont) {
          acc[k as K] = d?.data.map(getFont);
        }
        return acc;
      }, {}),
    [unDeletedFonts]
  );
  const _value = useMemo(() => {
    return getValue({
      device,
      fonts,
      store,
      value
    });
  }, [device, fonts, store, value]);
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
        case "bold":
        case "italic":
        case "underline":
        case "strike":
        case "uppercase":
        case "lowercase":
        case "script": {
          const patch = { ..._value };

          if (["uppercase", "lowercase"].includes(meta.isChanged)) {
            const isUppercase = meta.isChanged === "uppercase";
            patch.uppercase = isUppercase;
            patch.lowercase = !isUppercase;
          }

          const value = withFontFamily
            ? Patch.fullFont({
                ...patch,
                [meta.isChanged]: v
              })
            : Patch.textTransform({
                ...patch,
                [meta.isChanged]: v
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

  const styles = useMemo(
    () => [{ id: "", title: t("Custom") }, ...getFontStyles({ store })],
    [store]
  );

  const weights = useMemo(() => {
    return getWeightChoices({
      type: _value.fontFamilyType,
      family: _value.fontFamily,
      store
    });
  }, [_value.fontFamily, _value.fontFamilyType, store]);

  const showTextTransform = device === "desktop";

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

  const _scriptChoices = useMemo(
    () => mPipe(readScripts, createScriptChoices)(scriptChoices),
    [scriptChoices]
  );

  const fontSizeStep = _value.fontSizeSuffix === "px" ? 1 : 0.1;

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
      bold={_value.bold}
      italic={_value.italic}
      underline={_value.underline}
      strike={_value.strike}
      uppercase={_value.uppercase}
      lowercase={_value.lowercase}
      script={_value.script}
      scriptChoices={_scriptChoices}
      letterSpacingMin={letterSpacingMin}
      letterSpacingMax={letterSpacingMax}
      letterSpacingStep={0.1}
      lineHeightMin={lineHeightMin}
      lineHeightMax={lineHeightMax}
      lineHeightStep={0.1}
      sizeMin={sizeMin}
      sizeMax={sizeMax}
      sizeStep={fontSizeStep}
      letterSpacingLabel={t("Letter Space")}
      lineHeightLabel={t("Line Height")}
      sizeLabel={t("Size")}
      styleLabel={t("Typography")}
      weightLabel={t("Weight")}
      icons={icons}
      className={className}
      activeIcon={deviceIcons[device]}
      onIconClick={onIconClick}
      variations={variations}
      showTextTransform={showTextTransform}
      showFontSize={_isStory}
      showFontStyles={!_isStory}
    />
  );
};
