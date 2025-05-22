import classNames from "classnames";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ToastNotification } from "visual/component/Notifications";
import Options from "visual/component/Options";
import { useConfig } from "visual/providers/ConfigProvider";
import { getDynamicContentPlaceholders } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import {
  configChoicesToSelectItemChoices,
  findDCChoiceByPlaceholder
} from "visual/utils/options/Population/utils";
import { optionsToChoices } from "visual/utils/options/getDynamicContentChoices";
import { FCP } from "visual/utils/react/types";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { auto, isAuto } from "visual/utils/string/specs";
import { PopulationMethod } from "../../types/PopulationMethod";
import Input from "../Input";
import { Loading } from "../Loading";
import { PopulationSelect } from "../Select";
import { Props } from "./types";

const EMPTY = "";

export const PopulationChoices: FCP<Props, ReactElement> = (props) => {
  let input;
  const {
    type,
    iconOnly,
    value,
    option,
    choices: _choices,
    className,
    mockValue,
    onChange
  } = props;
  const { population, populationEntityType = auto } = value;

  const config = useConfig();

  const configChoices = useMemo(() => {
    return configChoicesToSelectItemChoices({ iconOnly, mockValue }, _choices);
  }, [_choices, iconOnly, mockValue]);

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
    (async () => {
      if (!isAuto(populationEntityType) && type) {
        try {
          const choices =
            (await getDynamicContentPlaceholders(config.dynamicContent, {
              entityType: populationEntityType,
              groupType: type
            })) ?? [];

          if (mounted.current) {
            setChoices(
              configChoicesToSelectItemChoices(
                { mockValue, iconOnly },
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
  }, [
    configChoices,
    populationEntityType,
    type,
    mockValue,
    iconOnly,
    config.dynamicContent
  ]);

  const existChoices = choices.length > 0;

  const handleRemove = useCallback(
    () =>
      onChange({
        population: EMPTY,
        populationEntityType: EMPTY,
        populationEntityId: EMPTY
      }),
    [onChange]
  );

  const selectedPlaceholder: PopulationMethod | undefined = useMemo(() => {
    return findDCChoiceByPlaceholder({
      placeholder: Str.read(population) ?? "",
      choices
    });
  }, [choices, population]);

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

  const cls = classNames(className, {
    "brz-ed-control-grid--gap": existChoices
  });
  const _className = classNames("brz-ed-option-population", {
    "brz-control__select-population--only-icon": iconOnly
  });

  return (
    <div className={cls}>
      {!isLoaded && !iconOnly ? <Loading /> : input}
      {existChoices ? (
        <PopulationSelect<string>
          className={_className}
          choices={choices}
          value={value.population ?? ""}
          entityType={value.populationEntityType ?? auto}
          currentDCChoice={activeItem}
          entityId={value.populationEntityId ?? ""}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
};
