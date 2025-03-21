import classNames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import {
  TextShadow as ShadowControl,
  Props as ShadowProps
} from "visual/component/Controls/TextShadow";
import {
  Meta as CMeta,
  Value as CValue
} from "visual/component/Controls/TextShadow/types";
import {
  GlobalMeta,
  Meta as OptionMeta,
  Props as OptionProps
} from "visual/component/Options/Type";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
import { updateUI } from "visual/redux/actions2";
import { currentStyleSelector } from "visual/redux/selectors";
import { PaletteType as Palette } from "visual/types/Style";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { is as isHex } from "visual/utils/color/Hex";
import { mPipe } from "visual/utils/fp";
import { Meta } from "visual/utils/options/TextShadow/meta";
import * as Value from "visual/utils/options/TextShadow/types/Value";
import * as Utils from "visual/utils/options/TextShadow/utils";
import {
  SelectType,
  getOptions,
  selectTypeFromValue,
  valueFromSelectType
} from "visual/utils/options/TextShadow/utils";

export interface Config {
  isPaletteHidden?: boolean;
}

export interface Props
  extends OptionProps<Value.Value>,
    OptionMeta<Meta>,
    WithConfig<Config>,
    WithClassName {}

export const TextShadow = ({
  onChange,
  value,
  className,
  config
}: Props): ReactElement => {
  const dispatch = useDispatch();
  const style = useSelector(currentStyleSelector);
  const { isPaletteHidden } = config ?? {};
  const colorPalette = useMemo((): PaletteObject[] | undefined => {
    if (isPaletteHidden) {
      return undefined;
    }

    return style.colorPalette
      .map((f) => ({ id: `${f.id}`, hex: f.hex }))
      .filter((p): p is PaletteObject => isHex(p.hex));
  }, [style, isPaletteHidden]);

  const globalConfig = useConfig();

  const _className = classNames("brz-ed-option__textShadow", className);
  const onValueChange = useCallback<
    ShadowProps<Palette, SelectType>["onChange"]
  >(
    (v, m) =>
      mPipe(
        (
          m: CValue<Palette, SelectType>,
          meta: CMeta<Palette, SelectType>
        ): {
          value: Value.Value;
          meta?: GlobalMeta;
        } => {
          const isChanging = !!meta.isChanging;
          switch (meta.isChanged) {
            case "opacity": {
              return {
                value: Value.setOpacity(
                  m.opacity as Value.Value["opacity"],
                  value
                ),
                meta: { isChanging }
              };
            }
            case "blur": {
              return {
                value: Value.setBlur(m.blur as Value.Value["blur"], value)
              };
            }
            case "hex": {
              return {
                value: Value.setHex(m.hex, value),
                meta: { isChanging }
              };
            }
            case "palette": {
              return {
                value: m.palette ? Value.setPalette(m.palette, value) : value
              };
            }
            case "horizontal": {
              return { value: Value.setHorizontal(m.horizontal, value) };
            }
            case "vertical": {
              return { value: Value.setVertical(m.vertical, value) };
            }
            case "select":
              return { value: valueFromSelectType(m.select, value) };
          }
        },
        (v) => onChange(v.value, v.meta)
      )(v, m),
    [onChange, value]
  );
  const openPaletteSidebar = useCallback(
    () =>
      dispatch(
        updateUI("leftSidebar", {
          isOpen: true,
          drawerContentType: LeftSidebarOptionsIds.globalStyle
        })
      ),
    [dispatch]
  );

  const shadowValue = useMemo<ShadowProps<Palette, SelectType>["value"]>(
    () => ({
      ...value,
      palette: Utils.getPalette(value),
      select: selectTypeFromValue(value)
    }),
    [value]
  );

  const enableGlobalStyle = useMemo((): boolean => {
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      globalConfig?.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].some(
      (tab) => tab.type === LeftSidebarOptionsIds.globalStyle
    );
  }, [globalConfig?.ui?.leftSidebar]);

  const options = getOptions();

  return (
    <ShadowControl<Palette, SelectType>
      opacity={true}
      className={_className}
      value={shadowValue}
      onChange={onValueChange}
      palette={colorPalette}
      paletteOpenSettings={enableGlobalStyle ? openPaletteSidebar : undefined}
      options={options}
    />
  );
};
