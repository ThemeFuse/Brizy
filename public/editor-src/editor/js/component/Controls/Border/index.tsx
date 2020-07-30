import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { mApply } from "visual/utils/value";
import { t } from "visual/utils/i18n/t";
import EditorIcon from "visual/component/EditorIcon";
import { ColorPickerSelect } from "visual/component/Controls/ColorPickerSelect";
import * as BorderWidthType from "visual/component/Options/types/dev/Border/entities/widthType";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { toggleType } from "./utils";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import { WithClassName } from "visual/utils/options/attributes";
import { OnChange } from "visual/component/Options/Type";
import * as BorderStyle from "visual/component/Options/types/dev/Border/entities/style";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import {
  Meta,
  Value
} from "visual/component/Controls/ColorPickerSelect/entities";
import { Width } from "./Width";

type Style = BorderStyle.Style;

export type StyleObject = {
  id: Style;
  title: string;
  icon: string;
};

type Props = WithClassName & {
  enableOpacity: boolean;
  styles: StyleObject[];
  paletteList: PaletteObject[];
  paletteOpenSettings: () => void;
  widthTypes: ("grouped" | "ungrouped")[];
  style: Style;
  onChangeStyle: OnChange<Style>;
  hex: string;
  onChangeHex: OnChange<string>;
  opacity: number;
  onChangeOpacity: (v: number, editing: boolean) => void;
  palette: Palette.Palette;
  onChangePalette: OnChange<Palette.Palette>;
  widthType: BorderWidthType.WidthType;
  onChangeWidthType: OnChange<BorderWidthType.WidthType>;
  width: number;
  onChangeWidth: OnChange<number>;
  topWidth: number;
  onChangeTopWidth: OnChange<number>;
  rightWidth: number;
  onChangeRightWidth: OnChange<number>;
  bottomWidth: number;
  onChangeBottomWidth: OnChange<number>;
  leftWidth: number;
  onChangeLeftWidth: OnChange<number>;
};

export const Border: FC<Props> = ({
  className,
  widthTypes,
  styles,
  hex,
  onChangeHex,
  palette,
  onChangePalette,
  opacity,
  onChangeOpacity,
  style,
  onChangeStyle,
  widthType,
  onChangeWidthType,
  width,
  onChangeWidth,
  topWidth,
  onChangeTopWidth,
  rightWidth,
  onChangeRightWidth,
  bottomWidth,
  onChangeBottomWidth,
  leftWidth,
  onChangeLeftWidth,
  ...props
}) => {
  const _className = classNames("brz-ed-control__border", className);
  const onColor = useCallback(
    (v: Value<Style>, meta: Meta) => {
      switch (meta.isChanged) {
        case "select":
          mApply(onChangeStyle, v.select);
          break;
        case "hex":
          onChangeHex(v.hex);
          break;
        case "opacity":
          onChangeOpacity(v.opacity, meta?.opacityDragEnd ?? true);
          break;
        case "palette":
          onChangePalette(v.palette as Palette.Palette);
          break;
      }
    },
    [
      hex,
      onChangeHex,
      palette,
      onChangePalette,
      opacity,
      onChangeOpacity,
      style,
      onChangeStyle
    ]
  );
  const onTypeChange = useCallback(
    () => onChangeWidthType(toggleType(widthType)),
    [widthType, onChangeWidthType]
  );

  const buttonClassName = classNames("brz-button", {
    "brz-ed-control__border__widthType": true,
    "brz-ed-control__border__widthType--active": widthType === "grouped"
  });

  const grouped = widthType === "grouped" || !widthTypes.includes("ungrouped");

  return (
    <div className={_className}>
      <ColorPickerSelect<Style>
        onChange={onColor}
        value={{
          select: style,
          hex: hex,
          opacity: opacity,
          palette: palette
        }}
        opacity={props.enableOpacity}
        palette={props.paletteList}
        paletteOpenSettings={props.paletteOpenSettings}
      >
        {styles.map(({ id, title, icon }) => {
          return (
            <Item<Style> key={id} value={id}>
              {title && <span>{title}</span>}
              {icon && <EditorIcon icon={icon} className="brz-icon" />}
            </Item>
          );
        })}
      </ColorPickerSelect>
      <ColorPickerInputs value={hex} onChange={onChangeHex}>
        {grouped ? (
          <div className="brz-ed-control__border__width">
            <div className="brz-label">{t("Size")}</div>
            <Width value={width} onChange={onChangeWidth} />
          </div>
        ) : (
          <div className="brz-ed-control__border__width">
            <Width value={topWidth} onChange={onChangeTopWidth} />
            <Width value={rightWidth} onChange={onChangeRightWidth} />
            <Width value={bottomWidth} onChange={onChangeBottomWidth} />
            <Width value={leftWidth} onChange={onChangeLeftWidth} />
          </div>
        )}
        {widthTypes.length < 2 ? null : (
          <button className={buttonClassName} onClick={onTypeChange}>
            <EditorIcon icon={"nc-combined-shape"} className="brz-icon" />
          </button>
        )}
      </ColorPickerInputs>
    </div>
  );
};
