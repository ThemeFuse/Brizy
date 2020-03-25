import React, { useCallback } from "react";
import T from "prop-types";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n/t";
import { ColorPickerSelect } from "visual/component/Controls/ColorPickerSelect";
import * as BorderStyle from "visual/component/Options/types/dev/Border/entities/style";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as BorderWidthType from "visual/component/Options/types/dev/Border/entities/widthType";
import MultiInputPickerOptionType from "visual/component/Options/types/MultiInputPickerOptionType";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { getWidthKey } from "./utils";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";

/**
 * @param {Border} value
 * @param {function(object, meta: object)} onChange
 * @param props
 * @return {*}
 * @constructor
 */
export const Border = ({ value, onChange, ...props }) => {
  const className = classNames("brz-ed-control__border", props.className);
  const onHex = useCallback(
    hex =>
      onChange(
        {
          select: value.style,
          hex: hex,
          opacity: value.opacity,
          palette: value.palette
        },
        { isChanged: "hex" }
      ),
    [onChange]
  );
  const onWidth = useCallback(
    (v = {}) => {
      switch (v.isChanged) {
        case "type":
          onChange({ ...value, widthType: v.type }, { isChanged: "widthType" });
          break;
        case "value":
          if (v.type === BorderWidthType.GROUPED) {
            onChange({ ...value, width: v.grouped[0] }, { isChanged: "width" });
          } else {
            const key = getWidthKey(v.isChangedIndex);
            onChange(
              { ...value, [key]: v.ungrouped[v.isChangedIndex] },
              { isChanged: key }
            );
          }
          break;
      }
    },
    [onChange]
  );

  return (
    <div className={className}>
      <ColorPickerSelect
        onChange={onChange}
        value={{
          select: value.style,
          hex: value.hex,
          opacity: value.opacity,
          palette: value.palette
        }}
        opacity={props.opacity}
        palette={props.palette}
        paletteOpenSettings={props.paletteOpenSettings}
      >
        {props.styles.map(({ id, title, icon }) => {
          return (
            <Item key={id} value={id} active={value.style === id}>
              {title && <span>{title}</span>}
              {icon && <EditorIcon icon={icon} className="brz-icon" />}
            </Item>
          );
        })}
      </ColorPickerSelect>
      <ColorPickerInputs value={value.hex} onChange={onHex}>
        <MultiInputPickerOptionType
          min={0}
          label={value.widthType === BorderWidthType.GROUPED ? t("Size") : ""}
          value={{
            type: value.widthType,
            grouped: [value.width],
            ungrouped: [
              value.topWidth,
              value.rightWidth,
              value.bottomWidth,
              value.leftWidth
            ]
          }}
          onChange={onWidth}
        />
      </ColorPickerInputs>
    </div>
  );
};

Border.propTypes = {
  className: T.string,
  opacity: T.bool,
  styles: T.arrayOf(
    T.shape({
      id: T.string,
      title: T.string,
      icon: T.string
    })
  ),
  palette: ColorPickerSelect.propTypes.palette,
  paletteOpenSettings: ColorPickerSelect.propTypes.paletteOpenSettings,
  value: T.shape({
    style: T.oneOf(BorderStyle.styles),
    hex: T.string,
    opacity: T.number,
    palette: T.oneOf(Palette.palettes),
    widthType: T.oneOf(BorderWidthType.types),
    width: T.number,
    topWidth: T.number,
    rightWidth: T.number,
    bottomWidth: T.number,
    leftWidth: T.number
  }),
  onChange: T.func.isRequired
};

Border.defaultProps = {
  className: "",
  styles: [],
  palette: [],
  value: {}
};
