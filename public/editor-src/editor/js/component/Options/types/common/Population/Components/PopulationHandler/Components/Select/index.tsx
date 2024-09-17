import React, { useState } from "react";
import cn from "classnames";
import { Dropdown } from "visual/component/Controls/Population/Components/Dropdown";
import Control from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { Props } from "./types";

export const Select = (props: Props): JSX.Element => {
  const { choices, className, value, onChange } = props;
  const [open, setOpen] = useState(false);
  const _className = cn(
    "brz-control__select--dark",
    "brz-control__select__auto",
    "brz-control__select-population",
    { "brz-control__select--active": Boolean(value) },
    className
  );
  return (
    <Dropdown
      className="brz-control__select-population--only-icon"
      isOpen={open}
      onOpened={setOpen}
    >
      <Control
        className={_className}
        defaultValue={value}
        itemHeight={30}
        onChange={onChange}
      >
        {choices.map(({ value: v, title }) => (
          <SelectItem key={v} value={v} title={title} active={v === value}>
            <span className="brz-span">{title}</span>
          </SelectItem>
        ))}
      </Control>
    </Dropdown>
  );
};
