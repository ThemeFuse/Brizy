import React from "react";
import classnames from "classnames";
import Select from "visual/component/controls/Select";
import SelectItem from "visual/component/controls/Select/SelectItem";

export default function PopulationSelect({ choices, value, onChange }) {
  const className = classnames(
    "brz-control__select--dark",
    "brz-control__select__auto",
    "brz-control__select-population",
    { "brz-control__select--active": Boolean(value) }
  );
  const items = choices.map(({ title, icon, value }) => {
    return (
      <SelectItem key={value} value={value} title={title}>
        {icon && <EditorIcon icon={icon} />}
        <span className="brz-span">{title}</span>
      </SelectItem>
    );
  });

  return (
    <Select
      className={className}
      defaultValue={value}
      itemHeight={30}
      labelType="icon"
      labelIcon="nc-dynamic"
      onChange={onChange}
    >
      {items}
    </Select>
  );
}
