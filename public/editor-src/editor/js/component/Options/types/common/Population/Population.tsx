import React, { FC, ReactElement } from "react";
import classNames from "classnames";
import Input from "./Input";
import Select from "./Select";
import * as O from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";
import { Value, empty, eq, read } from "./types/Value";
import { PopulationMethod } from "./types/PopulationMethod";
import { GetModel, OptionDefinition } from "visual/component/Options/Type";
import Options from "visual/component/Options";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

interface Config {
  iconOnly?: boolean;
  choices?: Array<PopulationMethod>;
}

interface Props
  extends O.Props<Value, Value>,
    WithConfig<Config>,
    WithClassName {
  options?: OptionDefinition[];
}

interface Type extends FC<Props>, O.OptionType<Value>, O.SelfFilter<Props> {}

export const Population: Type = ({
  config,
  value = empty,
  onChange,
  options = [],
  className
}) => {
  let input;
  const choices = config?.choices || [];
  const _onChange = (v: string): void => {
    onChange(read(v) || empty);
  };
  const renderOptions = (): ReactElement => (
    <Options
      data={options}
      wrapOptions={false}
      optionClassName="brz-ed-option-population"
    />
  );
  const _className = classNames(className, "brz-ed-option-population", {
    "brz-control__select-population--only-icon": !!config?.iconOnly
  });

  if (!eq(value, empty)) {
    const active = choices.find(i => i.value === value.population);

    if (active) {
      input = config?.iconOnly ? null : (
        <Input value={active.title} onChange={_onChange} />
      );
    } else {
      input = renderOptions();
    }
  } else {
    input = renderOptions();
  }

  return (
    <div className="brz-ed-control__population">
      {input}
      {choices.length > 0 ? (
        <Select
          className={_className}
          choices={choices}
          value={value.population}
          onChange={_onChange}
        />
      ) : null}
    </div>
  );
};

const getModel: GetModel<Value> = get => ({
  population: String.read(get("population")) || ""
});

Population.getModel = getModel;
Population.shouldOptionBeFiltered = ({ config }): boolean =>
  !!config?.iconOnly && (config?.choices ?? []).length === 0;
