import { match } from "fp-utilities";
import React, {
  ReactElement,
  Reducer,
  useCallback,
  useEffect,
  useReducer
} from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import {
  filterSavedBlocks,
  filterSavedLayouts,
  filterSavedPopups
} from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { OptionError } from "../../common/Sidebar/OptionError";
import { isBlock, isLayout, isPopup } from "../../common/utils";
import { BlockTypes } from "../../types";
import * as Actions from "./actions";
import { State, initState, reducer } from "./reducer";
import { Props } from "./types";

const EMPTY = "";

export const Filter = <T extends BlockTypes>(props: Props<T>): ReactElement => {
  const { type, value, onChange, api } = props;
  const [state, dispatch] = useReducer<Reducer<State, Actions.Actions>>(
    reducer,
    initState
  );

  const handleChange = useCallback(
    (value: string) => {
      if (value !== EMPTY) {
        onChange(value);
      }
    },
    [onChange]
  );

  useEffect(() => {
    const update = match(
      [isBlock, () => filterSavedBlocks(api)],
      [isPopup, () => filterSavedPopups(api)],
      [isLayout, () => filterSavedLayouts(api)]
    );

    (async () => {
      try {
        const choices = await update(type);
        dispatch(Actions.fetchSuccess(choices));
      } catch (error) {
        if (typeof error === "string") {
          dispatch(Actions.fetchError(error));
        } else {
          dispatch(Actions.fetchError(t("Something went wrong")));
        }
      }
    })();
  }, [type, api]);

  return (
    <>
      {state.error && <OptionError>{state.error}</OptionError>}
      <Select
        className="brz-control__select--dark"
        fullWidth={true}
        maxItems="6"
        itemHeight="30"
        defaultValue={value}
        onChange={handleChange}
      >
        {state.error && (
          <SelectItem title="-" value={EMPTY}>
            -
          </SelectItem>
        )}
        {state.loading ? (
          <SelectItem title={t("Loading...")} value={EMPTY}>
            {t("Loading...")}
          </SelectItem>
        ) : (
          state.choices.map((choice) => (
            <SelectItem key={choice.id} title={choice.label} value={choice.id}>
              {choice.label}
            </SelectItem>
          ))
        )}
      </Select>
    </>
  );
};
