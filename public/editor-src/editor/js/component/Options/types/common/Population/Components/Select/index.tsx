import { Obj, Str } from "@brizy/readers";
import { isEqual } from "es-toolkit";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useRef
} from "react";
import { Control } from "visual/component/Controls/Population";
import { useConfig } from "visual/providers/ConfigProvider";
import { getCollectionItems, getCollectionTypes } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { findDCChoiceByPlaceholder } from "visual/utils/options/Population/utils";
import { auto, isAuto } from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { Choices, OptGroup } from "../../types/Choices";
import { PopulationMethod } from "../../types/PopulationMethod";
import { ElementModelValue, Value } from "./../../types/Value";
import { ActionTypes, State, reducer } from "./reducer";

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

export function PopulationSelect<T extends Literal>({
  choices,
  value,
  entityType: vEntityType,
  entityId: vEntityId,
  showChoices = true,
  currentDCChoice: _currentDCChoice,
  className,
  onChange
}: Props<T>): ReactElement {
  const config = useConfig();

  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    placeholder: Str.read(value) ?? "",
    entityType: {
      value: vEntityType
    },
    entityId: {
      value: vEntityId
    },
    isEntityTypeLoaded: false
  });

  const { isOpen, placeholder, entityType, entityId, isEntityTypeLoaded } =
    state;

  const oldState = useRef(state);

  const currentDCChoice =
    _currentDCChoice ??
    findDCChoiceByPlaceholder({
      placeholder: Str.read(value) ?? "",
      choices
    });

  const predefinedEntityType = currentDCChoice?.attr?.type;

  const entityTypeChoices = {
    load: () =>
      getCollectionTypes(config.api, {
        defaultTitle: t("Auto"),
        defaultValue: auto
      }),
    emptyLoad: {
      title: t("There are no choices")
    }
  };

  const entityIdChoices = {
    load: () =>
      getCollectionItems(
        Str.read(predefinedEntityType || entityType.value) ?? "",
        config,
        [{ title: t("Auto"), value: "" }]
      ),
    emptyLoad: {
      title: t("There are no choices")
    }
  };

  useEffect(() => {
    const v = Str.read(value);

    const toUpdate: Partial<State> = {};

    if (v !== placeholder) {
      toUpdate.placeholder = v;
    }

    if (vEntityType !== entityType.value) {
      toUpdate.entityType = { value: vEntityType };
    }

    if (vEntityId !== entityId.value) {
      toUpdate.entityId = { value: vEntityId };
    }

    if (Obj.length(toUpdate) > 0) {
      dispatch({ type: ActionTypes.SET_BULK, payload: toUpdate });
    }
    // There is no need to add all keys to the dependencies;
    // I only need to update the data when the prop values change, for example, when switching from normal to hover.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, vEntityType, vEntityId]);

  useEffect(() => {
    if (!isEqual(oldState.current, state)) {
      oldState.current = state;

      const populationEntityType = isAuto(entityType.value)
        ? ""
        : Str.read(entityType.value) ?? "";

      onChange({
        population: placeholder,
        populationEntityType,
        populationEntityId: entityId.value
      });
    }
    // state is not needed as dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, entityType, entityId, onChange]);

  const onPopulationChange = (payload: string) => {
    dispatch({ type: ActionTypes.SET_PLACEHOLDER, payload });
  };

  const onEntityTypeChange = (payload: ElementModelValue) => {
    dispatch({
      type: ActionTypes.SET_ENTITY_TYPE,
      payload: {
        value: Str.read(payload.value) ?? auto
      }
    });
  };

  const onEntityIdChange = (payload: ElementModelValue) => {
    dispatch({ type: ActionTypes.SET_ENTITY_ID, payload });
  };

  const onEntityTypeLoad = () => {
    dispatch({ type: ActionTypes.SET_IS_ENTITY_TYPE_LOADED, payload: true });
  };

  const handleOpened = useCallback(
    (opened: boolean) => {
      if (opened) {
        dispatch({ type: ActionTypes.SET_VISIBILITY, payload: !state.isOpen });
      } else {
        dispatch({ type: ActionTypes.SET_VISIBILITY, payload: false });
      }
    },
    [state.isOpen]
  );

  return (
    <Control<Literal>
      isOpen={isOpen}
      isEntityTypeLoaded={isEntityTypeLoaded}
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
      onOpened={handleOpened}
      onEntityTypeChange={onEntityTypeChange}
      onEntityIdChange={onEntityIdChange}
      onEntityTypeLoad={onEntityTypeLoad}
    />
  );
}
