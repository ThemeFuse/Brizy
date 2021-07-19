import React, { ReactElement } from "react";
import classnames from "classnames";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import SelectOptgroup from "visual/component/Controls/Select/SelectOptgroup";
import EditorIcon from "visual/component/EditorIcon";
import { Choices, OptGroup } from "./types/Choices";
import { isOptgroup } from "./utils";

export interface Props<T extends string | number> {
  value: T;
  choices: (Choices<T> | OptGroup<T>)[];
  onChange: (v: T) => void;
  className?: string;
}

const renderChoices = <T extends string | number>(
  choices: (Choices<T> | OptGroup<T>)[],
  value: T
): ReactElement[] => {
  return choices.map(choice => {
    if (isOptgroup(choice)) {
      const { title, icon, optgroup } = choice;

      return (
        <SelectOptgroup
          key={title || icon}
          title={title}
          items={renderChoices(optgroup, value)}
        >
          {icon && <EditorIcon icon={icon} />}
          <span className="brz-span">{title}</span>
        </SelectOptgroup>
      );
    }
    const { value: v, title, icon } = choice;

    return (
      <SelectItem key={v} value={v} title={title} active={v === value}>
        {icon && <EditorIcon icon={icon} />}
        <span className="brz-span">{title}</span>
      </SelectItem>
    );
  });
};

export default function PopulationSelect<T extends string | number>({
  choices,
  value,
  onChange,
  className
}: Props<T>): ReactElement {
  const _className = classnames(
    "brz-control__select--dark",
    "brz-control__select__auto",
    "brz-control__select-population",
    { "brz-control__select--active": Boolean(value) },
    className
  );

  return (
    <Select
      className={_className}
      defaultValue={value}
      itemHeight={30}
      labelType="icon"
      labelIcon="nc-dynamic"
      onChange={onChange}
    >
      {renderChoices(choices, value)}
    </Select>
  );
}
