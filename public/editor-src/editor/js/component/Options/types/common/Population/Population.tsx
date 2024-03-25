import classNames from "classnames";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { OnChange } from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getDynamicContentPlaceholders } from "visual/utils/api/common";
import { pipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import {
  configChoicesToSelectItemChoices,
  findDCChoiceByPlaceholder,
  parsePopulation
} from "visual/utils/options/Population/utils";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { optionsToChoices } from "visual/utils/options/getDynamicContentChoices";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { auto, isAuto } from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import Input from "./Input";
import { Loading } from "./Loading";
import Select from "./Select";
import { Handler } from "./types/Handler";
import {
  PopulationMethod,
  PopulationOptgroupMethod
} from "./types/PopulationMethod";
import { Value } from "./types/Value";
import { FCP } from "visual/utils/react/types";

export interface Config {
  iconOnly?: boolean;
  mockValue?: boolean;
  type?: DCTypes;
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
    ({ population: value }: Value) => {
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

export const Population: FCP<Props, ReactElement> = ({
  config,
  value,
  onChange,
  option,
  className,
  label
}) => {
  let input;
  const { type, iconOnly, handlerChoices } = config ?? {};
  const { population, populationEntityType = auto } = value;
  const hasHandlerChoices = typeof handlerChoices === "function";

  const configChoices = useMemo(() => {
    if (hasHandlerChoices || !config) {
      return [];
    }

    const { choices } = config;

    return configChoicesToSelectItemChoices(config, choices ?? []);
  }, [config, hasHandlerChoices]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [choices, setChoices] = useState(configChoices);
  const mounted = useRef<boolean>();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHandlerChoices) {
      (async () => {
        if (!isAuto(populationEntityType) && type) {
          const _config = Config.getAll();

          try {
            const choices =
              (await getDynamicContentPlaceholders(_config, {
                entityType: populationEntityType,
                groupType: type
              })) ?? [];

            if (mounted.current) {
              setChoices(
                configChoicesToSelectItemChoices(
                  config ?? {},
                  optionsToChoices(choices)
                )
              );
            }
          } catch (e) {
            if (process.env.NODE_ENV === "development") {
              console.error(e);
            }
            ToastNotification.error(
              t("Failed to get DynamicContent placeholders")
            );

            if (mounted.current) {
              setIsLoaded(true);
            }
          }
        } else {
          if (mounted.current) {
            setChoices(configChoices);
          }
        }

        if (mounted.current) {
          setIsLoaded(true);
        }
      })();
    }
  }, [
    value,
    config,
    configChoices,
    populationEntityType,
    type,
    hasHandlerChoices
  ]);

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
        attr: {}
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
          attr: {}
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

  const cls = classNames(className, "brz-ed-control__population", {
    "brz-ed-control-grid--gap": existChoices
  });

  return (
    <>
      {label}
      <div className={cls}>
        {!isLoaded && !iconOnly ? <Loading /> : input}
        {hasHandlerChoices ? (
          <_Icon
            iconOnly={iconOnly}
            className={_className}
            handlerChoices={handlerChoices}
            value={value.population ?? ""}
            entityType={value.populationEntityType ?? auto}
            entityId={value.populationEntityId ?? ""}
            onChange={handlePopulationChange}
          />
        ) : existChoices ? (
          <_Select
            className={_className}
            choices={choices}
            value={value.population ?? ""}
            entityType={value.populationEntityType ?? auto}
            currentDCChoice={activeItem}
            entityId={value.populationEntityId ?? ""}
            onChange={handlePopulationChange}
          />
        ) : null}
      </div>
    </>
  );
};
