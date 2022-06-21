import React, { FC, ReactElement } from "react";
import classNames from "classnames";
import { isT } from "fp-utilities";
import Input from "./Input";
import Select from "./Select";
import * as O from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";
import { Value, empty, eq, read } from "./types/Value";
import {
  PopulationMethod,
  PopulationOptgroupMethod
} from "./types/PopulationMethod";
import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import Options from "visual/component/Options";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { t } from "visual/utils/i18n";
import { isOptgroup } from "./utils";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { findDeep } from "visual/utils/object";

interface Config {
  iconOnly?: boolean;
  choices?: Array<PopulationMethod | PopulationOptgroupMethod>;
}

interface Props extends O.Props<Value>, WithConfig<Config>, WithClassName {
  options?: ToolbarItemType[];
}

interface Type
  extends FC<Props>,
    O.OptionType<Value>,
    O.SelfFilter<"population-dev"> {}

export const Population: Type = ({
  config,
  value = empty,
  onChange,
  options = [],
  className,
  label
}) => {
  let input;
  const choices = [
    ...(config?.iconOnly
      ? [
          {
            title: t("Custom Text"),
            value: empty.population
          }
        ]
      : []),
    ...(config?.choices || [])
  ];
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
    const active: PopulationMethod | null = findDeep(
      choices,
      (option: PopulationMethod | PopulationOptgroupMethod): boolean => {
        return !isOptgroup(option) && option.value === value.population;
      }
    ).obj;

    if (!config?.iconOnly) {
      input = (
        <Input value={active ? active.title : t("N/A")} onChange={_onChange} />
      );
    } else {
      if (!active) {
        choices.push({
          title: t("N/A"),
          value: value.population
        });
      }
    }
  } else {
    input = renderOptions();
  }

  return (
    <>
      {label}
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
    </>
  );
};

const getModel: FromElementModel<Value> = get => ({
  population: String.read(get("population"))
});

const getElementModel: ToElementModel<Value> = values => {
  return {
    population: values.population
  };
};

Population.fromElementModel = getModel;
Population.toElementModel = getElementModel;

Population.defaultValue = {
  population: ""
};

Population.filter = (f, t) => ({
  ...t,
  options: t.options?.map(f).filter(isT)
});

Population.reduce = (fn, t0, item) => item.options?.reduce(fn, t0) ?? t0;

Population.map = (fn, item) => ({ ...item, options: item.options?.map(fn) });
