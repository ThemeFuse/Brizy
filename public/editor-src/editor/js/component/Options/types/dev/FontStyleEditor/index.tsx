import classnames from "classnames";
import React, {
  CSSProperties,
  Ref,
  useCallback,
  useRef,
  useState
} from "react";
import { useSelector, useStore } from "react-redux";
import { FontStyle } from "visual/component/Controls/FontStyleEditor";
import { FontStyleItem } from "visual/component/Controls/FontStyleEditor/FontStyle";
import { Label } from "visual/component/Controls/LeftSidebar/Styling/Label";
import { optionValueToModel } from "visual/component/Options/types/dev/FontStyleEditor/utils";
import { ScrollbarRef } from "visual/component/Scrollbar";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { ReduxAction } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import { ModelFamilyType, getFontById } from "visual/utils/fonts/getFontById";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { FCC } from "visual/utils/react/types";
import { DESKTOP } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";
import { printf } from "visual/utils/string";
import { uuid } from "visual/utils/uuid";
import {
  FontStyleEditorData,
  FontStyleEditorItem,
  ModelType,
  Props,
  Styles
} from "./types";

const animateClassName = "brz-ed-option__font-style-editor--animate";

const dvv = (
  v: FontStyleEditorData,
  key: string,
  device: DeviceMode
): ModelFamilyType => defaultValueValue({ v, key, device, state: NORMAL });

