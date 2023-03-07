import classNames from "classnames";
import React, { FC, useCallback, useMemo } from "react";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { pipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { findDeep } from "visual/utils/object";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import Input from "./Input";
import Select from "./Select";
import {
  PopulationMethod,
  PopulationOptgroupMethod
} from "./types/PopulationMethod";
import { Value } from "./types/Value";
import { isOptgroup } from "./utils";

interface Config {
  iconOnly?: boolean;
  choices?: Array<PopulationMethod | PopulationOptgroupMethod>;
}

interface Props extends OptionProps<Value>, WithConfig<Config>, WithClassName {
  option?: ToolbarItemType;
  fallback?: ToolbarItemType;
}

export const Population: FC<Props> = ({
  config,
  value,
  onChange,
  option,
  className,
  label
}) => {
  let input;
  const choices = useMemo(
    () => [
      ...(config?.iconOnly
        ? [
            {
              title: t("Custom Text"),
              value: "" as const
            }
          ]
        : []),
      ...(config?.choices || [])
    ],
    [config?.choices]
  );

  const handlePopulationChange = useCallback<OnChange<string>>(
    pipe(NoEmptyString.fromString, (v) => onChange({ population: v })),
    [onChange]
  );

  const handleRemove = useCallback(
    () => onChange({ population: undefined }),
    [onChange]
  );

  // const fallbackOptions = useMemo(
  // (): ReactNode => (fallback ? <Options data={[fallback]} /> : null),
  // [fallback]
  // );
  const _className = classNames(className, "brz-ed-option-population", {
    "brz-control__select-population--only-icon": !!config?.iconOnly
  });

  if (value.population !== undefined) {
    const active: PopulationMethod | null = findDeep(
      choices,
      (option: PopulationMethod | PopulationOptgroupMethod): boolean => {
        return !isOptgroup(option) && option.value === value.population;
      }
    ).obj;

    // fallback removed temporary, will be added with new design later
    if (!config?.iconOnly) {
      input = (
        <Input
          value={active ? active.title : t("N/A")}
          onRemove={handleRemove}
        />
      );
    } else {
      if (!active) {
        choices.push({
          title: t("N/A"),
          value: value.population ?? ""
        });
      }
    }
  } else {
    input = option ? (
      <Options
        data={[option]}
        wrapOptions={false}
        optionClassName="brz-ed-option-population"
      />
    ) : null;
  }

  return (
    <>
      {label}
      <div className="brz-ed-control__population">
        {input}
        {choices.length > 0 ? (
          <Select<string>
            className={_className}
            choices={choices}
            value={value.population ?? ""}
            onChange={handlePopulationChange}
          />
        ) : null}
      </div>
    </>
  );
};
