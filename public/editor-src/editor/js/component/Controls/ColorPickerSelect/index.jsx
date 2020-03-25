import React from "react";
import T from "prop-types";
import classNames from "classnames";
import { ColorPicker3 } from "visual/component/Controls/ColorPicker3";
import { Select2 } from "visual/component/Controls/Select2";

export const ColorPickerSelect = props => {
  const className = classNames(
    props.className,
    "brz-ed-control__colorPickerSelect"
  );
  const onSelectChange = select =>
    props.onChange({ ...props.value, select }, { isChanged: "select" });

  return (
    <div className={className}>
      {props.children.length && (
        <Select2
          className="brz-control__select--dark brz-control__select__auto"
          value={props.value.select}
          editable={false}
          onChange={onSelectChange}
          size={"short"}
        >
          {props.children}
        </Select2>
      )}
      <ColorPicker3
        onChange={props.onChange}
        palette={props.palette}
        paletteOpenSettings={props.paletteOpenSettings}
        opacity={props.opacity}
        value={props.value}
      />
    </div>
  );
};

ColorPickerSelect.propTypes = {
  className: T.string,
  opacity: ColorPicker3.propTypes.opacity,
  hexInput: ColorPicker3.propTypes.hexInput,
  palette: ColorPicker3.propTypes.palette,
  paletteOpenSettings: ColorPicker3.propTypes.paletteOpenSettings,
  itemHeight: T.number,
  value: T.shape({
    hex: T.string.isRequired,
    opacity: T.number.isRequired,
    palette: T.string.isRequired,
    select: T.oneOfType([T.string, T.number]).isRequired
  }).isRequired,
  onChange: T.func.isRequired
};

ColorPickerSelect.defaultProps = {
  children: [],
  itemHeight: 24
};