export const FontStyleEditor: FCC<Props> = ({ value, label, onChange }) => {
  const scrollRef: Ref<ScrollbarRef> = useRef(null);
  const {
    fontStyles = [],
    extraFontStyles = [],
    className: _className
  } = value;

  const deviceMode = useSelector(deviceModeSelector);
  const store = useStore<ReduxState, ReduxAction>();

  const [item, setItem] = useState({
    brzNewItem: false,
    numItems: fontStyles.length + extraFontStyles.length,
    animationCounter: 0
  });

  const reversedExtraFontStyles = extraFontStyles.slice().reverse();
  const fontClassName = _className?.replace("brz-ed-option", "");

  const getFontStyleData = useCallback(
    (el: FontStyleEditorData) => ({
      fontFamily: dvv(el, "fontFamily", deviceMode),
      fontFamilyType: dvv(el, "fontFamilyType", deviceMode),
      fontSizeSuffix: dvv(el, "fontSizeSuffix", deviceMode),
      fontSize: dvv(el, "fontSize", deviceMode),
      fontWeight: dvv(el, "fontWeight", deviceMode),
      lineHeight: dvv(el, "lineHeight", deviceMode),
      letterSpacing: dvv(el, "letterSpacing", deviceMode),
      variableFontWeight: dvv(el, "variableFontWeight", deviceMode) ?? 400,
      fontWidth: dvv(el, "fontWidth", deviceMode) ?? 100,
      fontSoftness: dvv(el, "fontSoftness", deviceMode) ?? 0,
      bold: dvv(el, "bold", DESKTOP),
      italic: dvv(el, "italic", DESKTOP),
      underline: dvv(el, "underline", DESKTOP),
      strike: dvv(el, "strike", DESKTOP),
      uppercase: dvv(el, "uppercase", DESKTOP),
      lowercase: dvv(el, "lowercase", DESKTOP)
    }),
    [deviceMode]
  );

  const handleChange = useCallback(
    (id: string, newValue: Partial<FontStyleEditorItem>) => {
      const fonts = [...extraFontStyles, ...fontStyles];

      const updatedFonts: FontStyleEditorData[] = fonts.map((el) =>
        id === el.id ? { ...el, ...newValue } : el
      );

      onChange(updatedFonts);

      setItem((prevState) => ({
        ...prevState,
        brzNewItem: false
      }));
    },
    [extraFontStyles, fontStyles, onChange, setItem]
  );

  const handleAnimationEnd = useCallback(
    (event: AnimationEvent) => {
      const targetEvent = event.target as HTMLElement;

      targetEvent.classList.remove(animateClassName);
      targetEvent.removeEventListener("animationend", handleAnimationEnd);

      if (item.animationCounter < item.numItems - 1) {
        setItem((prevState) => ({
          ...prevState,
          animationCounter: prevState.animationCounter + 1
        }));
      }
    },
    [item.animationCounter, item.numItems, setItem]
  );

  const handleAddNew = useCallback(() => {
    const lastFont = fontStyles.find((v) => v.id === "paragraph");
    const valuesLength = extraFontStyles.length + fontStyles.length;

    const newFont: FontStyleEditorData = {
      ...(lastFont ?? fontStyles[0]),
      deletable: "on",
      id: uuid(),
      title: printf(t("New Style #%s"), valuesLength.toString())
    };

    const newValue = [...fontStyles, ...extraFontStyles, newFont];

    onChange(newValue);

    setItem((prevState) => ({
      brzNewItem: true,
      numItems: prevState.numItems + 1,
      animationCounter: prevState.animationCounter + 1
    }));

    const getAllItems = window.parent.document.querySelectorAll(
      ".brz-ed-option__font-style-editor"
    );

    getAllItems.forEach((element, index) => {
      const endAnimation = element.addEventListener(
        "animationend",
        handleAnimationEnd as EventListener
      );

      element.classList.remove(animateClassName);

      if (index === 0) {
        requestAnimationFrame(() => {
          element.classList.add(animateClassName);
          /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
          endAnimation;
        });
      } else {
        element.classList.add(animateClassName);
        /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
        endAnimation;
      }
    });

    if (scrollRef.current) {
      scrollRef.current.scrollToTop();
    }
  }, [extraFontStyles, fontStyles, handleAnimationEnd, onChange]);

  const getSampleStyle = useCallback(
    (el: FontStyleEditorData): CSSProperties => {
      const fontFamily = dvv(el, "fontFamily", deviceMode);
      const fontFamilyType = dvv(el, "fontFamilyType", deviceMode);
      const _fontWeight = dvv(el, "fontWeight", deviceMode);
      const bold = dvv(el, "bold", DESKTOP);
      const italic = dvv(el, "italic", DESKTOP);
      const underline = dvv(el, "underline", DESKTOP);
      const strike = dvv(el, "strike", DESKTOP);
      const uppercase = dvv(el, "uppercase", DESKTOP);
      const lowercase = dvv(el, "lowercase", DESKTOP);

      let decoration = "";
      if (underline) {
        decoration += "underline ";
      }
      if (strike) {
        decoration += "line-through ";
      }

      return {
        fontFamily: getFontById({
          family: fontFamily,
          type: fontFamilyType,
          store
        }).family,
        fontWeight: bold ? "bold" : _fontWeight,
        fontStyle: italic ? "italic" : "normal",
        textDecoration: decoration ? decoration : "none",
        textTransform: uppercase
          ? "uppercase"
          : lowercase
            ? "lowercase"
            : "none"
      };
    },
    [deviceMode, store]
  );

  const getToolbarItems = useCallback(
    (
      el: FontStyleEditorData,
      onChange: (f: ModelType) => void
    ): OptionDefinition[] => [
      {
        id: "toolbarTypography",
        type: "popover",
        icon: "nc-font",
        display: "inline",
        // @ts-expect-error old options hasn't config
        config: {
          size: "large",
          onOpenDirect: true
        },
        options: [
          {
            id: "toolbarTypography",
            type: "typography",
            config: {
              icons: ["nc-desktop", "nc-tablet", "nc-phone"]
            },
            value: getFontStyleData(el),
            className: fontClassName,
            onChange: (value: Styles) => {
              onChange(optionValueToModel(value, deviceMode));
            }
          }
        ]
      }
    ],
    [getFontStyleData, fontClassName, deviceMode]
  );

  const getToolbarItemsCallback = useCallback(
    (el: FontStyleEditorData): OptionDefinition[] =>
      getToolbarItems(el, (newValue: ModelType) =>
        handleChange(el.id, newValue)
      ),
    [getToolbarItems, handleChange]
  );

  const handleChangeCallback = useCallback(
    (id: string) => (newValue: Partial<FontStyleEditorItem>) =>
      handleChange(id, newValue),
    [handleChange]
  );

  const items = [...reversedExtraFontStyles, ...fontStyles]
    .filter((el) => !el.deleted)
    .map((el, index) => (
      <FontStyleItem
        {...el}
        toolbarItems={() => getToolbarItemsCallback(el)}
        sampleStyle={getSampleStyle(el)}
        key={el.id}
        showDeleteIcon={el.deletable === "on"}
        onChange={handleChangeCallback(el.id)}
        itemIndex={index}
        className={fontClassName}
        numItems={item.numItems}
        animationCounter={item.animationCounter}
      />
    ));

  const className = classnames("brz-ed-option__font-styles", {
    "brz-ed-option__font-styles--new-item": item.brzNewItem
  });

  return (
    <>
      {label ? <Label label={label} /> : null}
      <FontStyle
        className={className}
        ref={scrollRef}
        items={items}
        onClick={handleAddNew}
      />
    </>
  );
};
