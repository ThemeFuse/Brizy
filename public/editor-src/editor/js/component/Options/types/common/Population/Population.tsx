import classNames from "classnames";
import React, { FC, ReactElement, useCallback, useMemo } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { findDeep } from "visual/utils/object";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import Input from "./Input";
import Select from "./Select";
import { Handler } from "./types/Handler";
import {
  PopulationMethod,
  PopulationOptgroupMethod
} from "./types/PopulationMethod";
import { Value } from "./types/Value";
import { isOptgroup } from "./utils";

interface Config {
  iconOnly?: boolean;
  choices?: Array<PopulationMethod | PopulationOptgroupMethod>;
  handlerChoices?: Handler<string>;
}

interface Props extends OptionProps<Value>, WithConfig<Config>, WithClassName {
  option?: ToolbarItemType;
  fallback?: ToolbarItemType;
}

interface SelectProps {
  className?: string;
  choices: Required<Config>["choices"];
  value: string;
  onChange: (s: string) => void;
}

interface IconProps {
  className?: string;
  iconOnly?: boolean;
  handlerChoices: Required<Config>["handlerChoices"];
  value: string;
  onChange: (s: string) => void;
}

const _Select = (props: SelectProps): ReactElement => {
  const { className, choices, value, onChange } = props;
  return (
    <Select<string>
      className={className}
      choices={choices}
      value={value}
      onChange={onChange}
    />
  );
};

const CHOICE_HANDLER = "CHOICE_HANDLER";
const EMPTY = "";

const _Icon = (props: IconProps): ReactElement => {
  const { className, value, handlerChoices, iconOnly, onChange } = props;

  const choices = useMemo(() => {
    if (iconOnly) {
      return [
        { title: t("Custom Text"), value: EMPTY },
        { title: t("Others"), value: CHOICE_HANDLER }
      ];
    }

    return [];
  }, [iconOnly]);

  const handleChange = useCallback(
    (value) => {
      if (value === CHOICE_HANDLER) {
        handlerChoices(onChange, ToastNotification.error);
      } else {
        onChange(value);
      }
    },
    [onChange, handlerChoices]
  );

  const handleClick = useCallback(() => {
    handlerChoices(onChange, ToastNotification.error);
  }, [onChange, handlerChoices]);

  if (choices.length > 0) {
    return (
      <Select
        className={className}
        value={value !== EMPTY ? CHOICE_HANDLER : EMPTY}
        choices={choices}
        onChange={handleChange}
      />
    );
  }

  return (
    <EditorIcon
      className="brz-ed-control__population--handler"
      icon="nc-dynamic"
      onClick={handleClick}
    />
  );
};

export const Population: FC<Props> = ({
  config,
  value,
  onChange,
  option,
  className,
  label
}) => {
  let input;
  const choices = useMemo(() => {
    if (typeof config?.handlerChoices === "function") {
      return [];
    }

    return [
      ...(config?.iconOnly
        ? [
            {
              title: t("Custom Text"),
              value: EMPTY
            }
          ]
        : []),
      ...(config?.choices || [])
    ];
  }, [config?.choices, config?.handlerChoices]);

  const handlePopulationChange = useCallback<OnChange<string>>(
    (v: string) => onChange({ population: v }),
    [onChange]
  );

  const handleRemove = useCallback(
    () => onChange({ population: "" }),
    [onChange]
  );

  // const fallbackOptions = useMemo(
  // (): ReactNode => (fallback ? <Options data={[fallback]} /> : null),
  // [fallback]
  // );
  const _className = classNames(className, "brz-ed-option-population", {
    "brz-control__select-population--only-icon": !!config?.iconOnly
  });

  const activeItem = useMemo(() => {
    if (typeof config?.handlerChoices === "function" && value.population) {
      return { title: value.population };
    }

    const active: PopulationMethod | null = findDeep(
      choices,
      (option: PopulationMethod | PopulationOptgroupMethod): boolean => {
        return !isOptgroup(option) && option.value === value.population;
      }
    ).obj;

    if (active) {
      return { title: active.title };
    }

    return null;
  }, [config?.handlerChoices, choices]);

  if (value.population !== undefined) {
    // fallback removed temporary, will be added with new design later
    if (!config?.iconOnly) {
      input = (
        <Input
          value={activeItem ? activeItem.title : t("N/A")}
          onRemove={handleRemove}
        />
      );
    } else {
      if (!activeItem) {
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
          <_Select
            className={_className}
            choices={choices}
            value={value.population ?? ""}
            onChange={handlePopulationChange}
          />
        ) : null}
        {typeof config?.handlerChoices === "function" ? (
          <_Icon
            iconOnly={config.iconOnly}
            className={_className}
            handlerChoices={config.handlerChoices}
            value={value.population ?? ""}
            onChange={handlePopulationChange}
          />
        ) : null}
      </div>
    </>
  );
};
