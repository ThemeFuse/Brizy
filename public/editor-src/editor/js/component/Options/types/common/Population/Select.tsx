import React, { ReactElement, useEffect, useReducer, useRef } from "react";
import _ from "underscore";
import { Control } from "visual/component/Controls/Population";
import Config from "visual/global/Config";
import { getCollectionTypes, getSourceIds } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import * as Str from "visual/utils/reader/string";
import { empty } from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { ElementModelValue } from "../../dev/Select/types";
import { ActionTypes, reducer } from "./reducer";
import { Choices, OptGroup } from "./types/Choices";
import { PopulationMethod } from "./types/PopulationMethod";
import { Value } from "./types/Value";
import { findDCChoiceByPlaceholder, handleValuesChange } from "./utils";

export interface Props<T extends Literal> {
  value: T;
  entityType: string;
  entityId: Literal;
  choices: (Choices<T> | OptGroup<T>)[];
  className?: string;
  showChoices?: boolean;
  currentDCChoice?: PopulationMethod;
  onChange: (v: Value) => void;
}

export default function PopulationSelect<T extends Literal>({
  choices,
  value,
  entityType: vEntityType,
  entityId: vEntityId,
  showChoices = true,
  currentDCChoice: _currentDCChoice,
  className,
  onChange
}: Props<T>): ReactElement {
  const config = Config.getAll();

  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    placeholder: Str.read(value) ?? "",
    entityType: {
      value: vEntityType
    },
    entityId: {
      value: vEntityId
    }
  });

  const { isOpen, placeholder, entityType, entityId } = state;

  const oldState = useRef(state);

  const currentDCChoice =
    _currentDCChoice ??
    findDCChoiceByPlaceholder({
      placeholder: Str.read(value) ?? "",
      choices
    });

  const predefinedEntityType = currentDCChoice?.attr?.type;

  const entityTypeChoices = {
    load: () => getCollectionTypes(config),
    emptyLoad: {
      title: t("There are no choices")
    }
  };
  const entityIdChoices = {
    load: () =>
      getSourceIds(
        Str.read(predefinedEntityType || entityType.value) ?? "",
        config
      ),
    emptyLoad: {
      title: t("There are no choices")
    }
  };

  useEffect(() => {
    const v = Str.read(value);

    if (v && oldState.current.placeholder !== v) {
      onPopulationChange(v);
    }
  }, [value]);

  useEffect(() => {
    if (!_.isEqual(oldState.current, state)) {
      oldState.current = state;

      if (placeholder === empty) {
        onChange({
          population: empty,
          populationEntityType: empty,
          populationEntityId: empty
        });
      }

      if (placeholder) {
        const values = handleValuesChange({
          placeholder,
          entityType,
          entityId,
          varryAttr: currentDCChoice?.varyAttr ?? []
        });

        if (values) {
          onChange(values);
        }
      }
    }
    // state is not needed as dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, entityType, entityId, onChange]);

  const handleIconClick = () => {
    dispatch({ type: ActionTypes.SET_VISIBILITY, payload: !state.isOpen });
  };

  const handleClickOutside = () => {
    dispatch({ type: ActionTypes.SET_VISIBILITY, payload: false });
  };

  const onPopulationChange = (payload: string) => {
    dispatch({ type: ActionTypes.SET_PLACEHOLDER, payload });
  };

  const onEntityTypeChange = (payload: ElementModelValue) => {
    dispatch({ type: ActionTypes.SET_ENTITY_TYPE, payload });
  };

  const onEntityIdChange = (payload: ElementModelValue) => {
    dispatch({ type: ActionTypes.SET_ENTITY_ID, payload });
  };

  return (
    <Control<T>
      isOpen={isOpen}
      showChoices={showChoices}
      choices={choices}
      value={value}
      entityType={entityType}
      className={className}
      entityTypeChoices={entityTypeChoices}
      entityId={entityId}
      entityIdChoices={entityIdChoices}
      currentDCChoice={currentDCChoice}
      onChange={onPopulationChange}
      handleClickOutside={handleClickOutside}
      handleIconClick={handleIconClick}
      onEntityTypeChange={onEntityTypeChange}
      onEntityIdChange={onEntityIdChange}
    />
  );
}
