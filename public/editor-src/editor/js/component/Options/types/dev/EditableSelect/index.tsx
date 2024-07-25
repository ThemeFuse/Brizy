import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { SelectEditable2 } from "visual/component/Brizy-ui/SelectEditable";
import { getActive } from "visual/utils/options/EditableSelect/utils";
import {
  Actions,
  Choice,
  OnChangeActionTypes,
  OnChangeCases,
  Props
} from "./types";

export const EditableSelect = ({
  choices,
  value,
  onChange,
  label
}: Props): ReactElement => {
  const activeChoice = getActive(choices, value.value);
  const [state, setState] = useState<Choice>(activeChoice ?? choices[0]);

  useEffect(() => {
    const choice = getActive(choices, value.value);
    setState(choice ?? choices[0]);
  }, [choices, value]);

  const onValueChange = useCallback(
    (a: Actions) => {
      switch (a.type) {
        case OnChangeCases.Delete: {
          onChange({ type: OnChangeActionTypes.remove, payload: state.value });
          setState(choices[0]);
          break;
        }
        case OnChangeCases.Duplicate: {
          const newTitle = state.title + "-copy-" + choices.length;
          onChange({ type: OnChangeActionTypes.duplicate, payload: newTitle });
          break;
        }
        case OnChangeCases.Edit: {
          setState((state) => ({
            ...state,
            title: a.payload
          }));
          onChange({ type: OnChangeActionTypes.edit, payload: a.payload });
          break;
        }
        case OnChangeCases.Symbol: {
          const choice = choices.find((it) => it.title === a.payload);
          if (choice) {
            setState(choice);
            onChange({
              type: OnChangeActionTypes.change,
              payload: choice.value
            });
          }
          break;
        }
      }
    },
    [choices, onChange, state.title, state.value]
  );

  return (
    <>
      {label}
      <SelectEditable2
        value={state.title}
        title={state.title}
        onChange={onValueChange}
        choices={choices}
      />
    </>
  );
};
