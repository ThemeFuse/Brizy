import classNames from "classnames";
import React, { FC, ReactElement, useCallback, useMemo } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { pipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { Literal } from "visual/utils/types/Literal";
import Input from "./Input";
import Select from "./Select";
import { Handler } from "./types/Handler";
import {
  PopulationMethod,
  PopulationOptgroupMethod
} from "./types/PopulationMethod";
import { Value } from "./types/Value";
import { findDCChoiceByPlaceholder, parsePopulation } from "./utils";

interface Config {
  iconOnly?: boolean;
  mockValue?: boolean;
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
  entityType: string;
  entityId: Literal;
  currentDCChoice?: PopulationMethod;
  onChange: (s: Value) => void;
}

interface IconProps {
  className?: string;
  iconOnly?: boolean;
  handlerChoices: Required<Config>["handlerChoices"];
  value: string;
  entityType: string;
  entityId: Literal;
  onChange: (s: Value) => void;
}

const _Select = (props: SelectProps): ReactElement => {
  const {
    className,
    choices,
    value,
    entityType,
    entityId,
    currentDCChoice,
    onChange
  } = props;
  return (
    <Select<string>
      className={className}
      choices={choices}
      value={value}
      currentDCChoice={currentDCChoice}
      entityType={entityType}
      entityId={entityId}
      onChange={onChange}
    />
  );
};

const CHOICE_HANDLER = "CHOICE_HANDLER";
const EMPTY = "";

const _Icon = (props: IconProps): ReactElement => {
  const {
    className,
    value,
    entityType,
    entityId,
    handlerChoices,
    iconOnly,
    onChange
  } = props;

  const choices = useMemo(() => {
    if (iconOnly) {
      return [
        { title: t("Custom Text"), value: EMPTY, name: EMPTY },
        { title: t("Others"), value: CHOICE_HANDLER, name: EMPTY }
      ];
    }

    return [];
  }, [iconOnly]);

  const extra = useMemo(
    () => ({
      placeholder: value
    }),
    [value]
  );

  const handleChange = useCallback(
    ({ population: value }) => {
      if (value === CHOICE_HANDLER) {
        handlerChoices(
          (v) =>
            onChange({
              population: v,
              populationEntityType: EMPTY,
              populationEntityId: EMPTY
            }),
          ToastNotification.error,
          extra
        );
      } else {
        onChange({
          population: value,
          populationEntityType: EMPTY,
          populationEntityId: EMPTY
        });
      }
    },
    [onChange, handlerChoices, extra]
  );

  const handleClick = useCallback(() => {
    handlerChoices(
      (v) =>
        onChange({
          population: v,
          populationEntityType: EMPTY,
          populationEntityId: EMPTY
        }),
      ToastNotification.error,
      extra
    );
  }, [onChange, handlerChoices, extra]);

  if (choices.length > 0) {
    return (
      <Select
        className={className}
        value={value !== EMPTY ? CHOICE_HANDLER : EMPTY}
        choices={choices}
        entityType={entityType}
        entityId={entityId}
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
  const { iconOnly, handlerChoices } = config ?? {};
  const { population } = value;

  const choices = useMemo(() => {
    if (typeof handlerChoices === "function" || !config) {
      return [];
    }

    const { mockValue = true, choices } = config;

    return [
      ...(mockValue && !iconOnly
        ? [
            {
              title: t("None"),
              value: EMPTY,
              name: EMPTY,
              attr: {},
              varyAttr: []
            }
          ]
        : []),
      ...(iconOnly
        ? [
            {
              title: t("Custom Text"),
              value: EMPTY,
              name: EMPTY,
              attr: {},
              varyAttr: []
            }
          ]
        : []),
      ...(choices || [])
    ];
  }, [config, handlerChoices, iconOnly]);

  const existChoices = choices.length > 0;

  const handlePopulationChange = useCallback<OnChange<Value>>(
    (v) => pipe(parsePopulation, onChange)(v),
    [onChange]
  );

  const handleRemove = useCallback(
    () =>
      onChange({
        population: EMPTY,
        populationEntityType: EMPTY,
        populationEntityId: EMPTY
      }),
    [onChange]
  );

  // const fallbackOptions = useMemo(
  // (): ReactNode => (fallback ? <Options data={[fallback]} /> : null),
  // [fallback]
  // );
  const _className = classNames(className, "brz-ed-option-population", {
    "brz-control__select-population--only-icon": !!iconOnly
  });

  const selectedPlaceholder: PopulationMethod | undefined = useMemo(() => {
    if (typeof config?.handlerChoices === "function" && population) {
      return {
        title: population,
        value: EMPTY,
        name: EMPTY,
        attr: {},
        varyAttr: []
      };
    }

    return findDCChoiceByPlaceholder({
      placeholder: Str.read(population) ?? "",
      choices
    });
  }, [config?.handlerChoices, choices, population]);

  const activeItem =
    selectedPlaceholder &&
    Obj.isObject(selectedPlaceholder) &&
    !Array.isArray(selectedPlaceholder)
      ? selectedPlaceholder
      : undefined;

  if (value.population !== undefined) {
    // fallback removed temporary, will be added with new design later
    if (!iconOnly) {
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
          value: value.population ?? EMPTY,
          name: EMPTY,
          attr: {},
          varyAttr: []
        });
      }
    }
  } else {
    input = option ? (
      <Options
        data={[option]}
        wrapOptions={false}
        optionClassName={"brz-ed-option-population"}
      />
    ) : null;
  }

  const cls = classNames(className, "brz-ed-control__population", {
    "brz-ed-control-grid--gap": existChoices
  });

  return (
    <>
      {label}
      <div className={cls}>
        {input}
        {existChoices ? (
          <_Select
            className={_className}
            choices={choices}
            value={value.population ?? ""}
            entityType={value.populationEntityType ?? ""}
            currentDCChoice={activeItem}
            entityId={value.populationEntityId ?? ""}
            onChange={handlePopulationChange}
          />
        ) : null}
        {typeof handlerChoices === "function" ? (
          <_Icon
            iconOnly={iconOnly}
            className={_className}
            handlerChoices={handlerChoices}
            value={value.population ?? ""}
            entityType={value.populationEntityType ?? ""}
            entityId={value.populationEntityId ?? ""}
            onChange={handlePopulationChange}
          />
        ) : null}
      </div>
    </>
  );
};
