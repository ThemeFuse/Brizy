import React, { ComponentProps, FC } from "react";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";
import * as O from "visual/component/Options/Type";
import { BackgroundColor as Bg } from "visual/component/Controls/BackgroundColor";
import { Value } from "./entities/Value";
import { fromElementModel, toBgControlValue, toElementModel } from "./utils";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";
import { Literal } from "visual/utils/types/Literal";
import * as Model from "./model";
import {
  paletteHex,
  setOpacity
} from "visual/component/Options/types/dev/ColorPicker/utils";

export type Props = O.Props<Value, { [K in string]: Literal }> & {
  config: {
    opacity: boolean;
  };
};

const openSidebar = (): void => {
  getStore().dispatch(
    updateUI("leftSidebar", {
      isOpen: true,
      drawerContentType: "styling"
    })
  );
};

export const BackgroundColor: FC<Props> & O.OptionType<{}> = ({
  value,
  onChange,
  config
}) => {
  const _onChange: ComponentProps<typeof Bg>["onChange"] = (v, m) => {
    const isStart = !(value.type === "gradient" && value.active === "end");
    switch (m.isChanged) {
      case "type":
        onChange(toElementModel(Model.setType(v.type, value)));
        break;
      case "gradientType":
        onChange(toElementModel(Model.setGradientType(v.gradientType, value)));
        break;
      case "start":
        onChange(toElementModel(Model.setStart(v.start, value)));
        break;
      case "end":
        onChange(toElementModel(Model.setEnd(v.end, value)));
        break;
      case "active":
        onChange(toElementModel(Model.setActive(v.active, value)));
        break;
      case "degree": {
        if (value.type === "gradient") {
          const setter =
            value.gradientType === "radial"
              ? Model.setRadialDegree
              : Model.setLinearDegree;
          onChange(toElementModel(setter(v.degree, value)));
        }
        break;
      }
      case "hex": {
        const setter = isStart ? Model.setHex : Model.setHex2;
        onChange(toElementModel(setter(v.hex, value)));
        break;
      }
      case "opacity": {
        const setter = isStart ? Model.setOpacity : Model.setOpacity2;
        onChange(
          toElementModel(
            setOpacity(setter, v.opacity, value, !!m.opacityDragEnd)
          )
        );
        break;
      }
      case "palette": {
        const setter = isStart ? Model.setPalette : Model.setPalette2;
        onChange(toElementModel(setter(v.palette as Value["palette"], value)));
        break;
      }
    }
  };
  const palette = paletteColors();
  const _value: Value = {
    ...value,
    hex: paletteHex(value.palette, palette) ?? value.hex,
    hex2: paletteHex(value.palette2, palette) ?? value.hex2
  };
  return (
    <Bg
      value={toBgControlValue(_value)}
      onChange={_onChange}
      paletteOpenSettings={openSidebar}
      palette={paletteColors()}
      opacity={config?.opacity ?? true}
      gradientColors={[_value.hex, _value.hex2]}
    />
  );
};

BackgroundColor.getModel = fromElementModel;
