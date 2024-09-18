import classNames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  Props as ShadowProps,
  TextShadow as ShadowControl
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
import Config from "visual/global/Config";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import { WithClassName } from "visual/types/attributes";
import { getColorPaletteColors } from "visual/utils/color";
import { Palette } from "visual/utils/color/Palette";
import { mPipe } from "visual/utils/fp";
import { Meta } from "visual/utils/options/TextShadow/meta";
import * as Value from "visual/utils/options/TextShadow/types/Value";
import * as Utils from "visual/utils/options/TextShadow/utils";
import {
  options,
  SelectType,
  selectTypeFromValue,
  valueFromSelectType
} from "visual/utils/options/TextShadow/utils";

export interface Props
  extends OptionProps<Value.Value>,
    OptionMeta<Meta>,
    WithClassName {}

export const TextShadow = ({
  onChange,
  value,
  className
}: Props): ReactElement => {
  const dispatch = useDispatch();
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
    const config = Config.getAll();
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      config.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].includes(
      LeftSidebarOptionsIds.globalStyle
    );
  }, []);

  return (
    <ShadowControl<Palette, SelectType>
      opacity={true}
      className={_className}
      value={shadowValue}
      onChange={onValueChange}
      palette={getColorPaletteColors()}
      paletteOpenSettings={enableGlobalStyle ? openPaletteSidebar : undefined}
      options={options}
    />
  );
};
