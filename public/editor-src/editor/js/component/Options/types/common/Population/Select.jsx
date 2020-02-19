import React from "react";
import classnames from "classnames";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import EditorIcon from "visual/component/EditorIcon";

export default function PopulationSelect({
  choices,
  value,
  onChange,
  className
}) {
  const _className = classnames(
    "brz-control__select--dark",
    "brz-control__select__auto",
    "brz-control__select-population",
    { "brz-control__select--active": Boolean(value) },
    className
  );
  const items = choices.map(({ title, icon, value: v }) => {
    return (
      <SelectItem key={v} value={v} title={title} active={v === value}>
        {icon && <EditorIcon icon={icon} />}
        <span className="brz-span">{title}</span>
      </SelectItem>
    );
  });

  return (
    <Select
      className={_className}
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
