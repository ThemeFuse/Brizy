import React from "react";
import classNames from "classnames";
import { ColorPickerSelect } from "visual/component/Controls/ColorPickerSelect";
import T from "prop-types";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import MultiInputOptionType from "visual/component/Options/types/MultiInput";
import { getModifiedField } from "visual/component/Controls/BoxShadow/utils";
import { types } from "visual/component/Options/types/dev/BoxShadow/entities/type";

export const BoxShadow = ({ value, ...props }) => {
  const className = classNames("brz-ed-control__boxShadow", props.className);
  const fieldChange = fields => {
    const [blur, spread, vertical, horizontal] = fields;
    const current = [
      value.blur,
      value.spread,
      value.vertical,
      value.horizontal
    ];
    const isChanged = getModifiedField(fields, current);
    if (isChanged) {
      props.onChange(
        { ...value, blur, spread, vertical, horizontal },
        { isChanged }
      );
    }
  };

  return (
    <div className={className}>
      <ColorPickerSelect
        onChange={props.onChange}
        value={{
          select: value.type,
          hex: value.hex,
          opacity: value.opacity,
          palette: value.palette
        }}
        opacity={props.opacity}
        palette={props.palette}
        paletteOpenSettings={props.paletteOpenSettings}
      >
        {props.types.map(({ id, title }) => {
          return (
            <SelectItem
              key={id}
              value={id}
              title={title}
              active={value.value === id}
            >
              <span>{title}</span>
            </SelectItem>
          );
        })}
      </ColorPickerSelect>
      <MultiInputOptionType
        config={{
          defaultIcon: ["nc-shadow"],
          icons: ["nc-blur", "nc-size", "nc-vertical", "nc-horizontal"]
        }}
        value={[value.blur, value.spread, value.vertical, value.horizontal]}
        onChange={fieldChange}
      />
    </div>
  );
};

BoxShadow.propTypes = {
  className: T.string,
  opacity: T.bool,
  types: T.arrayOf(
    T.shape({
      id: T.string,
      title: T.string
    })
  ),
  palette: ColorPickerSelect.propTypes.palette,
  paletteOpenSettings: ColorPickerSelect.propTypes.paletteOpenSettings,
  value: T.shape({
    type: T.oneOf(types),
    hex: T.string,
    opacity: T.number,
    palette: T.string,
    blur: T.number,
    spread: T.number,
    vertical: T.number,
    horizontal: T.number
  }),
  onChange: T.func.isRequired
};

BoxShadow.defaultProps = {
  className: "",
  types: [],
  palette: [],
  value: {}
};
