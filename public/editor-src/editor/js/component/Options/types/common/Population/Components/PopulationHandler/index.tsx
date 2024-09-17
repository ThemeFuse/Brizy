import React, { useCallback, useMemo } from "react";
import cn from "classnames";
import { Props } from "./types";
import { t } from "visual/utils/i18n";
import { ToastNotification } from "visual/component/Notifications";
import { PopulationIcon } from "visual/component/Controls/Population/PopulationIcon";
import { PopulationInput } from "../Input";
import Options from "visual/component/Options";
import { Select } from "./Components/Select";

const CHOICE_HANDLER = "CHOICE_HANDLER";
const CUSTOM_TEXT = "CUSTOM_TEXT";
const EMPTY = "";

export const PopulationHandler = (props: Props): JSX.Element => {
  const { className, value, handlerChoices, iconOnly, option, onChange } =
    props;
  const { population } = value;
  const defaultValue = population ?? CUSTOM_TEXT;

  const choices = useMemo(() => {
    if (iconOnly) {
      return [
        { title: t("Custom Text"), value: CUSTOM_TEXT },
        { title: t("Others"), value: population ?? CHOICE_HANDLER }
      ];
    }

    return [];
  }, [iconOnly, population]);

  const extra = useMemo(
    () => ({ placeholder: population ?? "" }),
    [population]
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

  const handleRemove = useCallback(
    () =>
      onChange({
        population: EMPTY,
        populationEntityType: EMPTY,
        populationEntityId: EMPTY
      }),
    [onChange]
  );

  const handleChange = useCallback(
    (v: string) => {
      switch (v) {
        case CHOICE_HANDLER:
        case population: {
          handleClick();
          break;
        }
        case CUSTOM_TEXT: {
          handleRemove();
          break;
        }
      }
    },
    [handleClick, handleRemove, population]
  );

  if (choices.length > 0) {
    return (
      <div className={className}>
        <Select
          choices={choices}
          onChange={handleChange}
          value={defaultValue}
        />
      </div>
    );
  }

  const cls = cn(className, "brz-ed-control-grid--gap");
  let input: JSX.Element | undefined;

  if (population) {
    input = <PopulationInput value={population} onRemove={handleRemove} />;
  } else {
    input = option ? (
      <Options
        data={[option]}
        wrapOptions={false}
        optionClassName="brz-ed-option-population"
      />
    ) : undefined;
  }

  return (
    <div className={cls}>
      {input}
      <PopulationIcon
        className="brz-ed-control__population--handler"
        onClick={handleClick}
      />
    </div>
  );
};
