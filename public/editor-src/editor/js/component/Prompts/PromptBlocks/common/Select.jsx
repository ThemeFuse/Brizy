import React from "react";
import classnames from "classnames";
import SelectControl from "visual/component/Controls/Select";
import SelectControlItem from "visual/component/Controls/Select/SelectItem";

export default function Select({
  className: _className,
  maxItems,
  itemHeight,
  options,
  value,
  onChange
}) {
  const className = classnames(
    "brz-ed-popup__select",
    "brz-ed-popup-control__select--light",
    _className
  );

  return (
    <SelectControl
      className={className}
      defaultValue={value}
      maxItems={maxItems}
      itemHeight={itemHeight}
      onChange={onChange}
    >
      {options.map(({ id, title }) => (
        <SelectControlItem key={id} value={id} title={title}>
          {title}
        </SelectControlItem>
      ))}
    </SelectControl>
  );
}

Select.defaultProps = {
  className: "",
  maxItems: 6,
  itemHeight: 30,
  options: [],
  value: "",
  onChange: () => {}
};
