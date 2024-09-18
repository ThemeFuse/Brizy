import React, { useCallback } from "react";
import cn from "classnames";
import { pipe } from "@brizy/readers";
import { parsePopulation } from "visual/utils/options/Population/utils";
import Options from "visual/component/Options";
import { isChoices, isHandler, Props } from "./types/Props";
import { PopulationHandler } from "./Components/PopulationHandler";
import { PopulationChoices } from "./Components/PopulationChoices";
import { OnChange } from "visual/component/Options/Type";
import { Value } from "./types/Value";

export function Population(props: Props): JSX.Element {
  const { config, onChange } = props;

  const handlePopulationChange = useCallback<OnChange<Value>>(
    (v) => pipe(parsePopulation, onChange)(v),
    [onChange]
  );

  const { value, className: _className, label, option } = props;

  // Population Options is wrapped all options.
  // If we return null, the entire options will not be rendered.
  if (!config) {
    return (
      <>
        {label}
        {option !== undefined && (
          <Options
            data={[option]}
            wrapOptions={false}
            optionClassName="brz-ed-option-population"
          />
        )}
      </>
    );
  }

  const { iconOnly, type, mockValue } = config;
  const className = cn(_className, "brz-ed-control__population");

  // Population with handler
  if (isHandler(config)) {
    return (
      <>
        {label}
        <PopulationHandler
          className={className}
          iconOnly={iconOnly}
          type={type}
          mockValue={mockValue}
          handlerChoices={config.handlerChoices}
          value={value}
          option={option}
          onChange={handlePopulationChange}
        />
      </>
    );
  }

  // Population with choices
  if (isChoices(config)) {
    return (
      <>
        {label}
        <PopulationChoices
          className={className}
          iconOnly={iconOnly}
          option={option}
          value={value}
          type={type}
          mockValue={mockValue}
          choices={config.choices}
          onChange={handlePopulationChange}
        />
      </>
    );
  }

  return <></>;
}
